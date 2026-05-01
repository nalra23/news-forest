import { Card } from '@/components/ui'
import type { QuestDTO } from '@/hooks/queries'

export interface QuestCardProps {
  quest: QuestDTO
  variant?: 'default' | 'compact'
}

export function QuestCard({ quest, variant = 'default' }: QuestCardProps) {
  const ratio = Math.min(
    1,
    quest.progressCount / Math.max(1, quest.targetCount),
  )
  const pct = Math.round(ratio * 100)
  const isCompleted = quest.completedAt !== null
  const typeLabel =
    quest.questType === 'DAILY' ? '오늘의 미션' : '이번 주의 미션'
  const actionEmoji = quest.targetAction === 'READ_ARTICLE' ? '📰' : '💧'

  if (variant === 'compact') {
    return (
      <Card variant="flat" padding="sm">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-base" aria-hidden>
              {actionEmoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">
                {quest.title}
              </p>
              <p className="numeric text-xs text-fg-muted">
                {quest.progressCount}/{quest.targetCount} ·{' '}
                <span className="font-medium text-primary">
                  +{quest.rewardPoints}P
                </span>
              </p>
            </div>
            {isCompleted && (
              <span className="text-base" aria-hidden>
                ✅
              </span>
            )}
          </div>
          <ProgressBar pct={pct} completed={isCompleted} />
        </div>
      </Card>
    )
  }

  return (
    <Card variant="soft" padding="md">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-fg-muted">
              {typeLabel}
            </p>
            <h3 className="text-base font-bold">{quest.title}</h3>
            {quest.description && (
              <p className="text-xs text-fg-muted">{quest.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-semibold text-foreground">
              <span aria-hidden>💧</span>
              <span className="numeric">+{quest.rewardPoints}P</span>
            </span>
            {isCompleted && (
              <span className="text-xs font-medium text-primary">완료 ✅</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-fg-muted">
              <span aria-hidden>{actionEmoji}</span>
              <span>{progressLabel(quest)}</span>
            </span>
            <span className="numeric text-fg-muted">
              <span className="font-semibold text-foreground">
                {quest.progressCount}
              </span>
              <span className="mx-1">/</span>
              <span>{quest.targetCount}</span>
            </span>
          </div>
          <ProgressBar pct={pct} completed={isCompleted} />
        </div>
      </div>
    </Card>
  )
}

function progressLabel(q: QuestDTO): string {
  if (q.targetAction === 'READ_ARTICLE') return '기사 완독'
  if (q.targetAction === 'WATERING') return '물 주기'
  return '진행도'
}

function ProgressBar({ pct, completed }: { pct: number; completed: boolean }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-primary-100"
    >
      <div
        className={
          'h-full rounded-full transition-[width] duration-500 ease-out ' +
          (completed ? 'bg-success' : 'bg-primary')
        }
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
