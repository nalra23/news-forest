import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { TreeWidget } from '@/components/tree'
import { Button, Card, Skeleton } from '@/components/ui'
import { useForestUser, useWatering } from '@/hooks/queries'
import { ApiError } from '@/lib/api'
import { findForestUserByPublicId } from '@/mocks'
import { useToastStore, useUserStore } from '@/stores'

export function UserForestPage() {
  const { publicId } = useParams<{ publicId: string }>()
  const me = useUserStore((s) => s.user)

  // mock publicId 이면 API 호출 없이 로컬 데이터 사용
  const mockUser = publicId ? findForestUserByPublicId(publicId) : undefined
  const isMockUser = !!mockUser

  const targetQuery = useForestUser(isMockUser ? undefined : publicId)
  const target = isMockUser ? mockUser : targetQuery.data
  const wateringMutation = useWatering()

  const [doneToday, setDoneToday] = useState(false)

  if (me && target && me.publicId === target.publicId) {
    return <Navigate to="/forest/me" replace />
  }

  if (!isMockUser && targetQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <Skeleton className="mx-auto h-64 w-64 rounded-full" />
        <Skeleton className="mx-auto h-6 w-40" />
      </div>
    )
  }

  if (!target || (!isMockUser && targetQuery.isError)) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
        <span className="text-5xl" aria-hidden>
          🍂
        </span>
        <h1 className="text-xl font-bold">사용자를 찾을 수 없어요</h1>
        <Link to="/forest/explore">
          <Button>다른 숲 둘러보기</Button>
        </Link>
      </div>
    )
  }

  const handleWatering = async () => {
    if (!publicId || wateringMutation.isPending || doneToday) return
    try {
      const result = await wateringMutation.mutateAsync(publicId)
      setDoneToday(true)
      useToastStore
        .getState()
        .show(
          `${result.targetNickname}님께 물을 줬어요. +${result.pointsAwarded}P`,
          { icon: '💧' },
        )
      ;(result.questRewards ?? []).forEach((qr, i) => {
        setTimeout(() => {
          useToastStore.getState().show(
            `🎯 ${qr.questTitle} 완료! +${qr.rewardPoints}P`,
            { icon: '🎯' },
          )
        }, 600 + i * 600)
      })
    } catch (err) {
      if (
        err instanceof ApiError &&
        (err.body as { error?: string })?.error === 'already_watered_today'
      ) {
        setDoneToday(true)
        useToastStore.getState().show('오늘은 이미 물을 줬어요', { icon: '🌿' })
      } else {
        useToastStore
          .getState()
          .show('잠시 문제가 있었어요. 다시 시도해볼까요?', { icon: '🍂' })
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 desktop:py-10">
      <nav aria-label="breadcrumb" className="text-xs text-fg-muted">
        <Link to="/forest/explore" className="hover:underline">
          둘러보기
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-foreground">{target.nickname}</span>
      </nav>

      <header className="space-y-1 text-center animate-fade-in">
        <p className="text-sm font-semibold text-primary">다른 사용자의 숲</p>
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          {target.nickname}
        </h1>
      </header>

      <section
        aria-label="이 사용자의 나무"
        className="flex flex-col items-center"
      >
        <TreeWidget
          stage={target.treeStage}
          totalPoints={target.totalPoints}
          size="large"
        />
      </section>

      <Card variant="soft" padding="lg">
        <div className="flex flex-col items-center gap-3 text-center">
          {isMockUser ? (
            <>
              <span className="text-3xl" aria-hidden>🗺️</span>
              <p className="text-sm font-medium">지도 데모 사용자예요</p>
              <p className="text-xs text-fg-muted">
                주변 숲 기능은 준비 중이에요.
                <br />
                실제 사용자에게 물을 주려면 탐험하기를 이용해주세요.
              </p>
              <Link to="/forest/explore">
                <Button size="md">실제 사용자 탐험하기 →</Button>
              </Link>
            </>
          ) : !doneToday ? (
            <>
              <p className="text-sm">
                <span className="font-semibold text-primary">
                  {target.nickname}
                </span>
                님의 나무에 물을 줘보세요.
              </p>
              <p className="text-xs text-fg-muted">
                물을 주면 나에게 +2P가 적립돼요. (24시간에 한 번)
              </p>
              <Button
                size="lg"
                onClick={() => { void handleWatering() }}
                disabled={wateringMutation.isPending}
                loading={wateringMutation.isPending}
              >
                💧 물 주기
              </Button>
            </>
          ) : (
            <>
              <span className="text-3xl" aria-hidden>
                🌿
              </span>
              <p className="text-sm font-medium">오늘은 이미 물을 줬어요</p>
              <p className="text-xs text-fg-muted">
                내일 다시 줄 수 있어요.
              </p>
              <Button size="md" disabled>
                💧 물 주기
              </Button>
            </>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <Link to="/forest/explore">
          <Button variant="ghost" size="sm">
            ← 다른 숲 더 보기
          </Button>
        </Link>
        <Link to="/forest/me">
          <Button variant="ghost" size="sm">
            내 숲으로
          </Button>
        </Link>
      </div>
    </div>
  )
}
