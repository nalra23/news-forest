import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface PointBadgeProps {
  value: number
  className?: string
}

const DURATION_MS = 350

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function PointBadge({ value, className }: PointBadgeProps) {
  const [display, setDisplay] = useState(value)
  const rafRef = useRef<number | null>(null)
  const prevValueRef = useRef(value)

  useEffect(() => {
    const from = prevValueRef.current
    const to = value
    if (from === to) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplay(to)
      prevValueRef.current = to
      return
    }

    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS)
      const eased = easeOutCubic(t)
      const current = Math.round(from + (to - from) * eased)
      setDisplay(current)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        prevValueRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-sm',
        className,
      )}
      aria-label={`${value} 포인트`}
    >
      <Icon name="drop" emoji="💧" className="h-4 w-4 text-base" />
      <span className="numeric font-semibold">{display}</span>
      <span className="font-semibold">P</span>
    </span>
  )
}
