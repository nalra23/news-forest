import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

type CardVariant = 'soft' | 'lift' | 'flat'
type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
}

const variantClasses: Record<CardVariant, string> = {
  soft: 'shadow-soft',
  lift: 'shadow-lift',
  flat: 'border',
}

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 desktop:p-6',
  lg: 'p-6 desktop:p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'soft', padding = 'md', className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-2xl bg-surface',
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
})
