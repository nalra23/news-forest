import type { FastifyInstance } from 'fastify'
import { withTransaction } from '../lib/db.js'
import { ensureActiveQuestsForUser } from '../lib/quest.js'
import { requireAuth } from '../middleware/auth.js'

export default async function questRoutes(app: FastifyInstance) {
  /**
   * GET /api/quests/active
   * 사용자의 현재 active period 의 quest 목록 (daily + weekly).
   * 없으면 자동 생성. progress_count, completed_at, reward_granted 포함.
   */
  app.get(
    '/api/quests/active',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!

      const list = await withTransaction(async (client) => {
        return ensureActiveQuestsForUser(client, userId)
      })

      return reply.send({
        items: list.map((q) => ({
          questId: String(q.id),
          code: q.code,
          title: q.title,
          description: q.description,
          questType: q.quest_type,
          targetAction: q.target_action,
          targetCount: q.target_count,
          rewardPoints: q.reward_points,
          progressCount: Number(q.participation.progress_count),
          completedAt: q.participation.completed_at,
          rewardGranted: q.participation.reward_granted,
          periodKey: q.participation.period_key,
        })),
      })
    },
  )
}
