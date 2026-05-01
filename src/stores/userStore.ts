import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TreeStage } from '@/lib/tree'

/**
 * 슬림한 user store — sessionToken + 캐시된 사용자 정보만 보관.
 * totalPoints / treeStage / transactions / growth history 는 모두 BE API + TanStack Query 로 조회.
 */
export interface CachedUser {
  publicId: string
  nickname: string
  preferredCategories: string[]
  onboardingCompletedAt: string | null
  totalPoints: number
  treeStage: TreeStage
  createdAt: string
}

interface UserStore {
  user: CachedUser | null
  sessionToken: string | null

  setSession: (params: { sessionToken: string; user: CachedUser }) => void
  patchUser: (patch: Partial<CachedUser>) => void
  clearSession: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      sessionToken: null,

      setSession: ({ sessionToken, user }) => set({ sessionToken, user }),
      patchUser: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      clearSession: () => set({ sessionToken: null, user: null }),
    }),
    {
      name: 'nf:user',
      version: 3,
      // 이전 v1/v2 (mock) 데이터는 모두 폐기
      migrate: () => ({ user: null, sessionToken: null }),
    },
  ),
)

// Backward-compat — 기존 코드에서 import 한 type 재export
export type AnonymousUser = CachedUser
