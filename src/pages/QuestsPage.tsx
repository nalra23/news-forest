import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { QuestCard } from '@/components/quest'
import { Button, Card, Skeleton } from '@/components/ui'
import { useActiveQuests, type QuestDTO } from '@/hooks/queries'

export function QuestsPage() {
  const questsQuery = useActiveQuests()

  const { dailyQuests, weeklyQuests } = useMemo(() => {
    const items = questsQuery.data?.items ?? []
    return {
      dailyQuests: items.filter((q) => q.questType === 'DAILY'),
      weeklyQuests: items.filter((q) => q.questType === 'WEEKLY'),
    }
  }, [questsQuery.data])

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 desktop:py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary">미션</p>
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          오늘의 작은 도전
        </h1>
        <p className="text-sm text-fg-muted">
          매일·매주 새로 발급돼요. 완료하면 자동으로 보상 포인트가 적립됩니다.
        </p>
      </header>

      {questsQuery.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : questsQuery.isError ? (
        <Card variant="flat" padding="md">
          <div className="space-y-2 py-3 text-center">
            <span className="text-3xl" aria-hidden>
              🍂
            </span>
            <p className="text-sm">미션을 불러오지 못했어요</p>
            <Button size="sm" variant="ghost" onClick={() => questsQuery.refetch()}>
              다시 시도
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Section title="🌱 오늘의 미션" subtitle="매일 자정(KST) 자동 갱신">
            <QuestList quests={dailyQuests} />
          </Section>
          <Section title="🌳 이번 주 미션" subtitle="월요일 자정(KST) 자동 갱신">
            <QuestList quests={weeklyQuests} />
          </Section>
        </>
      )}

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <Link to="/home">
          <Button variant="ghost" size="sm">
            ← 홈
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary" size="sm">
            대시보드
          </Button>
        </Link>
      </div>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <header className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight desktop:text-2xl">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-fg-muted">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}

function QuestList({ quests }: { quests: QuestDTO[] }) {
  if (quests.length === 0) {
    return (
      <Card variant="flat" padding="md">
        <p className="py-3 text-center text-sm text-fg-muted">
          이 기간에 발급된 미션이 없어요.
        </p>
      </Card>
    )
  }
  return (
    <ul className="grid gap-3">
      {quests.map((q) => (
        <li key={q.questId}>
          <QuestCard quest={q} />
        </li>
      ))}
    </ul>
  )
}
