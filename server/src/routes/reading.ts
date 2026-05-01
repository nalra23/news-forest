import type { FastifyInstance } from 'fastify'
import { query, withTransaction } from '../lib/db.js'
import { progressActiveQuestsForAction, type QuestRewardEvent } from '../lib/quest.js'
import { calcStreakDelta } from '../lib/streak.js'
import { calcStage, type TreeStage } from '../lib/tree.js'
import { requireAuth } from '../middleware/auth.js'

const POINTS_PER_ARTICLE = 10
const SCROLL_THRESHOLD = 0.9
const DWELL_THRESHOLD_SEC = 30
/** UC-05 §8.6 — anti-fraud */
const FRAUD_MIN_DWELL_SEC = 5
const FRAUD_DWELL_OVERFLOW_RATIO = 1.2 // dwell ≤ 1.2× elapsed
const COMPLETION_TTL_HOURS = 24

interface StartBody {
  articleId: string
  clientMetadata?: Record<string, unknown>
}

interface CompleteBody {
  maxScrollPct: number
  dwellSeconds: number
}

export default async function readingRoutes(app: FastifyInstance) {
  /**
   * UC-04 — Reading session 생성.
   * 24h 내 같은 article 완독 이력 있으면 alreadyCompleted=true 반환 (포인트 미적립).
   */
  app.post<{ Body: StartBody }>(
    '/api/reading-sessions',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const articleIdRaw = req.body?.articleId
      const articleId = Number(articleIdRaw)
      if (!articleIdRaw || !Number.isFinite(articleId)) {
        return reply.code(400).send({ error: 'invalid_input', message: 'articleId required' })
      }

      // Verify article exists
      const articleRes = await query<{ id: number }>(
        `SELECT id FROM article WHERE id = $1 AND deleted_at IS NULL`,
        [articleId],
      )
      if (!articleRes.rowCount) {
        return reply.code(404).send({ error: 'not_found', message: 'article not found' })
      }

      // Check 24h completion
      const dupRes = await query<{ completed_at: string }>(
        `SELECT completed_at::text AS completed_at
         FROM reading_session
         WHERE user_id = $1 AND article_id = $2 AND status = 'completed'
           AND completed_at > NOW() - INTERVAL '${COMPLETION_TTL_HOURS} hours'
         ORDER BY completed_at DESC LIMIT 1`,
        [userId, articleId],
      )
      const alreadyCompleted = dupRes.rowCount! > 0

      // Always insert a new session (multiple sessions per article allowed)
      const insertRes = await query<{ id: number; started_at: string }>(
        `INSERT INTO reading_session
           (user_id, article_id, status, client_metadata)
         VALUES ($1, $2, 'reading', $3)
         RETURNING id, started_at::text AS started_at`,
        [userId, articleId, req.body?.clientMetadata ?? null],
      )

      return reply.send({
        sessionId: String(insertRes.rows[0].id),
        startedAt: insertRes.rows[0].started_at,
        alreadyCompleted,
        previousCompletedAt: alreadyCompleted ? dupRes.rows[0].completed_at : null,
        thresholds: {
          scroll: SCROLL_THRESHOLD,
          dwellSeconds: DWELL_THRESHOLD_SEC,
        },
      })
    },
  )

  /**
   * UC-05 — Reading session 완독 검증.
   * Atomic transaction: validate → mark completed → +10P → tree update → growth history.
   */
  app.post<{ Params: { id: string }; Body: CompleteBody }>(
    '/api/reading-sessions/:id/complete',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const sessionId = Number(req.params.id)
      if (!Number.isFinite(sessionId)) {
        return reply.code(400).send({ error: 'invalid_input' })
      }

      const { maxScrollPct, dwellSeconds } = req.body ?? {}
      if (
        typeof maxScrollPct !== 'number' ||
        typeof dwellSeconds !== 'number' ||
        maxScrollPct < 0 ||
        maxScrollPct > 1 ||
        dwellSeconds < 0
      ) {
        return reply.code(400).send({
          error: 'invalid_input',
          message: 'maxScrollPct ∈ [0,1], dwellSeconds ≥ 0',
        })
      }

      try {
        const result = await withTransaction(async (client) => {
          // 1. Lock session, verify ownership + status
          const sessRes = await client.query<{
            id: number
            user_id: number
            article_id: number
            status: string
            started_at: string
          }>(
            `SELECT id, user_id, article_id, status, started_at::text AS started_at
             FROM reading_session WHERE id = $1 FOR UPDATE`,
            [sessionId],
          )
          if (!sessRes.rowCount) {
            return { kind: 'not_found' as const }
          }
          const sess = sessRes.rows[0]
          if (Number(sess.user_id) !== userId) {
            return { kind: 'forbidden' as const }
          }
          if (sess.status !== 'reading') {
            return { kind: 'already_finalized' as const, status: sess.status }
          }

          // 2. Anti-fraud: dwell vs elapsed wall-clock
          const startedAtMs = new Date(sess.started_at).getTime()
          const elapsedSec = (Date.now() - startedAtMs) / 1000
          const isSuspicious =
            dwellSeconds < FRAUD_MIN_DWELL_SEC ||
            dwellSeconds > elapsedSec * FRAUD_DWELL_OVERFLOW_RATIO

          // 3. Threshold check (90% scroll + 30s dwell)
          const meetsThresholds =
            maxScrollPct >= SCROLL_THRESHOLD && dwellSeconds >= DWELL_THRESHOLD_SEC

          if (!meetsThresholds) {
            // 미충족 — failed 로 마킹, 포인트 미지급
            await client.query(
              `UPDATE reading_session
               SET status='failed',
                   max_scroll_pct=$1,
                   dwell_seconds=$2,
                   is_suspicious=$3
               WHERE id=$4`,
              [maxScrollPct, dwellSeconds, isSuspicious, sessionId],
            )
            return {
              kind: 'incomplete' as const,
              maxScrollPct,
              dwellSeconds,
              meetsScroll: maxScrollPct >= SCROLL_THRESHOLD,
              meetsDwell: dwellSeconds >= DWELL_THRESHOLD_SEC,
            }
          }

          // 4. 24h duplicate check
          const dupRes = await client.query<{ id: number }>(
            `SELECT id FROM reading_session
             WHERE user_id = $1 AND article_id = $2 AND status = 'completed'
               AND completed_at > NOW() - INTERVAL '${COMPLETION_TTL_HOURS} hours'
               AND id <> $3
             LIMIT 1`,
            [userId, sess.article_id, sessionId],
          )
          if (dupRes.rowCount! > 0) {
            await client.query(
              `UPDATE reading_session
               SET status='failed',
                   max_scroll_pct=$1,
                   dwell_seconds=$2,
                   is_suspicious=$3
               WHERE id=$4`,
              [maxScrollPct, dwellSeconds, isSuspicious, sessionId],
            )
            return { kind: 'already_completed_recently' as const }
          }

          // 5. Mark completed
          await client.query(
            `UPDATE reading_session
             SET status='completed',
                 completed_at=NOW(),
                 max_scroll_pct=$1,
                 dwell_seconds=$2,
                 is_suspicious=$3
             WHERE id=$4`,
            [maxScrollPct, dwellSeconds, isSuspicious, sessionId],
          )

          // 6. Lock tree, compute new total + stage
          const treeRes = await client.query<{
            id: number
            stage_id: number
            stage_code: string
            total_points: number
          }>(
            `SELECT t.id, t.stage_id, s.code AS stage_code, t.total_points
             FROM tree t JOIN tree_growth_stage s ON s.id = t.stage_id
             WHERE t.user_id = $1 FOR UPDATE`,
            [userId],
          )
          if (!treeRes.rowCount) {
            throw new Error('tree row missing for user')
          }
          const tree = treeRes.rows[0]
          const oldTotal = Number(tree.total_points)
          const newTotal = oldTotal + POINTS_PER_ARTICLE
          const newStageCode = calcStage(newTotal)
          const stageChanged = tree.stage_code !== newStageCode

          // 7. Insert point transaction (+10P)
          await client.query(
            `INSERT INTO point_transaction
               (user_id, amount, type, reading_session_id, balance_after)
             VALUES ($1, $2, 'ARTICLE_COMPLETE', $3, $4)`,
            [userId, POINTS_PER_ARTICLE, sessionId, newTotal],
          )

          // 8. Update tree (and stage if changed)
          let newStageId = tree.stage_id
          if (stageChanged) {
            const stageIdRes = await client.query<{ id: number }>(
              `SELECT id FROM tree_growth_stage WHERE code = $1`,
              [newStageCode],
            )
            newStageId = Number(stageIdRes.rows[0].id)
            await client.query(
              `UPDATE tree
               SET total_points=$1, stage_id=$2, last_grown_at=NOW()
               WHERE id=$3`,
              [newTotal, newStageId, tree.id],
            )
            // 9. Insert growth history
            await client.query(
              `INSERT INTO tree_growth_history
                 (tree_id, from_stage_id, to_stage_id, points_at_change)
               VALUES ($1, $2, $3, $4)`,
              [tree.id, tree.stage_id, newStageId, newTotal],
            )
          } else {
            await client.query(
              `UPDATE tree SET total_points=$1 WHERE id=$2`,
              [newTotal, tree.id],
            )
          }

          // 10. Quest progress (auto-claim 시 추가 reward + tree 업데이트)
          const questRewards = await progressActiveQuestsForAction(
            client,
            userId,
            'READ_ARTICLE',
          )
          const finalTotal =
            questRewards.length > 0
              ? questRewards[questRewards.length - 1].newTotalPoints
              : newTotal
          const finalStage =
            questRewards.length > 0
              ? questRewards[questRewards.length - 1].newTreeStage
              : (newStageCode as TreeStage)
          const finalStageChanged =
            stageChanged ||
            questRewards.some((r: QuestRewardEvent) => r.stageChanged)

          // 11. Streak 갱신 (read-your-own-writes — 위 INSERT 보임)
          const streak = await calcStreakDelta(client, userId)

          return {
            kind: 'completed' as const,
            pointsAwarded: POINTS_PER_ARTICLE,
            totalPoints: finalTotal,
            treeStage: finalStage,
            stageChanged: finalStageChanged,
            fromStage:
              finalStageChanged ? (tree.stage_code as TreeStage) : null,
            toStage: finalStage,
            isSuspicious,
            questRewards,
            streakDays: streak.streakDays,
            previousStreak: streak.previousStreak,
            streakMilestone: streak.milestone,
          }
        })

        // Map outcome to HTTP response
        if (result.kind === 'not_found') {
          return reply.code(404).send({ error: 'not_found' })
        }
        if (result.kind === 'forbidden') {
          return reply.code(403).send({ error: 'forbidden' })
        }
        if (result.kind === 'already_finalized') {
          return reply.code(409).send({
            error: 'already_finalized',
            status: result.status,
          })
        }
        if (result.kind === 'incomplete') {
          return reply.code(200).send({
            completed: false,
            reason: 'thresholds_not_met',
            maxScrollPct: result.maxScrollPct,
            dwellSeconds: result.dwellSeconds,
            meetsScroll: result.meetsScroll,
            meetsDwell: result.meetsDwell,
          })
        }
        if (result.kind === 'already_completed_recently') {
          return reply.code(200).send({
            completed: false,
            reason: 'already_completed_recently',
            ttlHours: COMPLETION_TTL_HOURS,
          })
        }
        return reply.send({
          completed: true,
          ...result,
        })
      } catch (err) {
        req.log.error(err)
        return reply.code(500).send({ error: 'server_error' })
      }
    },
  )

  /**
   * GET /api/reading-sessions/:id — 단일 세션 조회 (디버깅용).
   */
  app.get<{ Params: { id: string } }>(
    '/api/reading-sessions/:id',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const sessionId = Number(req.params.id)
      if (!Number.isFinite(sessionId)) {
        return reply.code(400).send({ error: 'invalid_input' })
      }
      const res = await query<{
        id: number
        article_id: number
        status: string
        max_scroll_pct: string
        dwell_seconds: number
        is_suspicious: boolean
        started_at: string
        completed_at: string | null
      }>(
        `SELECT id, article_id, status, max_scroll_pct,
                dwell_seconds, is_suspicious,
                started_at::text AS started_at,
                completed_at::text AS completed_at
         FROM reading_session
         WHERE id = $1 AND user_id = $2`,
        [sessionId, userId],
      )
      if (!res.rowCount) {
        return reply.code(404).send({ error: 'not_found' })
      }
      const r = res.rows[0]
      return reply.send({
        sessionId: String(r.id),
        articleId: String(r.article_id),
        status: r.status,
        maxScrollPct: Number(r.max_scroll_pct),
        dwellSeconds: r.dwell_seconds,
        isSuspicious: r.is_suspicious,
        startedAt: r.started_at,
        completedAt: r.completed_at,
      })
    },
  )
}
