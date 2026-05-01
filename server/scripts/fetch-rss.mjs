/**
 * RSS 뉴스 수집 스크립트
 * 세계일보(5개 카테고리) + 연합뉴스(IT/산업) RSS를 파싱해 DB에 upsert.
 *
 * 실행:
 *   npm run fetch-news          — RSS만 수집 (빠름)
 *   npm run fetch-news:ai       — RSS + AI 요약 생성 (ANTHROPIC_API_KEY 필요)
 *   npm run fetch-news:dry      — DB 쓰기 없이 미리보기
 */
import 'dotenv/config'
import pg from 'pg'
import Anthropic from '@anthropic-ai/sdk'

const { Pool } = pg

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const DRY_RUN = process.argv.includes('--dry-run')
const USE_AI  = process.argv.includes('--ai')

// AI 요약 동시 요청 수 (Haiku rate-limit 고려)
const AI_CONCURRENCY = 3

// ─── RSS 피드 설정 ───────────────────────────────────────────────
const FEEDS = [
  { source: 'segye', category: 'politics', url: 'https://www.segye.com/Articles/RSSList/segye_politic.xml' },
  { source: 'segye', category: 'economy',  url: 'https://www.segye.com/Articles/RSSList/segye_economy.xml'  },
  { source: 'segye', category: 'society',  url: 'https://www.segye.com/Articles/RSSList/segye_society.xml'  },
  { source: 'segye', category: 'culture',  url: 'https://www.segye.com/Articles/RSSList/segye_culture.xml'  },
  { source: 'segye', category: 'sports',   url: 'https://www.segye.com/Articles/RSSList/segye_sports.xml'   },
]

// ─── XML 파싱 유틸 ────────────────────────────────────────────────

function extractTag(xml, tag) {
  const re = new RegExp(
    `<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`,
  )
  const m = xml.match(re)
  if (!m) return ''
  return (m[1] ?? m[2] ?? '').trim()
}

function extractAttr(xml, tag, attr) {
  const re = new RegExp(`<${tag}[^>]+${attr}="([^"]+)"`)
  const m = xml.match(re)
  return m ? m[1] : null
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim()
}

function toAbsUrl(url) {
  if (!url) return null
  if (url.startsWith('//')) return `https:${url}`
  return url
}

function makeSlug(source, link) {
  if (source === 'segye') {
    const m = link.match(/newsView\/(\d+)/)
    if (m) return `segye-${m[1]}`
  }
  if (source === 'yonhap') {
    const m = link.match(/view\/([A-Za-z0-9]+)/)
    if (m) return `yna-${m[1].toLowerCase()}`
  }
  const tail = link.replace(/[^a-z0-9]/gi, '').slice(-12).toLowerCase()
  return `${source}-${tail}`
}

function makeExternalId(source, link) {
  if (source === 'segye') {
    const m = link.match(/newsView\/(\d+)/)
    if (m) return m[1]
  }
  if (source === 'yonhap') {
    const m = link.match(/view\/([A-Za-z0-9]+)/)
    if (m) return m[1]
  }
  return link.slice(-20)
}

// ─── RSS 파싱 ─────────────────────────────────────────────────────

function parseItems(xml, source) {
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  const results = []
  let m

  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1]

    const title = stripHtml(extractTag(block, 'title'))
    const link =
      extractTag(block, 'link') ||
      (block.match(/<link>([^<]+)<\/link>/) || [])[1] ||
      ''
    const pubDateStr = (block.match(/<pubDate>([^<]+)<\/pubDate>/) || [])[1] || ''
    const rawDesc = extractTag(block, 'description')

    if (!title || !link) continue

    const slug = makeSlug(source, link)
    if (!/^[a-z0-9-]+$/.test(slug)) continue

    const externalId = makeExternalId(source, link)

    let thumbnailUrl = toAbsUrl(extractAttr(block, 'media:content', 'url'))
    if (!thumbnailUrl && source === 'segye') {
      thumbnailUrl = toAbsUrl(extractAttr(rawDesc, 'img', 'src'))
    }

    const bodyText = stripHtml(rawDesc)
    if (bodyText.length < 20) continue

    const summary = bodyText.slice(0, 200)

    let publishedAt = new Date().toISOString()
    if (pubDateStr) {
      const d = new Date(pubDateStr)
      if (!isNaN(d.getTime())) publishedAt = d.toISOString()
    }

    results.push({
      slug, externalId, title, summary,
      body: bodyText,
      bodyLength: bodyText.length,
      thumbnailUrl: thumbnailUrl || null,
      publishedAt,
      link,
    })
  }

  return results
}

// ─── AI 요약 생성 ─────────────────────────────────────────────────

const SYSTEM_PROMPT = `당신은 뉴스 편집 보조 AI입니다.
주어진 뉴스 기사의 제목과 내용 단편을 바탕으로, 독자가 읽기 좋은 한국어 뉴스 본문을 작성하세요.

규칙:
- 반드시 주어진 정보에만 기반하여 작성 (사실 추가·추측 금지)
- 900~1100자 분량, 정확히 3개 단락
- 뉴스 기사체 유지 (객관적·간결·존댓말 X)
- 마크다운·특수기호(#, *, -, 등)·이모지 사용 절대 금지
- 단락 사이는 빈 줄 하나로 구분
- 각 단락은 최소 2문장 이상`

let anthropicClient = null

function getAnthropicClient() {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not set in .env')
    }
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return anthropicClient
}

