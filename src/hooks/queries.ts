import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useUserStore } from '@/stores/userStore'
import type { TreeStage } from '@/lib/tree'

// ────────────────────────────────────────────────────────────────
// Article / Feed
// ────────────────────────────────────────────────────────────────

export interface ArticleDTO {
  id: string
  source: string
  externalId: string
  slug: string
  category: string
  categoryDisplayName: string
  title: string
  summary: string
  body?: string
  thumbnailUrl: string
  publishedAt: string
  bodyLength: number
  estimatedReadMinutes: number
  sourceUrl: string | null
}

export function useFeedHome() {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['feed', 'home'],
    queryFn: () =>
      api.get<{
        forYou: ArticleDTO[]
        trending: ArticleDTO[]
        recent: ArticleDTO[]
      }>('/api/feed/home'),
    enabled: !!sessionToken,
    staleTime: 60_000,
  })
}

export function useArticleBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', 'by-slug', slug],
    queryFn: () => api.get<ArticleDTO>(`/api/articles/by-slug/${slug}`),
    enabled: !!slug,
    staleTime: 5 * 60_000,
  })
}

export function useArticlesByCategory(category: string | undefined) {
  return useQuery({
    queryKey: ['articles', 'category', category],
    queryFn: () =>
      api.get<{ items: ArticleDTO[] }>(
        `/api/articles?category=${encodeURIComponent(category!)}&limit=50`,
      ),
    enabled: !!category,
    staleTime: 60_000,
  })
}

export function useArticleCategories() {
  return useQuery({
    queryKey: ['article-categories'],
    queryFn: () =>
      api.get<{
        items: { code: string; displayName: string; sortOrder: number }[]
      }>('/api/articles/categories'),
    staleTime: Infinity,
  })
}

// ────────────────────────────────────────────────────────────────
// Reading session + completion
// ────────────────────────────────────────────────────────────────

export interface StartSessionResponse {
  sessionId: string
  startedAt: string
  alreadyCompleted: boolean
  previousCompletedAt: string | null
  thresholds: { scroll: number; dwellSeconds: number }
}

export function useStartReadingSession() {
  return useMutation({
    mutationFn: (articleId: string) =>
      api.post<StartSessionResponse>('/api/reading-sessions', { articleId }),
  })
}

export type CompleteSessionResponse =
  | {
      completed: true
      kind: 'completed'
      pointsAwarded: number
      totalPoints: number
      treeStage: TreeStage
      stageChanged: boolean
      fromStage: TreeStage | null
      toStage: TreeStage
      isSuspicious: boolean
      questRewards?: QuestRewardEvent[]
      streakDays: number
      previousStreak: number
      streakMilestone: number | null
    }
  | {
      completed: false
      reason: 'thresholds_not_met'
      maxScrollPct: number
      dwellSeconds: number
      meetsScroll: boolean
      meetsDwell: boolean
    }
  | {
      completed: false
      reason: 'already_completed_recently'
      ttlHours: number
    }

export function useCompleteReadingSession() {
  const qc = useQueryClient()
  const patchUser = useUserStore((s) => s.patchUser)
  return useMutation({
    mutationFn: ({
      sessionId,
      maxScrollPct,
      dwellSeconds,
    }: {
      sessionId: string
      maxScrollPct: number
      dwellSeconds: number
    }) =>
      api.post<CompleteSessionResponse>(
        `/api/reading-sessions/${sessionId}/complete`,
        { maxScrollPct, dwellSeconds },
      ),
    onSuccess: (result) => {
      if (result.completed) {
        patchUser({
          totalPoints: result.totalPoints,
          treeStage: result.treeStage,
        })
        qc.invalidateQueries({ queryKey: ['me'] })
        qc.invalidateQueries({ queryKey: ['feed'] })
        qc.invalidateQueries({ queryKey: ['quests'] })
      }
    },
  })
}

// ────────────────────────────────────────────────────────────────
// Watering
// ────────────────────────────────────────────────────────────────

export interface QuestRewardEvent {
  questCode: string
  questTitle: string
  rewardPoints: number
  newTotalPoints: number
  newTreeStage: TreeStage
  stageChanged: boolean
}

export interface WateringSuccess {
  kind: 'success'
  wateringId: string
  targetNickname: string
  pointsAwarded: number
  totalPoints: number
  treeStage: TreeStage
  stageChanged: boolean
  fromStage: TreeStage | null
  toStage: TreeStage
  questRewards?: QuestRewardEvent[]
}

export function useWatering() {
  const qc = useQueryClient()
  const patchUser = useUserStore((s) => s.patchUser)
  return useMutation({
    mutationFn: (targetPublicId: string) =>
      api.post<WateringSuccess>('/api/watering', { targetPublicId }),
    onSuccess: (result) => {
      patchUser({
        totalPoints: result.totalPoints,
        treeStage: result.treeStage,
      })
      qc.invalidateQueries({ queryKey: ['me'] })
      qc.invalidateQueries({ queryKey: ['quests'] })
      qc.invalidateQueries({ queryKey: ['ranking'] })
    },
  })
}

