import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

/**
 * 지정된 nickname 의 사용자에게 streak 패턴 시뮬레이션.
 * ARTICLE_COMPLETE point_transaction 을 KST 일자별로 INSERT.
 *
 * usage:
 *   node scripts/seed-streak.mjs <nickname> [pattern]
 *
 * 예: node scripts/seed-streak.mjs 푸른햇살-3030 active7
 *
 * pattern (default: active3):
 *   active3   — 오늘 포함 3일 연속
 *   active7   — 오늘 포함 7일 연속 (마일스톤)
 *   active30  — 오늘 포함 30일 연속 (마일스톤)
 *   atRisk    — 어제까지 4일 (오늘 미활동)
 *   broken    — 4일 전~7일 전 활동, 그 후 끊김
 *
 * 주의: 데모용. 같은 user 에 여러 번 돌리면 중복 INSERT.
 */

const PATTERNS = {
  active3: [0, 1, 2],
  active7: [0, 1, 2, 3, 4, 5, 6],
  active30: Array.from({ length: 30 }, (_, i) => i),
  atRisk: [1, 2, 3, 4],
  broken: [4, 5, 6, 7],
  // 오늘 미활동 + 어제까지 6일 — 오늘 article 1편 완료 시 7-day milestone 트리거
  preMilestone7: [1, 2, 3, 4, 5, 6],
}

function kstNoonNDaysAgo(n) {
  // KST 정오 시각의 UTC Date 객체 반환 (KST 정오 = UTC 03:00)
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 3600 * 1000)
  kst.setUTCHours(12, 0, 0, 0)
  kst.setUTCDate(kst.getUTCDate() - n)
  return new Date(kst.getTime() - 9 * 3600 * 1000)
}

async function seedFor(nickname, pattern) {
  const offsets = PATTERNS[pattern]
  if (!offsets) {
    console.error(`Unknown pattern: ${pattern}`)
    console.error('Available:', Object.keys(PATTERNS).join(', '))
    process.exit(1)
  }

  const userRes = await pool.query(
    `SELECT u.id, t.id AS tree_id, t.total_points
     FROM anonymous_user u
     JOIN tree t ON t.user_id = u.id
     WHERE u.nickname = $1`,
    [nickname],
  )
  if (userRes.rowCount === 0) {
    console.error(`User not found: ${nickname}`)
    process.exit(1)
  }
  const { id: userId, tree_id: treeId, total_points: currentPoints } =
    userRes.rows[0]

  console.log(
    `[${nickname}] pattern=${pattern} — ${offsets.length}개 ARTICLE_COMPLETE 트랜잭션`,
  )

  let runningTotal = Number(currentPoints)
  // 가장 오래된 날짜부터 INSERT (balance_after 정합성)
  for (const offset of [...offsets].sort((a, b) => b - a)) {
    runningTotal += 10
    const ts = kstNoonNDaysAgo(offset)
    await pool.query(
      `INSERT INTO point_transaction
         (user_id, amount, type, balance_after, created_at)
       VALUES ($1, 10, 'ARTICLE_COMPLETE', $2, $3)`,
      [userId, runningTotal, ts.toISOString()],
    )
  }
  await pool.query(`UPDATE tree SET total_points = $1 WHERE id = $2`, [
    runningTotal,
    treeId,
  ])
  console.log(`  → tree.total_points = ${runningTotal}`)
}

async function main() {
  const nickname = process.argv[2]
  const pattern = process.argv[3] ?? 'active3'

  if (!nickname) {
    console.log('Streak 시드 도구')
    console.log('')
    console.log('사용법:')
    console.log(
      '  node scripts/seed-streak.mjs <nickname> [pattern]',
    )
    console.log('')
    console.log('Pattern:')
    for (const [k, offsets] of Object.entries(PATTERNS)) {
      console.log(`  ${k.padEnd(10)} (${offsets.length}일)`)
    }
    process.exit(0)
  }

  await seedFor(nickname, pattern)
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
