import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { signSessionToken } from '../lib/auth.js'
import { deriveAnonymousHash } from '../lib/hash.js'
import { generateNickname } from '../lib/nickname.js'
import { query, withTransaction } from '../lib/db.js'
import { requireAuth } from '../middleware/auth.js'

interface RegisterBody {
  fingerprintHash: string
}

interface UserRow {
  id: number
  public_id: string
  nickname: string
  preferred_categories: string[] | null
  onboarding_completed_at: string | null
  total_points: number
  tree_stage_code: string
  created_at: string
}

const SEED_STAGE_CODE = 'SEED'

export default async function authRoutes(app: FastifyInstance) {
  /**
   * UC-01 — 익명 사용자 등록 또는 기존 사용자 복구.
   * Input: { fingerprintHash }
   * Output: { publicId, sessionToken, nickname, totalPoints, treeStage, preferredCategories, onboardingCompletedAt }
   */
  app.post<{ Body: RegisterBody }>('/api/anonymous/register', async (req, reply) => {
    const fingerprintHash = req.body?.fingerprintHash?.trim()
    if (!fingerprintHash || !/^[a-f0-9]{64}$/.test(fingerprintHash)) {
      return reply.code(400).send({
        error: 'invalid_input',
        message: 'fingerprintHash must be 64 hex characters (sha256)',
      })
    }

    const anonymousHash = deriveAnonymousHash(fingerprintHash)

    const userRow = await withTransaction(async (client) => {
      // Lookup existing user by hash
      const existing = await client.query<UserRow>(
        `SELECT u.id, u.public_id, u.nickname, u.preferred_categories,
                u.onboarding_completed_at,
                COALESCE(t.total_points, 0) AS total_points,
                COALESCE(s.code, 'SEED') AS tree_stage_code,
                u.created_at
         FROM anonymous_user u
         LEFT JOIN tree t ON t.user_id = u.id
         LEFT JOIN tree_growth_stage s ON s.id = t.stage_id
         WHERE u.anonymous_hash = $1 AND u.deleted_at IS NULL`,
        [anonymousHash],
      )
      if (existing.rowCount && existing.rowCount > 0) {
        // Update last_active_at
        await client.query(
          `UPDATE anonymous_user SET last_active_at = NOW() WHERE id = $1`,
          [existing.rows[0].id],
        )
        return existing.rows[0]
      }

      // Create new user
      const publicId = randomUUID()
      const nickname = generateNickname()
      const inserted = await client.query<{ id: number; created_at: string }>(
        `INSERT INTO anonymous_user
           (public_id, anonymous_hash, nickname, preferred_categories)
         VALUES ($1, $2, $3, NULL)
         RETURNING id, created_at`,
        [publicId, anonymousHash, nickname],
      )
      const userId = inserted.rows[0].id

      // Create tree (SEED stage)
      const stageRes = await client.query<{ id: number }>(
        `SELECT id FROM tree_growth_stage WHERE code = $1`,
        [SEED_STAGE_CODE],
      )
      const stageId = stageRes.rows[0].id

      await client.query(
        `INSERT INTO tree (user_id, stage_id, total_points, last_grown_at)
         VALUES ($1, $2, 0, NOW())`,
        [userId, stageId],
      )

      // Initial tree growth history (SEED first time)
      await client.query(
        `INSERT INTO tree_growth_history
           (tree_id, from_stage_id, to_stage_id, points_at_change)
         VALUES ((SELECT id FROM tree WHERE user_id = $1), NULL, $2, 0)`,
        [userId, stageId],
      )

      return {
        id: userId,
        public_id: publicId,
        nickname,
        preferred_categories: null,
        onboarding_completed_at: null,
        total_points: 0,
        tree_stage_code: SEED_STAGE_CODE,
        created_at: inserted.rows[0].created_at,
      } satisfies UserRow
    })

    const sessionToken = signSessionToken(userRow.id)

    return reply.send({
      publicId: userRow.public_id,
      sessionToken,
      nickname: userRow.nickname,
      preferredCategories: userRow.preferred_categories ?? [],
      onboardingCompletedAt: userRow.onboarding_completed_at,
      totalPoints: userRow.total_points,
      treeStage: userRow.tree_stage_code,
      createdAt: userRow.created_at,
    })
  })

  /**
   * GET /api/me — 현재 사용자 정보 (UC-08 세션 복구).
   */
  app.get('/api/me', { preHandler: requireAuth }, async (req, reply) => {
    const userId = req.userId!
    const result = await query<UserRow>(
      `SELECT u.id, u.public_id, u.nickname, u.preferred_categories,
              u.onboarding_completed_at,
              COALESCE(t.total_points, 0) AS total_points,
              COALESCE(s.code, 'SEED') AS tree_stage_code,
              u.created_at
       FROM anonymous_user u
       LEFT JOIN tree t ON t.user_id = u.id
       LEFT JOIN tree_growth_stage s ON s.id = t.stage_id
       WHERE u.id = $1 AND u.deleted_at IS NULL`,
      [userId],
    )
    if (!result.rowCount) {
      return reply.code(404).send({ error: 'not_found', message: 'User not found' })
    }
    const u = result.rows[0]
    // Touch last_active_at
    await query(
      `UPDATE anonymous_user SET last_active_at = NOW() WHERE id = $1`,
      [userId],
    )
    return reply.send({
      publicId: u.public_id,
      nickname: u.nickname,
      preferredCategories: u.preferred_categories ?? [],
      onboardingCompletedAt: u.onboarding_completed_at,
      totalPoints: u.total_points,
      treeStage: u.tree_stage_code,
      createdAt: u.created_at,
    })
  })

  /**
   * PATCH /api/me/preferences — 온보딩 카테고리 저장 (UC-02).
   */
  app.patch<{ Body: { preferredCategories: string[] } }>(
    '/api/me/preferences',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!
      const cats = req.body?.preferredCategories
      if (!Array.isArray(cats) || cats.some((c) => typeof c !== 'string')) {
        return reply.code(400).send({
          error: 'invalid_input',
          message: 'preferredCategories must be string[]',
        })
      }
      // Validate categories exist
      const codesRes = await query<{ code: string }>(
        `SELECT code FROM article_category WHERE code = ANY($1::text[])`,
        [cats],
      )
      const validCodes = new Set(codesRes.rows.map((r) => r.code))
      const filtered = cats.filter((c) => validCodes.has(c))

      await query(
        `UPDATE anonymous_user
         SET preferred_categories = $1::text[],
             onboarding_completed_at = COALESCE(onboarding_completed_at, NOW())
         WHERE id = $2`,
        [filtered, userId],
      )
      return reply.send({ preferredCategories: filtered })
    },
  )
}
