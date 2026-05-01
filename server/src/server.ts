import Fastify from 'fastify'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import { env, isDev } from './lib/env.js'
import { ping } from './lib/db.js'
import authRoutes from './routes/auth.js'
import articleRoutes from './routes/articles.js'
import readingRoutes from './routes/reading.js'
import wateringRoutes from './routes/watering.js'
import forestRoutes from './routes/forest.js'
import feedRoutes from './routes/feed.js'
import meRoutes from './routes/me.js'
import questRoutes from './routes/quests.js'
import rankingRoutes from './routes/ranking.js'

export async function buildServer() {
  const fastify = Fastify({
    logger: isDev
      ? {
          level: 'info',
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, singleLine: true },
          },
        }
      : { level: 'info' },
    trustProxy: true,
  })

  await fastify.register(sensible)
  await fastify.register(cors, {
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  })

  // Root
  fastify.get('/', async () => ({
    service: 'news-forest-api',
    version: '0.1.0',
    docs: '/health',
  }))

  await fastify.register(authRoutes)
  await fastify.register(meRoutes)
  await fastify.register(articleRoutes)
  await fastify.register(readingRoutes)
  await fastify.register(wateringRoutes)
  await fastify.register(forestRoutes)
  await fastify.register(feedRoutes)
  await fastify.register(questRoutes)
  await fastify.register(rankingRoutes)

  // Health check
  fastify.get('/health', async () => {
    try {
      const db = await ping()
      return {
        ok: true,
        env: env.NODE_ENV,
        db: { connected: true, ...db },
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown db error'
      return {
        ok: false,
        env: env.NODE_ENV,
        db: { connected: false, error: message },
      }
    }
  })

  return fastify
}
