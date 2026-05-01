import { Link, useParams } from 'react-router-dom'
import { ArticleCard } from '@/components/article'
import { Button, Card, Skeleton } from '@/components/ui'
import { CATEGORIES, findCategory } from '@/lib/categories'
import { useArticlesByCategory } from '@/hooks/queries'

export function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const cat = category ? findCategory(category) : undefined
  const { data, isLoading, isError } = useArticlesByCategory(
    cat ? category : undefined,
  )
  const articles = data?.items ?? []

  if (!category || !cat) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 text-center">
        <h1 className="text-2xl font-bold">카테고리를 찾을 수 없어요</h1>
        <p className="text-sm text-fg-muted">아래에서 다른 카테고리를 골라보세요.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.code} to={`/articles/${c.code}`}>
              <Button variant="secondary" size="sm">
                {c.emoji} {c.displayName}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 desktop:py-10">
      <nav aria-label="breadcrumb" className="text-sm text-fg-muted">
        <Link to="/articles" className="underline-offset-2 hover:underline">
          Articles
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{cat.displayName}</span>
      </nav>

      <header className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary/40 text-3xl">
          <span aria-hidden>{cat.emoji}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
            {cat.displayName}
          </h1>
          <p className="text-sm text-fg-muted">
            {isLoading ? (
              <span>—</span>
            ) : (
              <>
                <span className="numeric font-semibold">{articles.length}</span>개 기사
              </>
            )}
          </p>
        </div>
      </header>

      {isError ? (
        <p className="text-sm text-fg-muted">기사를 불러오지 못했어요.</p>
      ) : isLoading ? (
        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <Card variant="flat" padding="lg">
          <div className="space-y-2 py-4 text-center">
            <span className="text-3xl" aria-hidden>
              🌱
            </span>
            <p className="text-sm">아직 이 카테고리의 기사가 없어요</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-t pt-6">
        <span className="text-xs text-fg-muted">다른 카테고리:</span>
        {CATEGORIES.filter((c) => c.code !== category).map((c) => (
          <Link key={c.code} to={`/articles/${c.code}`}>
            <Button variant="ghost" size="sm">
              {c.emoji} {c.displayName}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
