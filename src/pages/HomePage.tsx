import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArticleCard } from '@/components/article'
import { QuestCard } from '@/components/quest'
import { StreakBadge } from '@/components/streak'
import { TreeWidget } from '@/components/tree'
import { Card, CategoryChip, Skeleton } from '@/components/ui'
import { CATEGORIES } from '@/lib/categories'
import { useActiveQuests, useFeedHome, useMyStats } from '@/hooks/queries'
import { useUserStore } from '@/stores'

export function HomePage() {
  const user = useUserStore((s) => s.user)
  const totalPoints = user?.totalPoints ?? 0
  const treeStage = user?.treeStage ?? 'SEED'
  const isOnboarded = (user?.onboardingCompletedAt ?? null) !== null

  const feedQuery = useFeedHome()
  const questsQuery = useActiveQuests()
  const statsQuery = useMyStats()

  const forYou = feedQuery.data?.forYou ?? []
  const trending = feedQuery.data?.trending ?? []
  const recent = feedQuery.data?.recent ?? []

  const featuredQuests = useMemo(() => {
    const items = questsQuery.data?.items ?? []
    // 미완료 daily 우선, 없으면 weekly. 최대 2개.
    const incompleteDaily = items.filter(
      (q) => q.questType === 'DAILY' && !q.completedAt,
    )
    if (incompleteDaily.length > 0) return incompleteDaily.slice(0, 2)
    const incompleteWeekly = items.filter(
      (q) => q.questType === 'WEEKLY' && !q.completedAt,
    )
    return incompleteWeekly.slice(0, 2)
  }, [questsQuery.data])

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-6 desktop:py-10">
      {/* Tree widget */}
      <section
        aria-label="내 나무"
        className="flex flex-col items-center gap-3 animate-fade-in"
      >
        <Link
          to="/forest/me"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <TreeWidget
            stage={treeStage}
            totalPoints={totalPoints}
            size="medium"
          />
        </Link>
        {user?.nickname && (
          <p className="text-xs text-fg-muted">{user.nickname}</p>
        )}
      </section>

      {/* Streak 배지 */}
      {statsQuery.data && (
        <section aria-label="Streak">
          <StreakBadge
            streak={statsQuery.data.streak}
            longestStreak={statsQuery.data.longestStreak}
            streakAtRisk={statsQuery.data.streakAtRisk}
            lastReadDate={statsQuery.data.lastReadDate}
          />
        </section>
      )}

      {/* 오늘의 미션 (active quest 미니 카드) */}
      {featuredQuests.length > 0 && (
        <section className="space-y-3">
          <header className="flex items-end justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold tracking-tight desktop:text-2xl">
                🎯 진행 중인 미션
              </h2>
              <p className="text-xs text-fg-muted">
                완료하면 자동으로 보상이 적립돼요
              </p>
            </div>
            <Link
              to="/quests"
              className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              모두 보기 →
            </Link>
          </header>
          <div className="grid gap-2 tablet:grid-cols-2">
            {featuredQuests.map((q) => (
              <QuestCard key={q.questId} quest={q} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* For You */}
      <FeedSection
        title="For You ✨"
        subtitle={
          isOnboarded
            ? '읽은 기사와 관심 카테고리, 최신성을 종합해서 추천해요'
            : '카테고리를 골라주시면 추천이 더 정확해져요'
        }
      >
        {feedQuery.isPending ? (
          <FeedSkeleton count={4} />
        ) : feedQuery.isError ? (
          <FeedError onRetry={() => feedQuery.refetch()} />
        ) : isOnboarded && forYou.length > 0 ? (
          <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {forYou.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <EmptyForYou />
        )}
      </FeedSection>

      {/* Trending */}
      {!feedQuery.isPending && trending.length > 0 && (
        <FeedSection title="Trending 🔥" subtitle="지금 많이 읽고 있어요">
          <div className="grid gap-2">
            {trending.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </FeedSection>
      )}

      {/* Recent */}
      {!feedQuery.isPending && recent.length > 0 && (
        <FeedSection title="Recent 🕓" subtitle="최근 발행">
          <div className="grid gap-2">
            {recent.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </FeedSection>
      )}

      {/* Categories */}
      <FeedSection title="Categories" subtitle="카테고리별로 둘러보기">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.code}
              to={`/articles/${c.code}`}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <CategoryChip emoji={c.emoji} size="md">
                {c.displayName}
              </CategoryChip>
            </Link>
          ))}
        </div>
      </FeedSection>
    </div>
  )
}

function FeedSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight desktop:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-fg-muted">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}

function FeedSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  )
}

function FeedError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card variant="flat" padding="md">
      <div className="flex flex-col items-center gap-2 py-3 text-center">
        <span className="text-3xl" aria-hidden>
          🍂
        </span>
        <p className="text-sm">잠시 문제가 있었어요. 다시 시도해볼까요?</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-xs text-primary underline"
        >
          다시 시도
        </button>
      </div>
    </Card>
  )
}

function EmptyForYou() {
  return (
    <Card variant="flat" padding="lg">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="text-4xl" aria-hidden>
          🌱
        </span>
        <p className="text-sm font-medium">첫 기사를 골라볼까요?</p>
        <p className="max-w-sm text-xs text-fg-muted">
          관심 카테고리를 골라주시면 당신을 위한 추천이 시작돼요.
        </p>
        <Link to="/onboarding/categories">
          <CategoryChip selected size="sm">
            관심 카테고리 설정하기 →
          </CategoryChip>
        </Link>
      </div>
    </Card>
  )
}
