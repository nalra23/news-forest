import { createHash } from 'node:crypto'
import { env } from './env.js'

/**
 * UC-01 §4.4 — FE에서 받은 fingerprintHash 에 server-side salt 를 추가하여
 * 한 번 더 SHA-256 해시. 결과가 anonymous_user.anonymous_hash 컬럼에 저장됨.
 */
export function deriveAnonymousHash(fingerprintHash: string): string {
  return createHash('sha256')
    .update(`${env.APP_HASH_SALT}:${fingerprintHash}`)
    .digest('hex')
}
