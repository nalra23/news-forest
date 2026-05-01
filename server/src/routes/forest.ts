import type { FastifyInstance } from 'fastify'
import { query } from '../lib/db.js'
import { requireAuth } from '../middleware/auth.js'

interface UserRow {
  public_id: string
  nickname: string
  total_points: number
  stage_code: string
}

const SELECT_USERS = `
  SELECT u.public_id, u.nickname,
         COALESCE(t.total_points, 0) AS total_points,
         COALESCE(s.code, 'SEED') AS stage_code
  FROM anonymous_user u
  LEFT JOIN tree t ON t.user_id = u.id
  LEFT JOIN tree_growth_stage s ON s.id = t.stage_id
  WHERE u.deleted_at IS NULL
`

function toUserDTO(r: UserRow) {
  return {
    publicId: r.public_id,
    nickname: r.nickname,
    totalPoints: Number(r.total_points),
    treeStage: r.stage_code,
  }
}

export default async function forestRoutes(app: FastifyInstance) {
  /**
   * UC-11 — Forest Explore.
   * Query: ?sort=random|top|recent&limit=16
   */
  app.get<{ Querystring: { sort?: string; limit?: string } }>(
    '/api/forest/users',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const sort = (req.query.sort ?? 'random').toLowerCase()
      const lim = Math.max(1, Math.min(100, Number(req.query.limit ?? 16)))

      let orderBy: string
      switch (sort) {
        case 'top':
          orderBy = 'COALESCE(t.total_points, 0) DESC, u.created_at ASC'
          break
        case 'recent':
          orderBy = 'u.created_at DESC'
          break
        case 'random':
        default:
          orderBy = 'RANDOM()'
          break
      }

      // 자기 자신 제외
      const result = await query<UserRow>(
        `${SELECT_USERS} AND u.id <> $1
         ORDER BY ${orderBy}
         LIMIT $2`,
        [userId, lim],
      )
      return reply.send({
        items: result.rows.map(toUserDTO),
        sort,
      })
    },
  )

  /**
   * GET /api/forest/users/:publicId — single user info.
   */
  app.get<{ Params: { publicId: string } }>(
    '/api/forest/users/:publicId',
    { preHandler: requireAuth },
    async (req, reply) => {
      const { publicId } = req.params
      const result = await query<UserRow>(
        `${SELECT_USERS} AND u.public_id = $1 LIMIT 1`,
        [publicId],
      )
      if (!result.rowCount) {
        return reply.code(404).send({ error: 'not_found' })
      }
      return reply.send(toUserDTO(result.rows[0]))
    },
  )
}
