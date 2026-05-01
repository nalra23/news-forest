import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArticleCard } from '@/components/article'
import { TreeArt, TreeWidget } from '@/components/tree'
import { Button, Card, Skeleton } from '@/components/ui'
import { relativeTimeKo } from '@/lib/datetime'
import { TREE_STAGE_DISPLAY, type TreeStage } from '@/lib/tree'
import {
  useMyGrowthHistory,
  useMyStats,
  useMyTransactions,
  type GrowthHistoryDTO,
  type PointTransactionDTO,
} from '@/hooks/queries'
import { useUserStore } from '@/stores'

export function MyForestPage() {
  const user = useUserStore((s) => s.user)
  const statsQuery = useMyStats()
  const transactionsQuery = useMyTransactions(20)
  const growthHistoryQuery = useMyGrowthHistory()

  const completions = useMemo<PointTransactionDTO[]>(
    () =>
      (transactionsQuery.data?.items ?? []).filter(
        (t) => t.type === 'ARTICLE_COMPLETE',
      ),
    [transactionsQuery.data],
  )

  const stageTransitions = useMemo<GrowthHistoryDTO[]>(
    () =>
      (growthHistoryQuery.data?.items ?? []).filter(
        (g) => g.fromStage !== null,
      ),
    [growthHistoryQuery.data],
  )

  if (!user || statsQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <Skeleton className="mx-auto h-64 w-64 rounded-full" />
        <Skeleton className="mx-auto h-6 w-32" />
      </div>
    )
  }

  const stats = statsQuery.data
  const totalPoints = stats?.totalPoints ?? user.totalPoints
  const treeStage: TreeStage = (stats?.treeStage ?? user.treeStage) as TreeStage
  const completionCount = stats?.completionCount ?? 0

  const memberDays = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) /
        (24 * 60 * 60 * 1000),
    ),
  )

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-6 desktop:py-10">
      <header className="space-y-1 text-center animate-fade-in">
        <p className="text-sm font-semibold text-primary">내 숲</p>
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          {user.nickname}
        </h1>
      </header>

      <section
        aria-label="나의 나무"
        className="flex flex-col items-center gap-6"
      >
        <TreeWidget
          stage={treeStage}
          totalPoints={totalPoints}
          size="large"
        />
      </section>

      <section aria-label="활동 요약">
        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
          <StatCard label="누적 P" value={`${totalPoints}`} numeric />
          <StatCard
            label="완독 기사"
            value={`${completionCount}`}
            numeric
          />
          <StatCard
            label="현재 단계"
            value={TREE_STAGE_DISPLAY[treeStage]}
          />
          <StatCard
            label="시작"
            value={memberDays === 0 ? '오늘' : `${memberDays}일째`}
            numeric={memberDays > 0}
          />
        </div>
      </section>

      {stageTransitions.length > 0 && (
        <Section title="🌳 성장 history">
          <Card variant="soft" padding="md">
            <ol className="space-y-3">
              {stageTransitions.map((rec) => (
                <GrowthTimelineItem key={rec.id} record={rec} />
              ))}
            </ol>
          </Card>
        </Section>
      )}

      {completions.length > 0 ? (
        <Section title="📖 최근 완독">
          <ul className="grid gap-3">
            {completions.slice(0, 5).map((tx) => (
              <CompletionListItem key={tx.id} tx={tx} />
            ))}
          </ul>
        </Section>
      ) : (
        <EmptyHistory />
      )}

      <div className="flex flex-wrap justify-center gap-2 pt-4">
        <Link to="/forest/explore">
          <Button>다른 숲 둘러보기</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="ghost">활동 통계 보기</Button>
        </Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight desktop:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  )
}

function StatCard({
  label,
  value,
  numeric,
}: {
  label: string
  value: string
  numeric?: boolean
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
      </div>
    </Card>
  )
}

function GrowthTimelineItem({ record }: { record: GrowthHistoryDTO }) {
  const fromName = record.fromStage
    ? TREE_STAGE_DISPLAY[record.fromStage]
    : null
  const toName = TREE_STAGE_DISPLAY[record.toStage]

  return (
    <li className="flex items-center gap-3">
      <div className="flex shrink-0 items-center gap-1.5">
        {record.fromStage && (
          <>
            <StageIcon stage={record.fromStage} />
            <span aria-hidden className="text-fg-faint">
              →
            </span>
          </>
        )}
        <StageIcon stage={record.toStage} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {fromName ? `${fromName} → ${toName}` : `${toName} 시작`}
        </p>
        <p className="text-xs text-fg-muted">
          {relativeTimeKo(record.changedAt)}
          <span className="mx-1.5" aria-hidden>
            ·
          </span>
          <span className="numeric">{record.pointsAtChange} P</span>
        </p>
      </div>
    </li>
  )
}

function StageIcon({ stage }: { stage: TreeStage }) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary/40 text-primary">
      <TreeArt stage={stage} className="h-6 w-6" />
    </span>
  )
}

function CompletionListItem({ tx }: { tx: PointTransactionDTO }) {
  if (!tx.article) {
    return (
      <li>
        <Card variant="flat" padding="sm">
          <p className="text-sm">+{tx.amount} P</p>
        </Card>
      </li>
    )
  }
  const liteArticle = {
    id: tx.id,
    source: 'segye' as const,
    externalId: '',
    slug: tx.article.slug,
    category: tx.article.category,
    categoryDisplayName: tx.article.categoryDisplayName,
    title: tx.article.title,
    summary: '',
    body: '',
    thumbnailUrl: '',
    publishedAt: tx.createdAt,
    bodyLength: 0,
    estimatedReadMinutes: 3,
  }
  return (
    <li>
      <ArticleCard article={liteArticle} variant="compact" />
      <p className="mt-1 text-xs text-fg-faint">
        <span className="numeric">+{tx.amount} P</span>
        <span className="mx-1.5" aria-hidden>
          ·
        </span>
        <span>{relativeTimeKo(tx.createdAt)}</span>
      </p>
    </li>
  )
}

function EmptyHistory() {
  return (
    <Card variant="flat" padding="lg">
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <span className="text-4xl" aria-hidden>
          🌱
        </span>
        <p className="text-sm font-medium">아직 씨앗이 심어지지 않았어요</p>
        <p className="max-w-sm text-xs text-fg-muted">
          첫 기사를 읽으면 나무가 자라기 시작해요.
        </p>
        <Link to="/home">
          <Button size="sm">기사 둘러보기</Button>
        </Link>
      </div>
    </Card>
  )
}
