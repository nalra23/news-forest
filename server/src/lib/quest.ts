import type { PoolClient } from 'pg'
import { calcStage, type TreeStage } from './tree.js'

/**
 * KST 일자 키 — daily quest period key.
 * 'YYYY-MM-DD' 형태.
 */
export function dailyPeriodKey(d = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return fmt.format(d) // 'YYYY-MM-DD'
}

/**
 * KST 주차 키 — weekly quest period key.
 * 'YYYY-Www' (ISO 주차).
 */
export function weeklyPeriodKey(d = new Date()): string {
  // KST로 보정
  const kstMs = d.getTime() + 9 * 60 * 60 * 1000
  const kst = new Date(kstMs)
  // ISO week date calculation
  const day = kst.getUTCDay() === 0 ? 7 : kst.getUTCDay()
  const thursday = new Date(kst)
  thursday.setUTCDate(kst.getUTCDate() - day + 4)
  const year = thursday.getUTCFullYear()
  const startOfYear = new Date(Date.UTC(year, 0, 1))
  const week = Math.ceil(
    ((thursday.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7,
  )
  return `${year}-W${String(week).padStart(2, '0')}`
}

export interface QuestRow {
  id: number
  code: string
  title: string
  description: string | null
  quest_type: 'DAILY' | 'WEEKLY'
  target_action: string
  target_count: number
  reward_points: number
}

export interface ParticipationRow {
  id: number
  quest_id: number
  progress_count: number
  completed_at: string | null
  reward_granted: boolean
  period_key: string
}

/**
 * 사용자에 대해 현재 active period 의 quest_participation 을 보장.
 * 없으면 INSERT.
 * Returns active quests + participation 상태.
 */
export async function ensureActiveQuestsForUser(
  client: PoolClient,
  userId: number,
): Promise<Array<QuestRow & { participation: ParticipationRow }>> {
  const dailyKey = dailyPeriodKey()
  const weeklyKey = weeklyPeriodKey()

  // Active quests (active_from <= NOW < active_to)
  const questsRes = await client.query<QuestRow>(
    `SELECT id, code, title, description, quest_type, target_action, target_count, reward_points
     FROM quest
     WHERE active_from <= NOW() AND active_to > NOW()
     ORDER BY quest_type ASC, id ASC`,
  )

  const result: Array<QuestRow & { participation: ParticipationRow }> = []

  for (const q of questsRes.rows) {
    const periodKey = q.quest_type === 'DAILY' ? dailyKey : weeklyKey

    // upsert participation
    await client.query(
      `INSERT INTO quest_participation
         (user_id, quest_id, period_key, progress_count, completed_at, reward_granted)
       VALUES ($1, $2, $3, 0, NULL, FALSE)
       ON CONFLICT (user_id, quest_id, period_key) DO NOTHING`,
      [userId, q.id, periodKey],
    )

    const partRes = await client.query<ParticipationRow>(
      `SELECT id, quest_id, progress_count, completed_at::text AS completed_at,
              reward_granted, period_key
       FROM quest_participation
       WHERE user_id = $1 AND quest_id = $2 AND period_key = $3`,
      [userId, q.id, periodKey],
    )
    if (partRes.rowCount! > 0) {
      result.push({ ...q, participation: partRes.rows[0] })
    }
  }

  return result
}

/**
 * 특정 action 발생 시 해당 사용자의 활성 quest 들의 progress 를 +1.
 * 진행중 quest 가 target_count 도달 시 자동으로:
 *  - completed_at = NOW()
 *  - point_transaction (+reward_points, type='QUEST') INSERT
 *  - tree.total_points 업데이트 (+ stage 변화 시 history)
 *  - reward_granted = TRUE
 *
 * Returns 적립된 quest reward 목록.
 */
export interface QuestRewardEvent {
  questCode: string
  questTitle: string
  rewardPoints: number
  newTotalPoints: number
  newTreeStage: TreeStage
  stageChanged: boolean
}

export async function progressActiveQuestsForAction(
  client: PoolClient,
  userId: number,
  action: 'READ_ARTICLE' | 'WATERING',
): Promise<QuestRewardEvent[]> {
  // Make sure active quests exist for user
  const active = await ensureActiveQuestsForUser(client, userId)
  const matching = active.filter(
    (q) => q.target_action === action && !q.participation.completed_at,
  )

  const rewards: QuestRewardEvent[] = []

  for (const q of matching) {
    // Increment progress
    const newProgress = q.participation.progress_count + 1
    const reachedTarget = newProgress >= q.target_count

    if (!reachedTarget) {
      await client.query(
        `UPDATE quest_participation
         SET progress_count = $1
         WHERE id = $2`,
        [newProgress, q.participation.id],
      )
      continue
    }

    // 완료 — 보상 자동 지급
    await client.query(
      `UPDATE quest_participation
       SET progress_count = $1, completed_at = NOW(), reward_granted = TRUE
       WHERE id = $2`,
      [q.target_count, q.participation.id],
    )

    // tree 정보 lock + 보상 적립
    const treeRes = await client.query<{
      id: number
      stage_id: number
      stage_code: string
      total_points: number
    }>(
      `SELECT t.id, t.stage_id, s.code AS stage_code, t.total_points
       FROM tree t JOIN tree_growth_stage s ON s.id = t.stage_id
       WHERE t.user_id = $1 FOR UPDATE`,
      [userId],
    )
    if (!treeRes.rowCount) continue
    const tree = treeRes.rows[0]
    const oldTotal = Number(tree.total_points)
    const newTotal = oldTotal + q.reward_points
    const newStageCode = calcStage(newTotal) as TreeStage
    const stageChanged = tree.stage_code !== newStageCode

    await client.query(
      `INSERT INTO point_transaction
         (user_id, amount, type, quest_participation_id, balance_after)
       VALUES ($1, $2, 'QUEST', $3, $4)`,
      [userId, q.reward_points, q.participation.id, newTotal],
    )

    if (stageChanged) {
      const stageIdRes = await client.query<{ id: number }>(
        `SELECT id FROM tree_growth_stage WHERE code = $1`,
        [newStageCode],
      )
      const newStageId = Number(stageIdRes.rows[0].id)
      await client.query(
        `UPDATE tree
         SET total_points=$1, stage_id=$2, last_grown_at=NOW()
         WHERE id=$3`,
        [newTotal, newStageId, tree.id],
      )
      await client.query(
        `INSERT INTO tree_growth_history
           (tree_id, from_stage_id, to_stage_id, points_at_change)
         VALUES ($1, $2, $3, $4)`,
        [tree.id, tree.stage_id, newStageId, newTotal],
      )
    } else {
      await client.query(
        `UPDATE tree SET total_points=$1 WHERE id=$2`,
        [newTotal, tree.id],
      )
    }

    rewards.push({
      questCode: q.code,
      questTitle: q.title,
      rewardPoints: q.reward_points,
      newTotalPoints: newTotal,
      newTreeStage: newStageCode,
      stageChanged,
    })
  }

  return rewards
}
