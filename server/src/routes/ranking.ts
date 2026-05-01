import type { FastifyInstance } from 'fastify'
import { query } from '../lib/db.js'
import { requireAuth } from '../middleware/auth.js'

interface RankRow {
  public_id: string
  nickname: string
  weekly_points: number
  total_points: number
  stage_code: string
  user_id: number
}

const WEEKLY_RANK_QUERY = `
  WITH week_window AS (
    SELECT (DATE_TRUNC('week', NOW() AT TIME ZONE 'Asia/Seoul')
            AT TIME ZONE 'Asia/Seoul') AS week_start
  )
  SELECT
    u.id::int AS user_id,
    u.public_id,
    u.nickname,
    COALESCE(SUM(pt.amount), 0)::int AS weekly_points,
    COALESCE(t.total_points, 0)::int AS total_points,
    COALESCE(s.code, 'SEED') AS stage_code
  FROM anonymous_user u
  LEFT JOIN tree t ON t.user_id = u.id
  LEFT JOIN tree_growth_stage s ON s.id = t.stage_id
  LEFT JOIN point_transaction pt ON pt.user_id = u.id
    AND pt.created_at >= (SELECT week_start FROM week_window)
  WHERE u.deleted_at IS NULL
  GROUP BY u.id, u.public_id, u.nickname, t.total_points, s.code
  HAVING COALESCE(SUM(pt.amount), 0) > 0
  ORDER BY weekly_points DESC, u.created_at ASC
  LIMIT $1
`

export default async function rankingRoutes(app: FastifyInstance) {
  /**
   * GET /api/ranking/weekly
   * KST ISO 주차 기준 누적 포인트 leaderboard.
   * 이번 주 monday 00:00 KST 부터 현재까지의 point_transaction 합계.
   */
  app.get<{ Querystring: { limit?: string } }>(
    '/api/ranking/weekly',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const lim = Math.max(1, Math.min(100, Number(req.query.limit ?? 50)))

      const result = await query<RankRow>(WEEKLY_RANK_QUERY, [lim])

      const items = result.rows.map((r, i) => ({
        rank: i + 1,
        publicId: r.public_id,
        nickname: r.nickname,
        weeklyPoints: Number(r.weekly_points),
        totalPoints: Number(r.total_points),
        treeStage: r.stage_code,
        isMe: Number(r.user_id) === userId,
      }))

      // 사용자 본인 weekly 합계 조회 (랭킹 밖일 때 별도 표시 위해)
      const meRes = await query<{
        weekly_points: number
        total_points: number
        stage_code: string
        nickname: string
      }>(
        `WITH week_window AS (
            SELECT (DATE_TRUNC('week', NOW() AT TIME ZONE 'Asia/Seoul')
                    AT TIME ZONE 'Asia/Seoul') AS week_start
          ),
          me_weekly AS (
            SELECT COALESCE(SUM(amount), 0)::int AS weekly_points
            FROM point_transaction
            WHERE user_id = $1 AND created_at >= (SELECT week_start FROM week_window)
          )
         SELECT
           (SELECT weekly_points FROM me_weekly) AS weekly_points,
           COALESCE(t.total_points, 0)::int AS total_points,
           COALESCE(s.code, 'SEED') AS stage_code,
           u.nickname
         FROM anonymous_user u
         LEFT JOIN tree t ON t.user_id = u.id
         LEFT JOIN tree_growth_stage s ON s.id = t.stage_id
         WHERE u.id = $1`,
        [userId],
      )
      const me = meRes.rows[0]
      const myInList = items.find((i) => i.isMe)
      const myRank = myInList ? myInList.rank : null

      return reply.send({
        items,
        me: {
          rank: myRank,
          weeklyPoints: Number(me?.weekly_points ?? 0),
          totalPoints: Number(me?.total_points ?? 0),
          treeStage: me?.stage_code ?? 'SEED',
          nickname: me?.nickname ?? '',
        },
        weekKey: getCurrentWeekKey(),
      })
    },
  )
}

function getCurrentWeekKey(): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const today = new Date()
  // ISO week: 가장 가까운 목요일 기준
  const kst = new Date(today.getTime() + 9 * 60 * 60 * 1000)
  const day = kst.getUTCDay() === 0 ? 7 : kst.getUTCDay()
  const monday = new Date(kst)
  monday.setUTCDate(kst.getUTCDate() - day + 1)
  return fmt.format(monday)
}
