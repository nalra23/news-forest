import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArticleCard,
  CompletionFeedback,
  ReadingProgressBar,
} from '@/components/article'
import { Button, Card, Skeleton } from '@/components/ui'
import { useReadingValidator } from '@/hooks/useReadingValidator'
import {
  useArticleBySlug,
  useArticlesByCategory,
  useCompleteReadingSession,
  useStartReadingSession,
} from '@/hooks/queries'
import { findCategory } from '@/lib/categories'
import { relativeTimeKo } from '@/lib/datetime'
import { useMeta } from '@/lib/useMeta'
import { type TreeStage } from '@/lib/tree'
import { useToastStore } from '@/stores'

export function ArticleDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>()

  const articleQuery = useArticleBySlug(slug)
  const article = articleQuery.data

  useMeta({
    title: article?.title,
    description: article?.summary,
    ogImage: article?.thumbnailUrl || undefined,
  })
  const cat = category ? findCategory(category) : undefined

  const relatedQuery = useArticlesByCategory(article?.category)
  const related = useMemo(
    () =>
      (relatedQuery.data?.items ?? [])
        .filter((a) => a.id !== article?.id)
        .slice(0, 3),
    [relatedQuery.data, article?.id],
  )

  const startMutation = useStartReadingSession()
  const completeMutation = useCompleteReadingSession()

  const [sessionId, setSessionId] = useState<string | null>(null)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null)
  const [newStage, setNewStage] = useState<TreeStage | null>(null)

  const contentRef = useRef<HTMLDivElement>(null)

  const articleId = article?.id
  useEffect(() => {
    if (!articleId || sessionId) return
    startMutation.mutate(articleId, {
      onSuccess: (result) => {
        setSessionId(result.sessionId)
        setAlreadyCompleted(result.alreadyCompleted)
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId])

  const validator = useReadingValidator({
    articleId: articleId ?? '',
    contentRef,
    scrollThreshold: 0.9,
    dwellThresholdSec: 30,
    alreadyCompleted,
    onComplete: () => {
      if (!sessionId) return
      completeMutation.mutate(
        {
          sessionId,
          maxScrollPct: validator.progress,
          dwellSeconds: validator.dwellSeconds,
        },
        {
          onSuccess: (result) => {
            if (result.completed) {
              setPointsAwarded(result.pointsAwarded)
              if (result.stageChanged) setNewStage(result.toStage)
              useToastStore.getState().show(
                `기사 한 편 읽었어요. +${result.pointsAwarded}P`,
                { icon: '🍃' },
              )
              // Quest reward toasts (살짝 지연시켜 stack)
              ;(result.questRewards ?? []).forEach((qr, i) => {
                setTimeout(
                  () => {
                    useToastStore.getState().show(
                      `🎯 ${qr.questTitle} 완료! +${qr.rewardPoints}P`,
                      { icon: '🎯' },
                    )
                  },
                  600 + i * 600,
                )
              })
              // Streak milestone 축하
              if (result.streakMilestone) {
                const m = result.streakMilestone
                const msg =
                  m === 7
                    ? '🔥 일주일 streak 달성!'
                    : m === 30
                      ? '🌳 한 달 streak! 대단해요'
                      : m === 100
                        ? '🏆 100일 streak! 전설이에요'
                        : `🌌 ${m}일 streak! 진짜 레전드`
                const delay =
                  600 + (result.questRewards?.length ?? 0) * 600 + 200
                setTimeout(
                  () => useToastStore.getState().show(msg, { icon: '🔥' }),
                  delay,
                )
              }
            } else if (result.reason === 'already_completed_recently') {
              setAlreadyCompleted(true)
            }
          },
          onError: () => {
            useToastStore
              .getState()
              .show('잠시 문제가 있었어요. 다시 시도해볼까요?', { icon: '🍂' })
          },
        },
      )
    },
  })

  const paragraphs = useMemo(() => {
    if (!article?.body) return [] as string[]
    return article.body
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean)
  }, [article])

  if (articleQuery.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }

  if (!article || !cat || articleQuery.isError) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-12 text-center">
        <span className="text-5xl" aria-hidden>
          🍂
        </span>
        <h1 className="text-xl font-bold">기사를 찾을 수 없어요</h1>
        <p className="text-sm text-fg-muted">URL을 확인해주세요.</p>
        <Link to="/articles">
          <Button>카테고리로 가기</Button>
        </Link>
      </div>
    )
  }

  const isCompletedThisSession =
    validator.isCompleted && pointsAwarded !== null
  const showProgressNotice =
    !validator.alreadyCompleted && !isCompletedThisSession

  return (
    <>
      <ReadingProgressBar
        progress={validator.progress}
        isVisible={validator.isVisible}
        isCompleted={isCompletedThisSession}
      />

      <article className="mx-auto max-w-2xl px-4 py-6 desktop:py-10">
        <nav aria-label="breadcrumb" className="mb-4 text-xs text-fg-muted">
          <Link to="/articles" className="hover:underline">
            Articles
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <Link
            to={`/articles/${article.category}`}
            className="hover:underline"
          >
            {cat.displayName}
          </Link>
        </nav>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary">
              {cat.displayName}
            </span>
            <span className="inline-block rounded-full bg-secondary/30 px-2 py-0.5 text-xs font-semibold text-primary">
              AI 요약
            </span>
          </div>
          <h1 className="text-2xl font-bold leading-snug desktop:text-3xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-faint">
            <span className="numeric">⏱ {article.estimatedReadMinutes}분</span>
            <span aria-hidden>·</span>
            <span>{relativeTimeKo(article.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{article.source === 'segye' ? '세계일보' : '연합뉴스'}</span>
          </div>
        </header>

        {article.thumbnailUrl && (
          <div className="my-6 overflow-hidden rounded-lg bg-muted">
            <img
              src={article.thumbnailUrl}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.parentElement?.remove()
              }}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}

        <div
          ref={contentRef}
          className="space-y-5 text-base leading-[1.75] text-foreground desktop:text-lg"
        >
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <Card variant="flat" padding="lg" className="bg-primary-50">
              <div className="space-y-3 text-center">
                <span className="text-3xl" aria-hidden>🌿</span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-primary">
                    이 기사는 뉴스 요약본이에요
                  </p>
                  <p className="text-xs text-fg-muted">
                    요약을 읽으셨나요? 30초를 채우면 +10P가 적립돼요.
                  </p>
                </div>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-md border border-primary px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    전체 기사 원문 읽기 →
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>

        {showProgressNotice && (
          <Card variant="flat" padding="md" className="mt-8">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-foreground">
                  차분히 읽고 계세요
                </p>
                <p className="mt-1 text-xs text-fg-muted">
                  90% 스크롤 + 30초 머무르면 +10P를 받아요.
                  {!validator.isVisible &&
                    ' (지금은 탭이 가려져 있어 잠시 대기 중)'}
                </p>
              </div>

              <ProgressRow
                icon="📜"
                label="스크롤"
                currentLabel={`${Math.round(validator.progress * 100)}%`}
                targetLabel="90%"
                ratio={Math.min(1, validator.progress / 0.9)}
              />

              <ProgressRow
                icon="⏱"
                label="시간"
                currentLabel={`${validator.dwellSeconds}s`}
                targetLabel="30s"
                ratio={Math.min(1, validator.dwellMs / 30000)}
                paused={!validator.isVisible}
              />
            </div>
          </Card>
        )}

        {article.sourceUrl && (
          <Card variant="flat" padding="md" className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-fg-muted">
                세계일보 원문에서 전체 기사를 읽을 수 있어요.
              </p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                원문 보기 →
              </a>
            </div>
          </Card>
        )}

        {validator.alreadyCompleted && (
          <Card variant="flat" padding="md" className="mt-4 bg-primary-50">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>🌿</span>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-primary">이미 읽으셨어요</p>
                <p className="text-xs text-fg-muted">
                  동일 기사는 24시간 내 한 번만 +10P 적립돼요. 다시 읽으셔도 좋아요.
                </p>
              </div>
            </div>
          </Card>
        )}

        {isCompletedThisSession && pointsAwarded !== null && (
          <CompletionFeedback
            pointsAwarded={pointsAwarded}
            newStage={newStage}
          />
        )}

        {validator.isSuspicious && !validator.alreadyCompleted && (
          <Card variant="flat" padding="sm" className="mt-3 bg-accent-100">
            <p className="text-xs text-foreground">
              ⚠ 비정상적인 스크롤 패턴이 감지됐어요. 차분히 다시 읽어주세요.
            </p>
          </Card>
        )}

        {related.length > 0 && (
          <section className="mt-12 space-y-3 border-t pt-8">
            <h2 className="text-base font-semibold">
              같은 카테고리의 다른 기사
            </h2>
            <div className="grid gap-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} variant="compact" />
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          <Link to={`/articles/${article.category}`}>
            <Button variant="ghost" size="sm">
              ← {cat.displayName} 카테고리
            </Button>
          </Link>
          <Link to="/home">
            <Button variant="secondary" size="sm">
              홈으로
            </Button>
          </Link>
        </div>
      </article>
    </>
  )
}

function ProgressRow({
  icon,
  label,
  currentLabel,
  targetLabel,
  ratio,
  paused = false,
}: {
  icon: string
  label: string
  currentLabel: string
  targetLabel: string
  ratio: number
  paused?: boolean
}) {
  const pct = Math.round(ratio * 100)
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          <span aria-hidden>{icon}</span>
          <span className="text-fg-muted">{label}</span>
        </span>
        <span className="numeric text-fg-muted">
          <span className="font-semibold text-foreground">{currentLabel}</span>
          <span className="mx-1">/</span>
          <span>{targetLabel}</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} 진행률 ${pct}%`}
        className={
          'h-1.5 w-full overflow-hidden rounded-full bg-primary-100 transition-opacity ' +
          (paused ? 'opacity-50' : 'opacity-100')
        }
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-linear"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