// ────────────────────────────────────────────────────────────────
// Forest users
// ────────────────────────────────────────────────────────────────

export interface ForestUserDTO {
  publicId: string
  nickname: string
  totalPoints: number
  treeStage: TreeStage
}

export function useForestUsers(sort: 'random' | 'top' | 'recent' = 'random') {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['forest', 'users', sort],
    queryFn: () =>
      api.get<{ items: ForestUserDTO[]; sort: string }>(
        `/api/forest/users?sort=${sort}&limit=16`,
      ),
    enabled: !!sessionToken,
    staleTime: sort === 'random' ? 0 : 60_000,
  })
}

export function useForestUser(publicId: string | undefined) {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['forest', 'user', publicId],
    queryFn: () => api.get<ForestUserDTO>(`/api/forest/users/${publicId}`),
    enabled: !!publicId && !!sessionToken,
    staleTime: 60_000,
  })
}

// ────────────────────────────────────────────────────────────────
// Me — stats / transactions / growth history
// ────────────────────────────────────────────────────────────────

export interface StatsResponse {
  totalPoints: number
  treeStage: TreeStage
  completionCount: number
  weeklyCompletionCount: number
  streak: number
  longestStreak: number
  streakAtRisk: boolean
  lastReadDate: string | null
  last7Days: { date: string; count: number }[]
}

export function useMyStats() {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['me', 'stats'],
    queryFn: () => api.get<StatsResponse>('/api/me/stats'),
    enabled: !!sessionToken,
    staleTime: 30_000,
  })
}

export interface PointTransactionDTO {
  id: string
  amount: number
  type: 'ARTICLE_COMPLETE' | 'WATERING' | 'QUEST' | 'ADJUSTMENT'
  balanceAfter: number
  createdAt: string
  article: {
    slug: string
    title: string
    category: string
    categoryDisplayName: string
  } | null
  targetNickname: string | null
}

export function useMyTransactions(limit = 20) {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['me', 'transactions', limit],
    queryFn: () =>
      api.get<{ items: PointTransactionDTO[] }>(
        `/api/me/transactions?limit=${limit}`,
      ),
    enabled: !!sessionToken,
    staleTime: 30_000,
  })
}

export interface GrowthHistoryDTO {
  id: string
  fromStage: TreeStage | null
  toStage: TreeStage
  pointsAtChange: number
  changedAt: string
}

export function useMyGrowthHistory() {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['me', 'growth-history'],
    queryFn: () =>
      api.get<{ items: GrowthHistoryDTO[] }>('/api/me/growth-history'),
    enabled: !!sessionToken,
    staleTime: 60_000,
  })
}

// ────────────────────────────────────────────────────────────────
// Weekly Ranking
// ────────────────────────────────────────────────────────────────

export interface RankingEntry {
  rank: number
  publicId: string
  nickname: string
  weeklyPoints: number
  totalPoints: number
  treeStage: TreeStage
  isMe: boolean
}

export interface RankingResponse {
  items: RankingEntry[]
  me: {
    rank: number | null
    weeklyPoints: number
    totalPoints: number
    treeStage: TreeStage
    nickname: string
  }
  weekKey: string
}

export function useWeeklyRanking(limit = 50) {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['ranking', 'weekly', limit],
    queryFn: () =>
      api.get<RankingResponse>(`/api/ranking/weekly?limit=${limit}`),
    enabled: !!sessionToken,
    staleTime: 60_000,
  })
}

// ────────────────────────────────────────────────────────────────
// Quests
// ────────────────────────────────────────────────────────────────

export interface QuestDTO {
  questId: string
  code: string
  title: string
  description: string | null
  questType: 'DAILY' | 'WEEKLY'
  targetAction: 'READ_ARTICLE' | 'WATERING'
  targetCount: number
  rewardPoints: number
  progressCount: number
  completedAt: string | null
  rewardGranted: boolean
  periodKey: string
}

export function useActiveQuests() {
  const sessionToken = useUserStore((s) => s.sessionToken)
  return useQuery({
    queryKey: ['quests', 'active'],
    queryFn: () =>
      api.get<{ items: QuestDTO[] }>('/api/quests/active'),
    enabled: !!sessionToken,
    staleTime: 30_000,
  })
}

// ────────────────────────────────────────────────────────────────
// Preferences (onboarding)
// ────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// Account deletion — PIPA §35·§36
// ────────────────────────────────────────────────────────────────

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => api.delete<{ deleted: true }>('/api/me'),
  })
}

export function useUpdatePreferences() {
  const qc = useQueryClient()
  const patchUser = useUserStore((s) => s.patchUser)
  return useMutation({
    mutationFn: (preferredCategories: string[]) =>
      api.patch<{ preferredCategories: string[] }>(
        '/api/me/preferences',
        { preferredCategories },
      ),
    onSuccess: (result) => {
      patchUser({
        preferredCategories: result.preferredCategories,
        onboardingCompletedAt: new Date().toISOString(),
      })
      qc.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}
