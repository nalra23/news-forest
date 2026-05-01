import pg from 'pg'
import { env } from './env.js'

const { Pool } = pg

/**
 * PostgreSQL connection pool. Neon 권장 풀 크기 ≤ 10 (free tier).
 * SSL 은 connection string의 sslmode=require 가 자동 처리.
 */
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
})

pool.on('error', (err) => {
  console.error('[db] unexpected pool error', err)
})

/**
 * 단일 쿼리 실행 헬퍼.
 */
export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params as never)
}

/**
 * 트랜잭션 실행 헬퍼 (UC-05 / UC-06 atomic 트랜잭션 용).
 */
export async function withTransaction<T>(
  fn: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function ping(): Promise<{ now: string; serverVersion: string }> {
  const result = await query<{ now: string; server_version: string }>(
    "SELECT NOW()::text AS now, current_setting('server_version') AS server_version",
  )
  return {
    now: result.rows[0].now,
    serverVersion: result.rows[0].server_version,
  }
}
