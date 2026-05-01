import { Link } from 'react-router-dom'
import { Card } from '@/components/ui'

export interface StreakBadgeProps {
  streak: number
  longestStreak: number
  streakAtRisk: boolean
  lastReadDate: string | null
}

type StreakState = 'noStreak-firstTime' | 'noStreak-broken' | 'active' | 'atRisk'

function deriveState(
  streak: number,
  atRisk: boolean,
  lastReadDate: string | null,
): StreakState {
  if (streak > 0 && atRisk) return 'atRisk'
  if (streak > 0) return 'active'
  return lastReadDate === null ? 'noStreak-firstTime' : 'noStreak-broken'
}

export function StreakBadge({
  streak,
  longestStreak,
  streakAtRisk,
  lastReadDate,
}: StreakBadgeProps) {
  const state = deriveState(streak, streakAtRisk, lastReadDate)

  switch (state) {
    case 'active': {
      const isRecord = streak >= longestStreak && streak >= 2
      return (
        <Card
          variant="soft"
          padding="md"
          className="bg-gradient-to-br from-orange-50/40 via-surface to-amber-50/40 dark:from-orange-900/10 dark:to-amber-900/10"
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="text-3xl" aria-hidden>
              🔥
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold">
                <span className="numeric">{streak}</span>
                <span className="ml-0.5 text-sm font-semibold">일 연속</span>
                {isRecord && (
                  <span className="ml-2 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold text-accent-700">
                    NEW RECORD
                  </span>
                )}
              </p>
              <p className="text-xs text-fg-muted">
                {longestStreak > streak
                  ? `최장 기록: ${longestStreak}일`
                  : '계속 이어나가요!'}
              </p>
            </div>
          </Link>
        </Card>
      )
    }
    case 'atRisk':
      return (
        <Card
          variant="soft"
          padding="md"
          className="bg-amber-50/60 ring-1 ring-amber-200 dark:bg-amber-900/15 dark:ring-amber-800/40"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              ⚠️
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                <span className="numeric">{streak}</span>일 streak이 곧 끊겨요!
              </p>
              <p className="text-xs text-fg-muted">
                오늘 자정 전에 기사 1개만 끝까지 읽으면 이어져요.
              </p>
            </div>
          </div>
        </Card>
      )
    case 'noStreak-broken':
      return (
        <Card variant="flat" padding="md">
          <div className="flex items-center gap-3">
            <span className="text-2xl opacity-50" aria-hidden>
              🌱
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                streak가 끊어졌어요. 다시 시작해요!
              </p>
              {longestStreak > 0 && (
                <p className="text-xs text-fg-muted">
                  최장 기록은{' '}
                  <span className="numeric font-semibold">
                    {longestStreak}일
                  </span>
                </p>
              )}
            </div>
          </div>
        </Card>
      )
    case 'noStreak-firstTime':
      return (
        <Card variant="flat" padding="md">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              ✨
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">
                오늘 첫 기사로 streak를 시작해보세요
              </p>
              <p className="text-xs text-fg-muted">
                매일 1개씩 읽으면 일주일 안에 🔥 7일 streak 달성!
              </p>
            </div>
          </div>
        </Card>
      )
  }
}
