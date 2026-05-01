import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export interface CategoryChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  emoji?: string
  size?: 'sm' | 'md'
}

export const CategoryChip = forwardRef<HTMLButtonElement, CategoryChipProps>(
  function CategoryChip(
    { selected = false, emoji, size = 'md', className, children, type = 'button', ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={selected}
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full font-semibold transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'active:scale-[0.97]',
          size === 'sm' && 'px-3 py-1 text-xs',
          size === 'md' && 'px-4 py-2 text-sm',
          selected
            ? 'bg-primary text-white shadow-soft'
            : 'bg-muted text-foreground hover:bg-primary-50',
          className,
        )}
        {...rest}
      >
        {emoji && (
          <span aria-hidden className="leading-none">
            {emoji}
          </span>
        )}
        <span>{children}</span>
      </button>
    )
  },
)
