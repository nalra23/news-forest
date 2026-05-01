import type { FastifyRequest, FastifyReply } from 'fastify'
import { verifySessionToken } from '../lib/auth.js'

declare module 'fastify' {
  interface FastifyRequest {
    userId?: number
  }
}

/**
 * Authorization: Bearer <sessionToken> 헤더 검증.
 * 유효한 token이면 req.userId 에 user.id 주입. 아니면 401.
 */
export async function requireAuth(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'unauthorized', message: 'Missing Bearer token' })
  }
  const token = header.slice(7).trim()
  const session = verifySessionToken(token)
  if (!session) {
    return reply.code(401).send({ error: 'unauthorized', message: 'Invalid or expired token' })
  }
  req.userId = session.userId
}
