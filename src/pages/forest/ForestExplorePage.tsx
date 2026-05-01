import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ForestMapCard } from '@/components/forest'
import { Button, Skeleton } from '@/components/ui'
import { clsx } from 'clsx'
import { useForestUsers } from '@/hooks/queries'

type Tab = 'random' | 'top' | 'recent'

const TABS: { id: Tab; label: string }[] = [
  { id: 'random', label: 'Random' },
  { id: 'top', label: 'Top' },
  { id: 'recent', label: 'Recent' },
]

export function ForestExplorePage() {
  const [tab, setTab] = useState<Tab>('random')
  const usersQuery = useForestUsers(tab)
  const users = usersQuery.data?.items ?? []

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 desktop:py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          🌳 다른 숲 둘러보기
        </h1>
        <p className="text-sm text-fg-muted">
          다른 사용자의 나무를 만나고, 응원의 물을 줘보세요. 익명이라
          편하게 둘러볼 수 있어요.
        </p>
      </header>

      <div role="tablist" aria-label="정렬 방식" className="flex gap-1 border-b">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={clsx(
                'relative px-4 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
                active ? 'text-primary' : 'text-fg-muted hover:text-foreground',
              )}
            >
              {t.label}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-t bg-primary"
                />
              )}
            </button>
          )
        })}
        {tab === 'random' && (
          <div className="ml-auto py-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => usersQuery.refetch()}
              aria-label="다시 섞기"
            >
              🔀 다시 섞기
            </Button>
          </div>
        )}
      </div>

      {usersQuery.isPending ? (
        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 desktop:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : usersQuery.isError ? (
        <p className="py-12 text-center text-sm text-fg-muted">
          잠시 문제가 있었어요. 다시 시도해볼까요?
        </p>
      ) : (
        <div className="grid gap-3 grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4">
          {users.map((u) => (
            <ForestMapCard
              key={u.publicId}
              user={{
                publicId: u.publicId,
                nickname: u.nickname,
                treeStage: u.treeStage,
                totalPoints: u.totalPoints,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 pt-4">
        <Link to="/forest/map">
          <Button variant="secondary" size="sm">
            🗺️ 지도로 보기
          </Button>
        </Link>
        <Link to="/forest/me">
          <Button variant="ghost" size="sm">
            ← 내 숲으로
          </Button>
        </Link>
      </div>
    </div>
  )
}
