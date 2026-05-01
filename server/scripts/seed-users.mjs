import 'dotenv/config'
import pg from 'pg'
import { createHash, randomUUID } from 'node:crypto'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}
if (!process.env.APP_HASH_SALT) {
  console.error('APP_HASH_SALT not set')
  process.exit(1)
}

const SALT = process.env.APP_HASH_SALT
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const STAGE_THRESHOLDS = { SEED: 0, SPROUT: 50, TREE: 200, FOREST: 500 }
function calcStage(pts) {
  if (pts >= 500) return 'FOREST'
  if (pts >= 200) return 'TREE'
  if (pts >= 50) return 'SPROUT'
  return 'SEED'
}

const NICKNAMES_AND_POINTS = [
  ['푸른잎사귀-3142', 220],
  ['맑은새싹-1023', 110],
  ['따뜻한오솔길-7421', 320],
  ['차분한이슬-5577', 760],
  ['고요한숲바람-2810', 20],
  ['싱그러운나무-9201', 110],
  ['잔잔한들꽃-4452', 320],
  ['햇살같은나무그늘-6321', 760],
  ['이슬맺힌솔방울-1928', 20],
  ['바람부는잎사귀-8810', 110],
  ['푸른햇살-3030', 320],
  ['맑은나무-7766', 760],
  ['따뜻한새싹-1188', 20],
  ['차분한오솔길-2245', 110],
  ['고요한이슬-9090', 320],
  ['싱그러운숲바람-4321', 760],
]

async function main() {
  console.log(`Seeding ${NICKNAMES_AND_POINTS.length} mock forest users...`)

  let inserted = 0
  let skipped = 0

  // Get tree stage id map
  const stagesRes = await pool.query('SELECT id, code FROM tree_growth_stage')
  const stageMap = new Map(stagesRes.rows.map((r) => [r.code, r.id]))

  for (let i = 0; i < NICKNAMES_AND_POINTS.length; i++) {
    const [nickname, totalPoints] = NICKNAMES_AND_POINTS[i]

    // Deterministic anonymous_hash for mock users (so re-run is idempotent)
    const fingerprintHash = createHash('sha256')
      .update(`mock-user-fingerprint:${nickname}`)
      .digest('hex')
    const anonymousHash = createHash('sha256')
      .update(`${SALT}:${fingerprintHash}`)
      .digest('hex')

    const stageCode = calcStage(totalPoints)
    const stageId = stageMap.get(stageCode)

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Check existing
      const existing = await client.query(
        `SELECT id FROM anonymous_user WHERE anonymous_hash = $1`,
        [anonymousHash],
      )
      if (existing.rowCount > 0) {
        skipped++
        await client.query('COMMIT')
        continue
      }

      const publicId = randomUUID()
      const userInsert = await client.query(
        `INSERT INTO anonymous_user
           (public_id, anonymous_hash, nickname, preferred_categories, onboarding_completed_at)
         VALUES ($1, $2, $3, NULL, NOW())
         RETURNING id`,
        [publicId, anonymousHash, nickname],
      )
      const userId = userInsert.rows[0].id

      // Tree row
      const treeInsert = await client.query(
        `INSERT INTO tree (user_id, stage_id, total_points, last_grown_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id`,
        [userId, stageId, totalPoints],
      )
      const treeId = treeInsert.rows[0].id

      // Initial growth history (always SEED at 0P first)
      await client.query(
        `INSERT INTO tree_growth_history (tree_id, from_stage_id, to_stage_id, points_at_change)
         VALUES ($1, NULL, $2, 0)`,
        [treeId, stageMap.get('SEED')],
      )

      // If higher stage, insert intermediate transitions
      if (stageCode !== 'SEED') {
        const transitions = []
        if (totalPoints >= 50) transitions.push(['SEED', 'SPROUT', 50])
        if (totalPoints >= 200) transitions.push(['SPROUT', 'TREE', 200])
        if (totalPoints >= 500) transitions.push(['TREE', 'FOREST', 500])
        for (const [from, to, atPoints] of transitions) {
          await client.query(
            `INSERT INTO tree_growth_history (tree_id, from_stage_id, to_stage_id, points_at_change)
             VALUES ($1, $2, $3, $4)`,
            [treeId, stageMap.get(from), stageMap.get(to), atPoints],
          )
        }
      }

      await client.query('COMMIT')
      inserted++
    } catch (e) {
      await client.query('ROLLBACK')
      console.error(`  failed for ${nickname}:`, e.message)
    } finally {
      client.release()
    }
  }

  console.log(`Done. Inserted ${inserted}, skipped ${skipped} (already existed).`)
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
