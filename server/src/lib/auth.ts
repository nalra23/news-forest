import { createHmac, timingSafeEqual } from 'node:crypto'
import { env } from './env.js'

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30일 (UC-08)
const HEADER = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
  'base64url',
)

interface Payload {
  sub: number
  iat: number
  exp: number
}

function sign(data: string): string {
  return createHmac('sha256', env.APP_HASH_SALT).update(data).digest('base64url')
}

export function signSessionToken(userId: number | string): string {
  const sub = typeof userId === 'number' ? userId : Number(userId)
  if (!Number.isFinite(sub)) {
    throw new Error(`Invalid userId: ${userId}`)
  }
  const now = Date.now()
  const payload: Payload = {
    sub,
    iat: now,
    exp: now + SESSION_TTL_MS,
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const data = `${HEADER}.${payloadB64}`
  return `${data}.${sign(data)}`
}

export interface VerifiedSession {
  userId: number
  exp: number
}

export function verifySessionToken(token: string): VerifiedSession | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [, payloadB64, sig] = parts
  const data = `${parts[0]}.${parts[1]}`
  const expected = sign(data)
  // timing-safe compare
  if (sig.length !== expected.length) return null
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  } catch {
    return null
  }
  try {
    const decoded = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf-8'),
    ) as { sub?: unknown; exp?: unknown }
    const sub =
      typeof decoded.sub === 'number'
        ? decoded.sub
        : typeof decoded.sub === 'string'
          ? Number(decoded.sub)
          : NaN
    if (!Number.isFinite(sub)) return null
    if (typeof decoded.exp !== 'number') return null
    if (decoded.exp < Date.now()) return null
    return { userId: sub, exp: decoded.exp }
  } catch {
    return null
  }
}
