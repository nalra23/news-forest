import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

/**
 * Mock forest users 에게 최근 7일 내 point_transaction 시드.
 * Ranking 페이지가 의미 있으려면 이번 주(KST) 활동이 필요.
 *
 * Idempotent: 이미 transaction 있는 사용자는 skip.
 */

async function main() {
  console.log('Seeding mock activity for ranking demo...')

  // mock 사용자 (anonymous_hash 가 'mock-user-fingerprint:' prefix 로 시작)
  // 실제로는 hash 가 SHA-256 이라 prefix match 불가. 닉네임으로 잡자.
  const mockUsersRes = await pool.query(`
    SELECT u.id, u.nickname, t.total_points
    FROM anonymous_user u
    JOIN tree t ON t.user_id = u.id
    WHERE u.nickname IN (
      '푸른잎사귀-3142', '맑은새싹-1023', '따뜻한오솔길-7421', '차분한이슬-5577',
      '고요한숲바람-2810', '싱그러운나무-9201', '잔잔한들꽃-4452', '햇살같은나무그늘-6321',
      '이슬맺힌솔방울-1928', '바람부는잎사귀-8810', '푸른햇살-3030', '맑은나무-7766',
      '따뜻한새싹-1188', '차분한오솔길-2245', '고요한이슬-9090', '싱그러운숲바람-4321'
    )
  `)

  let inserted = 0
  for (const user of mockUsersRes.rows) {
    // 이미 transaction 있는지 확인
    const existsRes = await pool.query(
      `SELECT 1 FROM point_transaction WHERE user_id = $1 LIMIT 1`,
      [user.id],
    )
    if (existsRes.rowCount > 0) continue

    // 이번 주 (월요일~) 안에 무작위 분포로 transaction 생성
    // total_points 의 30~70% 정도를 이번 주 활동으로 분산
    const weeklyShare = Math.floor(
      user.total_points * (0.3 + Math.random() * 0.4),
    )

    let remaining = weeklyShare
    let balance = user.total_points - weeklyShare // 이번 주 활동 전 잔액
    const txCount = Math.floor(Math.random() * 4) + 2 // 2~5건

    for (let i = 0; i < txCount && remaining > 0; i++) {
      const isLast = i === txCount - 1
      const amount = isLast
        ? remaining
        : Math.min(remaining, 5 + Math.floor(Math.random() * 15))
      remaining -= amount
      balance += amount

      // 이번 주 (지난 7일) 내 무작위 시점
      const hoursAgo = Math.random() * 7 * 24
      await pool.query(
        `INSERT INTO point_transaction (user_id, amount, type, balance_after, created_at)
         VALUES ($1, $2, 'ADJUSTMENT', $3, NOW() - ($4 || ' hours')::interval)`,
        [user.id, amount, balance, hoursAgo],
      )
      inserted++
    }
  }

  console.log(`Done. Inserted ${inserted} transactions.`)
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
