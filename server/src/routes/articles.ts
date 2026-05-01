import type { FastifyInstance } from 'fastify'
import { query } from '../lib/db.js'

const VALID_CATEGORIES = new Set([
  'politics',
  'economy',
  'society',
  'it',
  'culture',
  'sports',
])

interface ArticleRow {
  id: number
  source: string
  external_article_id: string
  slug: string
  category_code: string
  category_display_name: string
  title: string
  summary: string | null
  body: string
  body_length: number
  thumbnail_url: string | null
  published_at: string
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
    body: r.body,
    thumbnailUrl: r.thumbnail_url ?? '',
    publishedAt: r.published_at,
    bodyLength: r.body_length,
    estimatedReadMinutes: Math.max(2, Math.round(r.body_length / 500)),
    sourceUrl: slugToSourceUrl(r.slug, r.source),
  }
}

const SELECT = `
  SELECT a.id, a.source, a.external_article_id, a.slug,
         c.code AS category_code, c.display_name AS category_display_name,
         a.title, a.summary, a.body, a.body_length, a.thumbnail_url,
         a.published_at::text AS published_at
  FROM article a
  JOIN article_category c ON c.id = a.category_id
  WHERE a.deleted_at IS NULL
`

export default async function articleRoutes(app: FastifyInstance) {
  /**
   * GET /api/articles — 카테고리별 / 전체 article 목록.
   * Query: ?category=it&limit=20&offset=0
   */
  app.get<{ Querystring: { category?: string; limit?: string; offset?: string } }>(
    '/api/articles',
    async (req, reply) => {
      const { category, limit, offset } = req.query
      const lim = Math.max(1, Math.min(100, Number(limit ?? 20)))
      const off = Math.max(0, Number(offset ?? 0))

      if (category && !VALID_CATEGORIES.has(category)) {
        return reply.code(400).send({
          error: 'invalid_input',
          message: `category must be one of: ${[...VALID_CATEGORIES].join(', ')}`,
        })
      }

      const params: unknown[] = []
      let where = ''
      if (category) {
        params.push(category)
        where = `AND c.code = $${params.length}`
      }
      params.push(lim, off)
      const result = await query<ArticleRow>(
        `${SELECT} ${where}
         ORDER BY a.published_at DESC
         LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params,
      )
      return reply.send({
        items: result.rows.map(toArticleDTO),
        limit: lim,
        offset: off,
      })
    },
  )

  /**
   * GET /api/articles/:slug — 단일 article 본문.
   */
  app.get<{ Params: { slug: string } }>(
    '/api/articles/by-slug/:slug',
    async (req, reply) => {
      const { slug } = req.params
      if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        return reply.code(400).send({ error: 'invalid_input', message: 'invalid slug' })
      }
      const result = await query<ArticleRow>(
        `${SELECT} AND a.slug = $1 LIMIT 1`,
        [slug],
      )
      if (!result.rowCount) {
        return reply.code(404).send({ error: 'not_found' })
      }
      return reply.send(toArticleDTO(result.rows[0]))
    },
  )

  /**
   * GET /api/articles/categories — 카테고리 목록 (lookup).
   */
  app.get('/api/articles/categories', async (_req, reply) => {
    const result = await query<{ code: string; display_name: string; sort_order: number }>(
      `SELECT code, display_name, sort_order
       FROM article_category
       ORDER BY sort_order`,
    )
    return reply.send({
      items: result.rows.map((r) => ({
        code: r.code,
        displayName: r.display_name,
        sortOrder: r.sort_order,
      })),
    })
  })
}
