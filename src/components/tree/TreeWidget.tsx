import { clsx } from 'clsx'
import { GrowthGauge } from '@/components/ui'
import {
  TREE_STAGE_DISPLAY,
  pointsToNextStage,
  type TreeStage,
} from '@/lib/tree'
import { TreeArt } from './TreeArt'

export interface TreeWidgetProps {
  stage: TreeStage
  totalPoints: number
  size?: 'compact' | 'medium' | 'large'
  showLabel?: boolean
  className?: string
}

const SIZE_CONTAINER: Record<NonNullable<TreeWidgetProps['size']>, string> = {
  compact: 'h-16 w-16 desktop:h-20 desktop:w-20',
  medium: 'h-44 w-44 desktop:h-52 desktop:w-52',
  large: 'h-64 w-64 desktop:h-80 desktop:w-80',
}

export function TreeWidget({
  stage,
  totalPoints,
  size = 'medium',
  showLabel = true,
  className,
}: TreeWidgetProps) {
  const stageName = TREE_STAGE_DISPLAY[stage]
  const isMaxStage = stage === 'FOREST'
  const { target, remaining } = pointsToNextStage(totalPoints)

  const transitionAnim =
    stage === 'FOREST' ? 'animate-stage-transition-lg' : 'animate-stage-transition'

  if (size === 'compact') {
    return (
      <div className={clsx('flex flex-col items-center gap-1.5', className)}>
        <div
          className={clsx(
            SIZE_CONTAINER.compact,
            'flex items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary/40',
          )}
        >
          <div
            key={stage}
            className={clsx('h-3/4 w-3/4 text-primary', transitionAnim)}
          >
            <TreeArt
              stage={stage}
              className="h-full w-full"
              title={`${stageName} 단계`}
            />
          </div>
        </div>
        {showLabel && (
          <p className="text-xs font-semibold text-fg-muted">{stageName}</p>
        )}
      </div>
    )
  }

  return (
    <div className={clsx('flex flex-col items-center gap-5', className)}>
      <div
        className={clsx(
          SIZE_CONTAINER[size],
          'flex items-center justify-center rounded-full bg-gradient-to-br from-primary-50 via-surface to-secondary/40 shadow-soft',
        )}
      >
        <div
          key={stage}
          className={clsx('h-2/3 w-2/3 text-primary', transitionAnim)}
        >
          <TreeArt
            stage={stage}
            className="h-full w-full"
            title={`${stageName} 단계`}
          />
        </div>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">{stageName}</p>
          <p className="numeric mt-1 text-3xl font-bold desktop:text-4xl">
            {totalPoints}
            <span className="ml-1 text-base font-semibold text-fg-muted desktop:text-lg">
              P
            </span>
          </p>
        </div>
      )}
      {!isMaxStage && (
        <div className="w-full max-w-xs space-y-1.5">
          <GrowthGauge
            current={totalPoints}
            target={target}
            size="medium"
            showLabel={false}
          />
          <p className="text-center text-xs text-fg-muted">
            <span className="numeric font-medium">{remaining}</span>
            P 더 모으면 다음 단계로!
          </p>
        </div>
      )}
      {isMaxStage && (
        <p className="text-center text-xs text-fg-muted">
          🌳 최고 단계인 숲에 도달했어요!
        </p>
      )}
    </div>
  )
}
