import { Link } from 'react-router-dom'
import { TreeArt } from '@/components/tree'
import { Button, Card, Skeleton } from '@/components/ui'
import { TREE_STAGE_DISPLAY, type TreeStage } from '@/lib/tree'
import { useWeeklyRanking, type RankingEntry } from '@/hooks/queries'

const MEDAL_BY_RANK: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

export function RankingPage() {
  const rankingQuery = useWeeklyRanking(50)
  const data = rankingQuery.data

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 desktop:py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary">Weekly Ranking</p>
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          이번 주 랭킹 🏆
        </h1>
        <p className="text-sm text-fg-muted">
          이번 주(KST 월요일 자정~) 누적된 포인트 기준이에요. 매주 자동 reset.
        </p>
      </header>

      {rankingQuery.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : rankingQuery.isError ? (
        <Card variant="flat" padding="md">
          <p className="py-3 text-center text-sm text-fg-muted">
            랭킹을 불러오지 못했어요.
          </p>
        </Card>
      ) : (
        <>
          {/* Top 3 highlight */}
          {data!.items.length > 0 && (
            <section className="grid gap-3 tablet:grid-cols-3">
              {data!.items.slice(0, 3).map((entry) => (
                <PodiumCard key={entry.publicId} entry={entry} />
              ))}
            </section>
          )}

          {/* Rest 4~50 */}
          {data!.items.length > 3 && (
            <section>
              <ul className="space-y-2">
                {data!.items.slice(3).map((entry) => (
                  <li key={entry.publicId}>
                    <RankRow entry={entry} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Me — 랭킹 밖일 때 별도 표시 */}
          {data!.me.rank === null && (
            <Card variant="flat" padding="md" className="bg-primary-50/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary">
                  -
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {data!.me.nickname}{' '}
                    <span className="text-xs font-normal text-fg-muted">
                      (나)
                    </span>
                  </p>
                  <p className="text-xs text-fg-muted">
                    이번 주{' '}
                    <span className="numeric font-semibold text-foreground">
                      {data!.me.weeklyPoints}P
                    </span>{' '}
                    · 50위 밖
                  </p>
                </div>
              </div>
            </Card>
          )}

          {data!.items.length === 0 && (
            <Card variant="flat" padding="lg">
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <span className="text-4xl" aria-hidden>
                  🌱
                </span>
                <p className="text-sm font-medium">
                  아직 이번 주 활동이 없어요
                </p>
                <p className="text-xs text-fg-muted">
                  첫 기사를 읽으면 랭킹에 등장해요.
                </p>
                <Link to="/home">
                  <Button size="sm">기사 둘러보기</Button>
                </Link>
              </div>
            </Card>
          )}
        </>
      )}

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <Link to="/home">
          <Button variant="ghost" size="sm">
            ← 홈
          </Button>
        </Link>
        <Link to="/forest/me">
          <Button variant="secondary" size="sm">
            내 숲
          </Button>
        </Link>
      </div>
    </div>
  )
}

function PodiumCard({ entry }: { entry: RankingEntry }) {
  const medal = MEDAL_BY_RANK[entry.rank]
  return (
    <Card
      variant="soft"
      padding="md"
      className={
        entry.isMe
          ? 'ring-2 ring-primary'
          : entry.rank === 1
            ? 'bg-gradient-to-br from-accent-100 via-surface to-secondary/20'
            : ''
      }
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl" aria-hidden>
          {medal}
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary/40 text-primary">
          <TreeArt
            stage={entry.treeStage}
            className="h-9 w-9"
            title={`${TREE_STAGE_DISPLAY[entry.treeStage]} 단계`}
          />
        </div>
        <div className="min-w-0">
          <p className="line-clamp-1 text-sm font-bold">
            {entry.nickname}
            {entry.isMe && (
              <span className="ml-1 text-xs font-normal text-primary">
                (나)
              </span>
            )}
          </p>
          <p className="text-xs text-fg-muted">
            {TREE_STAGE_DISPLAY[entry.treeStage]}
          </p>
        </div>
        <p className="numeric text-lg font-bold">{entry.weeklyPoints} P</p>
      </div>
    </Card>
  )
}

function RankRow({ entry }: { entry: RankingEntry }) {
  return (
    <Card
      variant={entry.isMe ? 'soft' : 'flat'}
      padding="sm"
      className={entry.isMe ? 'ring-2 ring-primary' : ''}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-fg-muted">
          {entry.rank}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
          <TreeArt stage={entry.treeStage as TreeStage} className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold">
            {entry.nickname}
            {entry.isMe && (
              <span className="ml-1 text-xs font-normal text-primary">
                (나)
              </span>
            )}
          </p>
          <p className="text-xs text-fg-muted">
            {TREE_STAGE_DISPLAY[entry.treeStage]} · 누적{' '}
            <span className="numeric">{entry.totalPoints}</span>P
          </p>
        </div>
        <p className="numeric text-sm font-bold">
          +{entry.weeklyPoints}
          <span className="ml-0.5 text-xs font-normal text-fg-muted">P</span>
        </p>
      </div>
    </Card>
  )
}
