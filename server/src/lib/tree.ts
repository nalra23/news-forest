export type TreeStage = 'SEED' | 'SPROUT' | 'TREE' | 'FOREST'

/**
 * CLAUDE.md §2 절대 룰 — 4단계 thresholds.
 * DB tree_growth_stage 의 min_points 와 동일.
 */
export const TREE_STAGE_THRESHOLDS: Record<TreeStage, number> = {
  SEED: 0,
  SPROUT: 50,
  TREE: 200,
  FOREST: 500,
}

export function calcStage(totalPoints: number): TreeStage {
  if (totalPoints >= TREE_STAGE_THRESHOLDS.FOREST) return 'FOREST'
  if (totalPoints >= TREE_STAGE_THRESHOLDS.TREE) return 'TREE'
  if (totalPoints >= TREE_STAGE_THRESHOLDS.SPROUT) return 'SPROUT'
  return 'SEED'
}
