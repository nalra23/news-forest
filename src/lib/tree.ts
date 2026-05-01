export type TreeStage = 'SEED' | 'SPROUT' | 'TREE' | 'FOREST'

export const TREE_STAGE_DISPLAY: Record<TreeStage, string> = {
  SEED: '씨앗',
  SPROUT: '새싹',
  TREE: '나무',
  FOREST: '숲',
}

export const TREE_STAGE_THRESHOLDS: Record<TreeStage, number> = {
  SEED: 0,
  SPROUT: 50,
  TREE: 200,
  FOREST: 500,
}

const STAGE_ORDER: TreeStage[] = ['SEED', 'SPROUT', 'TREE', 'FOREST']

export function calcStage(totalPoints: number): TreeStage {
  if (totalPoints >= TREE_STAGE_THRESHOLDS.FOREST) return 'FOREST'
  if (totalPoints >= TREE_STAGE_THRESHOLDS.TREE) return 'TREE'
  if (totalPoints >= TREE_STAGE_THRESHOLDS.SPROUT) return 'SPROUT'
  return 'SEED'
}

export function nextStage(current: TreeStage): TreeStage | null {
  const idx = STAGE_ORDER.indexOf(current)
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null
  return STAGE_ORDER[idx + 1]
}

export function pointsToNextStage(totalPoints: number): { target: number; remaining: number } {
  const current = calcStage(totalPoints)
  const next = nextStage(current)
  if (!next) {
    return { target: TREE_STAGE_THRESHOLDS.FOREST, remaining: 0 }
  }
  const target = TREE_STAGE_THRESHOLDS[next]
  return { target, remaining: Math.max(0, target - totalPoints) }
}