async function aiSummarize(title, snippet) {
  const client = getAnthropicClient()
  const userMsg = `제목: ${title}\n\n내용 단편:\n${snippet}`

  const res = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' }, // 시스템 프롬프트 캐싱
      },
    ],
    messages: [{ role: 'user', content: userMsg }],
  })

  if (res.content[0]?.type !== 'text') return null
  return res.content[0].text
    .split('\n')
    .filter(line => !line.startsWith('#'))  // 마크다운 헤더 제거
    .join('\n')
    .trim()
}

/** concurrency 제한 병렬 실행 */
async function mapConcurrent(items, fn, concurrency) {
  const results = []
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency)
    const chunkResults = await Promise.all(chunk.map(fn))
    results.push(...chunkResults)
  }
  return results
}

// ─── 메인 ─────────────────────────────────────────────────────────

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  if (DRY_RUN) console.log('[dry-run mode — DB write 없음]')
  if (USE_AI)  console.log('[AI 요약 모드 — claude-haiku-4-5 사용]')
  console.log()

  const pool = DRY_RUN ? null : new Pool({ connectionString: process.env.DATABASE_URL })

  const catMap = new Map()
  if (!DRY_RUN) {
    const cats = await pool.query('SELECT id, code FROM article_category')
    for (const r of cats.rows) catMap.set(r.code, r.id)
  }

  let totalInserted = 0
  let totalSkipped  = 0
  let totalErrors   = 0
  let totalAiOk     = 0
  let totalAiFail   = 0

  for (const feed of FEEDS) {
    console.log(`📡 ${feed.source}/${feed.category}`)

    let xml
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(12_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      xml = await res.text()
    } catch (err) {
      console.error(`  ❌ fetch 실패: ${err.message}`)
      totalErrors++
      continue
    }

    let items = parseItems(xml, feed.source)
    console.log(`  파싱: ${items.length}개`)

    // ── 신규 + 본문 짧은 기존 기사 AI 요약 대상 선정 ─────────────
    if (!DRY_RUN && USE_AI && items.length > 0) {
      const slugs = items.map(it => it.slug)
      const existing = await pool.query(
        `SELECT slug, body_length FROM article WHERE slug = ANY($1)`,
        [slugs],
      )
      const existMap = new Map(existing.rows.map(r => [r.slug, r.body_length]))
      // 신규 기사 + AI 요약이 없는 기존 기사(body_length < 500) 대상
      const aiTargets = items.filter(it => !existMap.has(it.slug) || existMap.get(it.slug) < 1000)
      const skipItems = items.filter(it => existMap.has(it.slug) && existMap.get(it.slug) >= 1000)
      console.log(`  AI 요약 대상: ${aiTargets.length}개 / 스킵: ${skipItems.length}개`)

      if (aiTargets.length > 0) {
        console.log(`  🤖 AI 요약 생성 중...`)
        const aiResults = await mapConcurrent(
          aiTargets,
          async (item) => {
            try {
              const aiBody = await aiSummarize(item.title, item.summary)
              if (aiBody && aiBody.length > 50) {
                totalAiOk++
                return { ...item, body: aiBody, bodyLength: aiBody.length, isAiSummary: true }
              }
            } catch (err) {
              console.warn(`    ⚠ AI 실패 [${item.slug.slice(0,20)}]: ${err.message}`)
              totalAiFail++
            }
            return item
          },
          AI_CONCURRENCY,
        )
        items = [...skipItems, ...aiResults]
      }
    }

    if (DRY_RUN) {
      for (const it of items.slice(0, 2)) {
        console.log(`  [${it.slug}] ${it.title.slice(0, 50)}`)
        console.log(`    body(${it.bodyLength}자): ${it.body.slice(0, 100)}...`)
      }
      if (items.length > 2) console.log(`  ... 외 ${items.length - 2}개`)
      continue
    }

    const catId = catMap.get(feed.category)
    if (!catId) { console.error(`  ❌ 알 수 없는 카테고리: ${feed.category}`); continue }

    let inserted = 0
    let skipped  = 0

    for (const item of items) {
      try {
        // AI 요약 기사: ON CONFLICT 시 body 업데이트 (기존 짧은 본문 교체)
        const sql = item.isAiSummary
          ? `INSERT INTO article
               (source, external_article_id, slug, category_id,
                title, summary, body, body_length, thumbnail_url, published_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT (slug) DO UPDATE
               SET body = EXCLUDED.body,
                   body_length = EXCLUDED.body_length
             RETURNING id`
          : `INSERT INTO article
               (source, external_article_id, slug, category_id,
                title, summary, body, body_length, thumbnail_url, published_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             ON CONFLICT DO NOTHING
             RETURNING id`

        const res = await pool.query(sql, [
          feed.source, item.externalId, item.slug, catId,
          item.title, item.summary, item.body, item.bodyLength,
          item.thumbnailUrl, item.publishedAt,
        ])
        if (res.rowCount > 0) inserted++
        else skipped++
      } catch (err) {
        console.error(`  ⚠ DB 오류 [${item.slug}]: ${err.message}`)
        skipped++
      }
    }

    console.log(`  ✅ 신규/업데이트 ${inserted}개, 스킵 ${skipped}개`)
    totalInserted += inserted
    totalSkipped  += skipped
  }

  if (!DRY_RUN) await pool.end()

  console.log(`\n완료 — 신규/업데이트: ${totalInserted}개, 스킵: ${totalSkipped}개, 피드 오류: ${totalErrors}건`)
  if (USE_AI) {
    console.log(`AI 요약 — 성공: ${totalAiOk}개, 실패(원본 사용): ${totalAiFail}개`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
