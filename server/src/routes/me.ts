import type { FastifyInstance } from 'fastify'
import { query } from '../lib/db.js'
import { requireAuth } from '../middleware/auth.js'

export default async function meRoutes(app: FastifyInstance) {
  /**
   * UC-10 — Dashboard stats.
   */
  app.get('/api/me/stats', { preHandler: requireAuth }, async (req, reply) => {
    const userId = req.userId!

    const [statsRes, weeklyRes, completionDatesRes] = await Promise.all([
      query<{ total_points: number; stage_code: string; completion_count: number }>(
        `SELECT COALESCE(t.total_points, 0) AS total_points,
                COALESCE(s.code, 'SEED') AS stage_code,
                COALESCE((
                  SELECT COUNT(*) FROM point_transaction pt
                  WHERE pt.user_id = $1 AND pt.type = 'ARTICLE_COMPLETE'
                ), 0)::int AS completion_count
         FROM anonymous_user u
         LEFT JOIN tree t ON t.user_id = u.id
         LEFT JOIN tree_growth_stage s ON s.id = t.stage_id
         WHERE u.id = $1`,
        [userId],
      ),
      query<{ count: number }>(
        `SELECT COUNT(*)::int AS count FROM point_transaction
         WHERE user_id = $1 AND type = 'ARTICLE_COMPLETE'
           AND created_at > NOW() - INTERVAL '7 days'`,
        [userId],
      ),
      query<{ day: string }>(
        `SELECT DISTINCT
                  TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS day
         FROM point_transaction
         WHERE user_id = $1 AND type = 'ARTICLE_COMPLETE'
           AND created_at > NOW() - INTERVAL '60 days'
         ORDER BY day DESC`,
        [userId],
      ),
    ])

    if (!statsRes.rowCount) {
      return reply.code(404).send({ error: 'not_found' })
    }

    // Streak 계산 (KST 기준 일자):
    //  - streak: 오늘 또는 어제부터 거꾸로 연속된 일수 (현재 진행 중 streak)
    //  - longestStreak: 60일 윈도우 내 최장 streak
    //  - streakAtRisk: 어제는 활동했는데 오늘 아직 안 한 경우 (오늘 안 하면 끊어짐)
    //  - lastReadDate: 가장 최근 완료한 KST 날짜 (없으면 null)
    const fmtKST = (d: Date) =>
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d)
    const daySet = new Set(completionDatesRes.rows.map((r) => r.day))
    const todayKst = fmtKST(new Date())
    const yesterdayCursor = new Date()
    yesterdayCursor.setDate(yesterdayCursor.getDate() - 1)
    const yesterdayKst = fmtKST(yesterdayCursor)

    // 현재 진행 streak: 오늘이 있으면 오늘부터, 아니면 어제부터 거꾸로
    let streak = 0
    if (daySet.has(todayKst) || daySet.has(yesterdayKst)) {
      const cursor = new Date()
      if (!daySet.has(todayKst)) cursor.setDate(cursor.getDate() - 1)
      for (let i = 0; i < 60; i++) {
        if (daySet.has(fmtKST(cursor))) {
          streak++
          cursor.setDate(cursor.getDate() - 1)
        } else {
          break
        }
      }
    }

    // longestStreak: 60일 윈도우 내 모든 streak 중 최댓값
    let longestStreak = 0
    {
      const sortedDays: string[] = [...daySet].sort()
      let run = 0
      let lastDay: string | null = null
      for (const day of sortedDays) {
        if (lastDay !== null) {
          const cursorDate: Date = new Date(lastDay + 'T00:00:00Z')
          cursorDate.setUTCDate(cursorDate.getUTCDate() + 1)
          const nextExpected: string = cursorDate.toISOString().slice(0, 10)
          if (nextExpected === day) {
            run++
          } else {
            run = 1
          }
        } else {
          run = 1
        }
        if (run > longestStreak) longestStreak = run
        lastDay = day
      }
    }

    const streakAtRisk = !daySet.has(todayKst) && daySet.has(yesterdayKst)
    const lastReadDate = completionDatesRes.rows[0]?.day ?? null

    // 7-day buckets
    const buckets: { date: string; count: number }[] = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dayStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d)
      const dayCountRes = await query<{ count: number }>(
        `SELECT COUNT(*)::int AS count FROM point_transaction
         WHERE user_id = $1 AND type = 'ARTICLE_COMPLETE'
           AND TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') = $2`,
        [userId, dayStr],
      )
      buckets.push({ date: dayStr, count: dayCountRes.rows[0].count })
    }

    const stats = statsRes.rows[0]
    return reply.send({
      totalPoints: Number(stats.total_points),
      treeStage: stats.stage_code,
      completionCount: stats.completion_count,
      weeklyCompletionCount: weeklyRes.rows[0].count,
      streak,
      longestStreak,
      streakAtRisk,
      lastReadDate,
      last7Days: buckets,
    })
  })

  /**
   * GET /api/me/transactions — 최근 포인트 트랜잭션 history.
   */
  app.get<{ Querystring: { limit?: string } }>(
    '/api/me/transactions',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const lim = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)))

      const result = await query<{
        id: number
        amount: number
        type: string
        balance_after: number
        created_at: string
        article_slug: string | null
        article_title: string | null
        article_category_code: string | null
        article_category_display_name: string | null
        target_nickname: string | null
      }>(
        `SELECT pt.id, pt.amount, pt.type, pt.balance_after,
                pt.created_at::text AS created_at,
                a.slug AS article_slug,
                a.title AS article_title,
                ac.code AS article_category_code,
                ac.display_name AS article_category_display_name,
                tu.nickname AS target_nickname
         FROM point_transaction pt
         LEFT JOIN reading_session rs ON rs.id = pt.reading_session_id
         LEFT JOIN article a ON a.id = rs.article_id
         LEFT JOIN article_category ac ON ac.id = a.category_id
         LEFT JOIN watering_interaction wi ON wi.id = pt.watering_id
         LEFT JOIN anonymous_user tu ON tu.id = wi.target_user_id
         WHERE pt.user_id = $1
         ORDER BY pt.created_at DESC
         LIMIT $2`,
        [userId, lim],
      )

      return reply.send({
        items: result.rows.map((r) => ({
          id: String(r.id),
          amount: Number(r.amount),
          type: r.type,
          balanceAfter: Number(r.balance_after),
          createdAt: r.created_at,
          article: r.article_slug
            ? {
                slug: r.article_slug,
                title: r.article_title,
                category: r.article_category_code,
                categoryDisplayName: r.article_category_display_name,
              }
            : null,
          targetNickname: r.target_nickname,
        })),
      })
    },
  )

  /**
   * DELETE /api/me — PIPA §35·§36 계정 삭제 (soft delete + 재식별 차단).
   */
  app.delete('/api/me', { preHandler: requireAuth }, async (req, reply) => {
    const userId = req.userId!

    await query(
      `UPDATE anonymous_user SET
         deleted_at        = NOW(),
         anonymous_hash    = encode(sha256((id::text || ':' || gen_random_uuid()::text || ':' || NOW()::text)::bytea), 'hex'),
         nickname          = '삭제된 사용자',
         preferred_categories = NULL,
         last_active_at    = NOW(),
         updated_at        = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [userId],
    )

    return reply.send({ deleted: true })
  })

  /**
   * GET /api/me/growth-history — Tree 단계 변화 history.
   */
  app.get(
    '/api/me/growth-history',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const result = await query<{
        id: number
        from_stage_code: string | null
        to_stage_code: string
        points_at_change: number
        changed_at: string
      }>(
        `SELECT h.id,
                fs.code AS from_stage_code,
                ts.code AS to_stage_code,
                h.points_at_change,
                h.changed_at::text AS changed_at
         FROM tree_growth_history h
         JOIN tree t ON t.id = h.tree_id
         LEFT JOIN tree_growth_stage fs ON fs.id = h.from_stage_id
         JOIN tree_growth_stage ts ON ts.id = h.to_stage_id
         WHERE t.user_id = $1
         ORDER BY h.changed_at DESC`,
        [userId],
      )
      return reply.send({
        items: result.rows.map((r) => ({
          id: String(r.id),
          fromStage: r.from_stage_code,
          toStage: r.to_stage_code,
          pointsAtChange: Number(r.points_at_change),
          changedAt: r.changed_at,
        })),
      })
    },
  )
}
