import type { FastifyInstance } from 'fastify'
import { query } from '../lib/db.js'
import { requireAuth } from '../middleware/auth.js'

interface ArticleRow {
  id: number
  source: string
  external_article_id: string
  slug: string
  category_code: string
  category_display_name: string
  title: string
  summary: string | null
  body_length: number
  thumbnail_url: string | null
  published_at: string
}

interface ScoredArticleRow extends ArticleRow {
  score?: number
}

function slugToSourceUrl(slug: string, source: string): string | null {
  if (source === 'segye') {
    const m = slug.match(/^segye-(\d+)$/)
    if (m) return `https://www.segye.com/newsView/${m[1]}`
  }
  if (source === 'yonhap') {
    const m = slug.match(/^yna-([a-z0-9]+)$/)
    if (m) return `https://www.yna.co.kr/view/${m[1].toUpperCase()}`
  }
  return null
}

function toArticleDTO(r: ArticleRow) {
  return {
    id: String(r.id),
    source: r.source,
    externalId: r.external_article_id,
    slug: r.slug,
    category: r.category_code,
    categoryDisplayName: r.category_display_name,
    title: r.title,
    summary: r.summary ?? '',
    thumbnailUrl: r.thumbnail_url ?? '',
    publishedAt: r.published_at,
    bodyLength: r.body_length,
    estimatedReadMinutes: Math.max(2, Math.round(r.body_length / 500)),
    sourceUrl: slugToSourceUrl(r.slug, r.source),
  }
}

const SELECT_COLS = `
  a.id, a.source, a.external_article_id, a.slug,
  c.code AS category_code, c.display_name AS category_display_name,
  a.title, a.summary, a.body_length, a.thumbnail_url,
  a.published_at::text AS published_at
`

