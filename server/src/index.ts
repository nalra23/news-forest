import { buildServer } from './server.js'
import { env } from './lib/env.js'

async function main() {
  const fastify = await buildServer()

  try {
    await fastify.listen({ port: env.PORT, host: '0.0.0.0' })
    fastify.log.info(
      `🌱 News Forest API running on http://localhost:${env.PORT}`,
    )
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

void main()
