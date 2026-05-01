import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Skeleton } from '@/components/ui'
import { TREE_STAGE_DISPLAY } from '@/lib/tree'
import { useMyStats } from '@/hooks/queries'
import { useUserStore } from '@/stores'

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토']

export function DashboardPage() {
  const user = useUserStore((s) => s.user)
  const statsQuery = useMyStats()

  const last7Days = statsQuery.data?.last7Days ?? []
  const weeklyMax = useMemo(
    () => Math.max(1, ...last7Days.map((b) => b.count)),
    [last7Days],
  )

  if (!user || statsQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    )
  }

  const stats = statsQuery.data
  const totalPoints = stats?.totalPoints ?? user.totalPoints
  const treeStage = (stats?.treeStage ?? user.treeStage) as
    | 'SEED'
    | 'SPROUT'
    | 'TREE'
    | 'FOREST'

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 desktop:py-10">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          대시보드
        </h1>
        <p className="text-sm text-fg-muted">
          {user.nickname}님의 활동을 한눈에 살펴보세요.
        </p>
      </header>

      <Card
        variant="soft"
        padding="lg"
        className="bg-gradient-to-br from-primary-50 via-surface to-secondary/30"
      >
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold text-primary">누적 포인트</p>
          <p className="numeric text-5xl font-bold tracking-tight desktop:text-6xl">
            {totalPoints}
            <span className="ml-1.5 text-2xl font-semibold text-fg-muted desktop:text-3xl">
              P
            </span>
          </p>
          <p className="text-xs text-fg-muted">
            현재 단계:{' '}
            <span className="font-semibold text-primary">
              {TREE_STAGE_DISPLAY[treeStage]}
            </span>
          </p>
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
        <StatTile
          label="총 완독"
          value={`${stats?.completionCount ?? 0}`}
          numeric
        />
        <StatTile
          label="연속 일수"
          value={(stats?.streak ?? 0) === 0 ? '0일' : `${stats!.streak}일`}
          numeric={(stats?.streak ?? 0) > 0}
          hint={
            (stats?.longestStreak ?? 0) > 0
              ? `최장 ${stats!.longestStreak}일`
              : undefined
          }
        />
        <StatTile
          label="이번 주"
          value={`${stats?.weeklyCompletionCount ?? 0}편`}
          numeric={(stats?.weeklyCompletionCount ?? 0) > 0}
        />
        <StatTile label="단계" value={TREE_STAGE_DISPLAY[treeStage]} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight desktop:text-2xl">
          📊 최근 7일 활동
        </h2>
        <Card variant="flat" padding="md">
          <div
            role="img"
            aria-label={`최근 7일 완독 기사 수, 총 ${last7Days.reduce(
              (sum, b) => sum + b.count,
              0,
            )}편`}
            className="flex h-32 items-end gap-2"
          >
            {last7Days.map((b) => {
              const ratio = b.count / weeklyMax
              const heightPct =
                b.count === 0 ? 4 : Math.max(8, ratio * 100)
              const date = new Date(b.date + 'T00:00:00+09:00')
              return (
                <div
                  key={b.date}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-sm bg-primary transition-all"
                      style={{
                        height: `${heightPct}%`,
                        opacity: b.count === 0 ? 0.2 : 1,
                      }}
                      aria-hidden
                    />
                  </div>
                  <span className="text-[10px] text-fg-muted">
                    {WEEKDAY_KO[date.getDay()]}
                  </span>
                  <span className="numeric text-[10px] text-fg-faint">
                    {b.count}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <Link to="/home">
          <Button variant="ghost" size="sm">
            ← 홈
          </Button>
        </Link>
        <Link to="/forest/me">
          <Button variant="secondary" size="sm">
            내 숲 보기
          </Button>
        </Link>
      </div>
    </div>
  )
}

function StatTile({
  label,
  value,
  numeric,
  hint,
}: {
  label: string
  value: string
  numeric?: boolean
  hint?: string
}) {
  return (
    <Card variant="soft" padding="sm">
      <div className="flex flex-col items-start gap-1">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        <span
          className={'text-xl font-bold ' + (numeric ? 'numeric' : '')}
        >
          {value}
        </span>
        {hint && (
          <span className="text-[10px] text-fg-muted">{hint}</span>
        )}
      </div>
    </Card>
  )
}
