import 'dotenv/config'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cwd = path.resolve(__dirname, '..')
const args = process.argv.slice(2)

if (!process.env.DATABASE_URL) {
  console.error('[migrate] DATABASE_URL not set. Check server/.env')
  process.exit(1)
}

const proc = spawn('node-pg-migrate', args, {
  stdio: 'inherit',
  env: process.env,
  cwd,
  shell: true,
})

proc.on('exit', (code) => process.exit(code ?? 0))
proc.on('error', (err) => {
  console.error(err)
  process.exit(1)
})
