import { clsx } from 'clsx'

export interface ReadingProgressBarProps {
  /** 0~1 */
  progress: number
  /** Page visibility — hidden 시 흐려짐 */
  isVisible: boolean
  /** 완독 후 fade out trigger */
  isCompleted: boolean
}

export function ReadingProgressBar({
  progress,
  isVisible,
  isCompleted,
}: ReadingProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="기사 읽기 진행률"
      className={clsx(
        'sticky top-14 z-30 h-0.5 bg-primary-100 desktop:top-16',
        'transition-opacity duration-[600ms] ease-out',
        isCompleted ? 'opacity-0' : !isVisible ? 'opacity-40' : 'opacity-100',
      )}
    >
      <div
        className="h-full origin-left bg-primary transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
