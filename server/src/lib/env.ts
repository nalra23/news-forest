import 'dotenv/config'

function required(name: string): string {
  const v = process.env[name]
  if (!v || v.length === 0) {
    throw new Error(`Missing required env: ${name}`)
  }
  return v
}

export const env = {
  DATABASE_URL: required('DATABASE_URL'),
  PORT: Number(process.env.PORT ?? 3001),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  APP_HASH_SALT: required('APP_HASH_SALT'),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
}

export const isDev = env.NODE_ENV === 'development'