export default async function feedRoutes(app: FastifyInstance) {
  /**
   * UC-03 — Home 추천 피드 v2.
   * forYou: reading 히스토리 카테고리 가중치 + preferred_categories + 최근성 점수.
   * trending: 이번 주 (KST) 실제 reading_session.completed COUNT 기준, 부족하면 fallback.
   * recent: 최근 발행 (이미 노출된 것 제외).
   * 모든 노출은 recommendation_log 에 기록.
   */
  app.get(
    '/api/feed/home',
    { preHandler: requireAuth },
    async (req, reply) => {
      const userId = req.userId!

      const [prefRes, completedRes] = await Promise.all([
        query<{ preferred_categories: string[] | null }>(
          `SELECT preferred_categories FROM anonymous_user WHERE id = $1`,
          [userId],
        ),
        query<{ article_id: number }>(
          `SELECT DISTINCT article_id FROM reading_session
           WHERE user_id = $1 AND status = 'completed'
             AND completed_at > NOW() - INTERVAL '24 hours'`,
          [userId],
        ),
      ])
      const prefs = prefRes.rows[0]?.preferred_categories ?? []
      const completedIds = completedRes.rows.map((r) => Number(r.article_id))

      // ────────────────────────────────────────────────────
      // For You — 가중치 점수 기반
      //   0.5 * 히스토리(최근 30일) + 0.3 * 선호 카테고리 + 0.2 * 최신성(14일 내)
      // ────────────────────────────────────────────────────
      const forYouRes = await query<ScoredArticleRow>(
        `WITH
           category_history AS (
             SELECT a.category_id, COUNT(*)::int AS read_count
             FROM reading_session rs
             JOIN article a ON a.id = rs.article_id
             WHERE rs.user_id = $1
               AND rs.status = 'completed'
               AND rs.completed_at > NOW() - INTERVAL '30 days'
             GROUP BY a.category_id
           ),
           total_reads AS (
             SELECT GREATEST(COALESCE(SUM(read_count), 0), 1)::float AS total FROM category_history
           ),
           category_weights AS (
             SELECT ch.category_id,
                    (ch.read_count::float / tr.total) AS weight
             FROM category_history ch, total_reads tr
           )
         SELECT ${SELECT_COLS},
                (
                  0.5 * COALESCE(cw.weight, 0)
                  + 0.3 * (CASE WHEN c.code = ANY($3::text[]) THEN 1.0 ELSE 0.0 END)
                  + 0.2 * GREATEST(0, 1 - EXTRACT(EPOCH FROM (NOW() - a.published_at)) / (14 * 86400.0))
                )::numeric AS score
         FROM article a
         JOIN article_category c ON c.id = a.category_id
         LEFT JOIN category_weights cw ON cw.category_id = a.category_id
         WHERE a.deleted_at IS NULL
           AND a.published_at > NOW() - INTERVAL '30 days'
           AND ($2::bigint[] IS NULL OR a.id <> ALL($2::bigint[]))
         ORDER BY score DESC, a.published_at DESC
         LIMIT 6`,
        [
          userId,
          completedIds.length ? completedIds : null,
          prefs.length ? prefs : [],
        ],
      )
      const forYou = forYouRes.rows
      const forYouIds = new Set(forYou.map((a) => a.id))

      // ────────────────────────────────────────────────────
      // Trending — 이번 주 KST 안에 완독된 article COUNT 상위
      // ────────────────────────────────────────────────────
      const trendingRes = await query<ScoredArticleRow>(
        `WITH week_window AS (
           SELECT (DATE_TRUNC('week', NOW() AT TIME ZONE 'Asia/Seoul') AT TIME ZONE 'Asia/Seoul') AS week_start
         ),
         completion_counts AS (
           SELECT rs.article_id, COUNT(*)::int AS cnt
           FROM reading_session rs
           WHERE rs.status = 'completed'
             AND rs.completed_at >= (SELECT week_start FROM week_window)
           GROUP BY rs.article_id
         )
         SELECT ${SELECT_COLS}, cc.cnt::numeric AS score
         FROM article a
         JOIN article_category c ON c.id = a.category_id
         JOIN completion_counts cc ON cc.article_id = a.id
         WHERE a.deleted_at IS NULL
           AND ($1::bigint[] IS NULL OR a.id <> ALL($1::bigint[]))
           AND ($2::bigint[] IS NULL OR a.id <> ALL($2::bigint[]))
         ORDER BY cc.cnt DESC, a.published_at DESC
         LIMIT 3`,
        [
          completedIds.length ? completedIds : null,
          forYouIds.size ? [...forYouIds] : null,
        ],
      )
      let trending = trendingRes.rows

      // Fallback: trending 부족하면 hardcoded ids 로 보강
      if (trending.length < 3) {
        const trendingIds = new Set(trending.map((a) => a.id))
        const fallbackIds = [19, 25, 31].filter(
          (id) =>
            !trendingIds.has(id) &&
            !forYouIds.has(id) &&
            !completedIds.includes(id),
        )
        if (fallbackIds.length > 0) {
          const fb = await query<ScoredArticleRow>(
            `SELECT ${SELECT_COLS}, NULL::numeric AS score
             FROM article a
             JOIN article_category c ON c.id = a.category_id
             WHERE a.id = ANY($1::bigint[]) AND a.deleted_at IS NULL`,
            [fallbackIds],
          )
          trending = [...trending, ...fb.rows].slice(0, 3)
        }
      }
      const trendingIds = new Set(trending.map((a) => a.id))

      // ────────────────────────────────────────────────────
      // Recent — 최근 발행, 위에 등장한 거 제외
      // ────────────────────────────────────────────────────
      const usedIds = [...new Set([...forYouIds, ...trendingIds, ...completedIds])]
      const recentRes = await query<ArticleRow>(
        `SELECT ${SELECT_COLS}
         FROM article a
         JOIN article_category c ON c.id = a.category_id
         WHERE a.deleted_at IS NULL
           AND ($1::bigint[] IS NULL OR a.id <> ALL($1::bigint[]))
         ORDER BY a.published_at DESC
         LIMIT 3`,
        [usedIds.length ? usedIds : null],
      )
      const recent = recentRes.rows

      // ────────────────────────────────────────────────────
      // Recommendation log — 노출 기록 (BG, 실패해도 무시)
      // ────────────────────────────────────────────────────
      try {
        const logRows: { article_id: number; section: string; score: number | null }[] = [
          ...forYou.map((a) => ({
            article_id: a.id,
            section: 'for-you',
            score: a.score != null ? Number(a.score) : null,
          })),
          ...trending.map((a) => ({
            article_id: a.id,
            section: 'trending',
            score: a.score != null ? Number(a.score) : null,
          })),
          ...recent.map((a) => ({
            article_id: a.id,
            section: 'recent',
            score: null,
          })),
        ]
        if (logRows.length > 0) {
          // Bulk INSERT
          const values: string[] = []
          const params: unknown[] = [userId]
          let i = 2
          for (const r of logRows) {
            values.push(`($1, $${i++}, $${i++}, $${i++})`)
            params.push(r.article_id, r.section, r.score)
          }
          await query(
            `INSERT INTO recommendation_log (user_id, article_id, section, score)
             VALUES ${values.join(', ')}`,
            params,
          )
        }
      } catch (err) {
        req.log.warn({ err }, 'recommendation_log insert failed (ignored)')
      }

      return reply.send({
        forYou: forYou.map(toArticleDTO),
        trending: trending.map(toArticleDTO),
        recent: recent.map(toArticleDTO),
      })
    },
  )
}
