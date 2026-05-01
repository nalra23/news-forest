import { TREE_STAGE_DISPLAY, type TreeStage } from '@/lib/tree'
import { TreeArt } from '@/components/tree'

export interface CompletionFeedbackProps {
  pointsAwarded: number
  newStage?: TreeStage | null
}

export function CompletionFeedback({
  pointsAwarded,
  newStage,
}: CompletionFeedbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="my-8 flex flex-col items-center gap-3 rounded-xl bg-primary-50 p-6 text-center animate-fade-in"
    >
      <span className="animate-leaf text-4xl" aria-hidden>
        🍃
      </span>
      <div className="space-y-0.5">
        <p className="font-semibold text-primary">기사 한 편 읽었어요</p>
        <p className="numeric text-sm text-fg-muted">
          +{pointsAwarded} P 적립
        </p>
      </div>
      {newStage && (
        <div className="mt-2 flex flex-col items-center gap-2 rounded-lg border border-primary-300 bg-surface px-4 py-3">
          <div className="h-12 w-12 text-primary">
            <TreeArt stage={newStage} className="h-full w-full" title={`${TREE_STAGE_DISPLAY[newStage]} 단계`} />
          </div>
          <p className="text-xs font-medium text-primary">
            축하해요! 단계가 자랐어요 → {TREE_STAGE_DISPLAY[newStage]}
          </p>
        </div>
      )}
    </div>
  )
}
