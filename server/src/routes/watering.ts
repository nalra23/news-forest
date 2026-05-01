import type { FastifyInstance } from 'fastify'
import { withTransaction } from '../lib/db.js'
import { progressActiveQuestsForAction } from '../lib/quest.js'
import { calcStage, type TreeStage } from '../lib/tree.js'
import { requireAuth } from '../middleware/auth.js'

const POINTS_PER_WATERING = 2

interface WateringBody {
  targetPublicId: string
}

export default async function wateringRoutes(app: FastifyInstance) {
  /**
   * UC-07 — Watering: 다른 사용자 나무에 물 주기.
   * BR-04: 동일 (actor, target) 페어 24h(KST 일자) 1회 — DB UNIQUE 제약으로 enforce.
   * 행위자에게만 +2P 적립.
   */
  app.post<{ Body: WateringBody }>(
    '/api/watering',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const targetPublicId = req.body?.targetPublicId
      if (!targetPublicId || typeof targetPublicId !== 'string') {
        return reply.code(400).send({ error: 'invalid_input', message: 'targetPublicId required' })
      }

      try {
        const result = await withTransaction(async (client) => {
          // 1. Resolve target user
          const targetRes = await client.query<{ id: number; nickname: string }>(
            `SELECT id, nickname FROM anonymous_user
             WHERE public_id = $1 AND deleted_at IS NULL`,
            [targetPublicId],
          )
          if (!targetRes.rowCount) {
            return { kind: 'target_not_found' as const }
          }
          const target = targetRes.rows[0]
          const targetId = Number(target.id)

          if (targetId === userId) {
            return { kind: 'self' as const }
          }

          // 2. Insert watering with KST date (server-side calc)
          const insertRes = await client.query<{ id: number }>(
            `INSERT INTO watering_interaction
               (actor_user_id, target_user_id, interaction_date_kst)
             VALUES ($1, $2, (NOW() AT TIME ZONE 'Asia/Seoul')::date)
             ON CONFLICT (actor_user_id, target_user_id, interaction_date_kst)
               DO NOTHING
             RETURNING id`,
            [userId, targetId],
          )
          if (!insertRes.rowCount) {
            return { kind: 'already_today' as const, targetNickname: target.nickname }
          }
          const wateringId = Number(insertRes.rows[0].id)

          // 3. Lock actor's tree, compute new total + stage
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
          if (!treeRes.rowCount) throw new Error('tree row missing for actor')
          const tree = treeRes.rows[0]
          const oldTotal = Number(tree.total_points)
          const newTotal = oldTotal + POINTS_PER_WATERING
          const newStageCode = calcStage(newTotal)
          const stageChanged = tree.stage_code !== newStageCode

          // 4. Insert point transaction (+2P)
          await client.query(
            `INSERT INTO point_transaction
               (user_id, amount, type, watering_id, balance_after)
             VALUES ($1, $2, 'WATERING', $3, $4)`,
            [userId, POINTS_PER_WATERING, wateringId, newTotal],
          )

          // 5. Update tree (+ history if stage changed)
          if (stageChanged) {
            const stageIdRes = await client.query<{ id: number }>(
              `SELECT id FROM tree_growth_stage WHERE code = $1`,
              [newStageCode],
            )
            const newStageId = Number(stageIdRes.rows[0].id)
            await client.query(
              `UPDATE tree
               SET total_points=$1, stage_id=$2, last_grown_at=NOW()
               WHERE id=$3`,
              [newTotal, newStageId, tree.id],
            )
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

          // Quest progress
          const questRewards = await progressActiveQuestsForAction(
            client,
            userId,
            'WATERING',
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
            stageChanged || questRewards.some((r) => r.stageChanged)

          return {
            kind: 'success' as const,
            wateringId: String(wateringId),
            targetNickname: target.nickname,
            pointsAwarded: POINTS_PER_WATERING,
            totalPoints: finalTotal,
            treeStage: finalStage,
            stageChanged: finalStageChanged,
            fromStage:
              finalStageChanged ? (tree.stage_code as TreeStage) : null,
            toStage: finalStage,
            questRewards,
          }
        })

        if (result.kind === 'target_not_found') {
          return reply.code(404).send({ error: 'target_not_found' })
        }
        if (result.kind === 'self') {
          return reply.code(400).send({ error: 'cannot_water_self' })
        }
        if (result.kind === 'already_today') {
          return reply.code(409).send({
            error: 'already_watered_today',
            targetNickname: result.targetNickname,
          })
        }
        return reply.send(result)
      } catch (err) {
        req.log.error(err)
        return reply.code(500).send({ error: 'server_error' })
      }
    },
  )
}
