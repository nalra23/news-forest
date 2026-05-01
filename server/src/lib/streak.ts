import type { PoolClient } from 'pg'

const STREAK_WINDOW_DAYS = 60
const STREAK_MILESTONES = [7, 30, 100, 365] as const

export interface StreakDelta {
  /** 이번 활동 반영 후 현재 streak */
  streakDays: number
  /** 이번 활동 반영 전 streak (오늘 첫 활동이라면 어제 기준 streak) */
  previousStreak: number
  /** 이번 완료로 새로 도달한 마일스톤 (없으면 null) */
  milestone: number | null
  /** 오늘이 이미 카운트되어 있어 streak 변화가 없었는지 */
  alreadyCountedToday: boolean
}

const fmtKST = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)

function streakUpToDay(daySet: Set<string>, anchorKst: string): number {
  // anchor가 daySet에 없으면 0
  if (!daySet.has(anchorKst)) return 0
  let n = 0
  const cursor = new Date(anchorKst + 'T00:00:00Z')
  for (let i = 0; i < STREAK_WINDOW_DAYS; i++) {
    const day = cursor.toISOString().slice(0, 10)
    if (daySet.has(day)) {
      n++
      cursor.setUTCDate(cursor.getUTCDate() - 1)
    } else {
      break
    }
  }
  return n
}

/**
 * 트랜잭션 안에서 호출. point_transaction에 새 ARTICLE_COMPLETE 또는 QUEST 보상이 INSERT된 후
 * (read-your-own-writes), 현재 / 직전 streak 및 milestone 도달 여부를 계산한다.
 *
 * "직전 streak"은 오늘 KST 일자를 제외한 채 어제까지의 streak — 이번 활동이 streak에 기여한 양을 측정.
 */
export async function calcStreakDelta(
  client: PoolClient,
  userId: number,
): Promise<StreakDelta> {
  const res = await client.query<{ day: string }>(
    `SELECT DISTINCT
              TO_CHAR(created_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD') AS day
       FROM point_transaction
       WHERE user_id = $1 AND type = 'ARTICLE_COMPLETE'
         AND created_at > NOW() - INTERVAL '${STREAK_WINDOW_DAYS} days'
       ORDER BY day DESC`,
    [userId],
  )
  const daySet = new Set(res.rows.map((r) => r.day))
  const todayKst = fmtKST(new Date())
  const yest = new Date()
  yest.setDate(yest.getDate() - 1)
  const yesterdayKst = fmtKST(yest)

  // 새 streak (이번 row 반영 후): 오늘 또는 어제부터 거꾸로 (오늘이 가장 안전)
  const streakDays = daySet.has(todayKst)
    ? streakUpToDay(daySet, todayKst)
    : daySet.has(yesterdayKst)
      ? streakUpToDay(daySet, yesterdayKst)
      : 0

  // 직전 streak: 오늘을 빼고 어제까지로 계산
  const daySetWithoutToday = new Set(daySet)
  daySetWithoutToday.delete(todayKst)
  const previousStreak = daySetWithoutToday.has(yesterdayKst)
    ? streakUpToDay(daySetWithoutToday, yesterdayKst)
    : 0

  const alreadyCountedToday = streakDays === previousStreak

  let milestone: number | null = null
  for (const m of STREAK_MILESTONES) {
    if (previousStreak < m && streakDays >= m) {
      milestone = m
      break
    }
  }

  return { streakDays, previousStreak, milestone, alreadyCountedToday }
}
