import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { Card } from '@/components/ui'
import { relativeTimeKo } from '@/lib/datetime'

/**
 * ArticleCard 가 받는 article 의 최소 형태.
 * MockArticle / ArticleDTO 둘 다 호환.
 */
export interface ArticleCardArticle {
  id: string
  slug: string
  category: string
  categoryDisplayName: string
  title: string
  summary: string
  thumbnailUrl: string
  publishedAt: string
  estimatedReadMinutes: number
}

export interface ArticleCardProps {
  article: ArticleCardArticle
  variant?: 'default' | 'compact'
  className?: string
}

export function ArticleCard({
  article,
  variant = 'default',
  className,
}: ArticleCardProps) {
  const url = `/articles/${article.category}/${article.slug}`

  if (variant === 'compact') {
    return (
      <Link
        to={url}
        className={clsx(
          'block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className,
        )}
      >
        <Card
          variant="soft"
          padding="sm"
          className="transition-all hover:shadow-lift hover:-translate-y-0.5 active:scale-[0.99]"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <CategoryPill name={article.categoryDisplayName} />
              <h3 className="line-clamp-2 text-base font-bold leading-snug">
                {article.title}
              </h3>
              <ArticleMeta article={article} />
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link
      to={url}
      className={clsx(
        'block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className,
      )}
    >
      <Card
        variant="soft"
        padding="none"
        className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lift hover:-translate-y-0.5 active:scale-[0.99]"
      >
        <div className="aspect-video w-full shrink-0 overflow-hidden bg-muted">
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <CategoryPill name={article.categoryDisplayName} />
          <h3 className="line-clamp-2 min-h-[2lh] text-lg font-bold leading-snug">
            {article.title}
          </h3>
          <p className="line-clamp-2 min-h-[2lh] text-sm text-fg-muted">
            {article.summary}
          </p>
          <div className="mt-auto pt-1">
            <ArticleMeta article={article} />
          </div>
        </div>
      </Card>
    </Link>
  )
}

function CategoryPill({ name }: { name: string }) {
  return (
    <span className="w-fit self-start rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary">
      {name}
    </span>
  )
}

function ArticleMeta({ article }: { article: ArticleCardArticle }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-fg-faint">
      <span aria-hidden>⏱</span>
      <span className="numeric">{article.estimatedReadMinutes}분</span>
      <span aria-hidden>·</span>
      <span>{relativeTimeKo(article.publishedAt)}</span>
    </p>
  )
}
