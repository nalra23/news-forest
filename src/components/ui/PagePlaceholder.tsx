import { ReactNode } from 'react'

export interface PagePlaceholderProps {
  title: string
  badge?: string
  description?: ReactNode
  children?: ReactNode
}

export function PagePlaceholder({
  title,
  badge,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 desktop:py-10">
      {badge && (
        <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary">
          {badge}
        </span>
      )}
      <h1 className="text-2xl font-bold desktop:text-3xl">{title}</h1>
      {description && (
        <div className="text-sm leading-relaxed text-fg-muted">{description}</div>
      )}
      {children}
    </div>
  )
}
