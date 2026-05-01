import { useEffect, useRef, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { generateFingerprintHash } from '@/lib/fingerprint'
import type { TreeStage } from '@/lib/tree'
import { useUserStore } from '@/stores/userStore'

interface RegisterResponse {
  publicId: string
  sessionToken: string
  nickname: string
  preferredCategories: string[]
  onboardingCompletedAt: string | null
  totalPoints: number
  treeStage: TreeStage
  createdAt: string
}

interface MeResponse {
  publicId: string
  nickname: string
  preferredCategories: string[]
  onboardingCompletedAt: string | null
  totalPoints: number
  treeStage: TreeStage
  createdAt: string
}

/**
 * App mount 시 익명 ID 발급 (UC-01) 또는 기존 세션 복구 (UC-08).
 * - 토큰 없음 → POST /api/anonymous/register
 * - 토큰 있음 → GET /api/me 로 사용자 정보 새로고침
 */
export function useAnonymousId() {
  const sessionToken = useUserStore((s) => s.sessionToken)
  const setSession = useUserStore((s) => s.setSession)
  const patchUser = useUserStore((s) => s.patchUser)
  const clearSession = useUserStore((s) => s.clearSession)
  const startedRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const initialize = async () => {
      setInitializing(true)
      setError(null)
      try {
        if (sessionToken) {
          // Refresh existing session
          try {
            const me = await api.get<MeResponse>('/api/me')
            patchUser(me)
          } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
              // Token invalid → clear and re-register
              clearSession()
              await registerNew()
            } else {
              throw err
            }
          }
        } else {
          await registerNew()
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown error'
        setError(msg)
      } finally {
        setInitializing(false)
      }
    }

    const registerNew = async () => {
      const fingerprintHash = await generateFingerprintHash()
      const result = await api.post<RegisterResponse>(
        '/api/anonymous/register',
        { fingerprintHash },
      )
      setSession({
        sessionToken: result.sessionToken,
        user: {
          publicId: result.publicId,
          nickname: result.nickname,
          preferredCategories: result.preferredCategories,
          onboardingCompletedAt: result.onboardingCompletedAt,
          totalPoints: result.totalPoints,
          treeStage: result.treeStage,
          createdAt: result.createdAt,
        },
      })
    }

    void initialize()
  }, [sessionToken, setSession, patchUser, clearSession])

  return {
    initializing,
    error,
  }
}
