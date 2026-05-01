import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={clsx('animate-shimmer rounded-md bg-muted', className)}
      {...rest}
    />
  )
}
