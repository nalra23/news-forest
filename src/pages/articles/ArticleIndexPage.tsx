import { Link } from 'react-router-dom'
import { ArticleCard } from '@/components/article'
import { Card, Skeleton } from '@/components/ui'
import { CATEGORIES } from '@/lib/categories'
import { useFeedHome } from '@/hooks/queries'

export function ArticleIndexPage() {
  const { data, isLoading, isError } = useFeedHome()
  const recentArticles = data?.recent?.slice(0, 6) ?? []

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 desktop:py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          Articles
        </h1>
        <p className="text-sm text-fg-muted">
          카테고리별로 둘러보세요. 마음에 드는 기사를 골라 차분히 읽어보세요.
        </p>
      </header>

      <div className="grid gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.code}
            to={`/articles/${c.code}`}
            className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Card
              variant="soft"
              padding="md"
              className="transition-all hover:shadow-lift hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary/40 text-2xl">
                  <span aria-hidden>{c.emoji}</span>
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h2 className="text-base font-bold">{c.displayName}</h2>
                  <p className="text-xs text-fg-muted">둘러보기</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">최근 기사</h2>
        {isError ? (
          <p className="text-sm text-fg-muted">기사를 불러오지 못했어요.</p>
        ) : isLoading ? (
          <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {recentArticles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
