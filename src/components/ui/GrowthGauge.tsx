import { clsx } from 'clsx'

export interface GrowthGaugeProps {
  current: number
  target: number
  size?: 'compact' | 'medium'
  showLabel?: boolean
  className?: string
}

export function GrowthGauge({
  current,
  target,
  size = 'medium',
  showLabel = true,
  className,
}: GrowthGaugeProps) {
  const ratio = target > 0 ? Math.min(1, Math.max(0, current / target)) : 1
  const pct = Math.round(ratio * 100)

  return (
    <div className={clsx('w-full', className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.min(current, target)}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-label={`성장 진행률 ${pct}%`}
        className={clsx(
          'w-full overflow-hidden rounded-full bg-primary-100',
          size === 'compact' && 'h-1.5',
          size === 'medium' && 'h-2',
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 flex items-center justify-between text-xs text-fg-muted">
          <span className="numeric">
            {current} / {target} P
          </span>
          <span className="numeric">{pct}%</span>
        </div>
      )}
    </div>
  )
}
