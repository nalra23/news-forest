import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { TreeArt } from '@/components/tree'
import { TREE_STAGE_DISPLAY, type TreeStage } from '@/lib/tree'

const HERO_STAGES: TreeStage[] = ['SEED', 'SPROUT', 'TREE', 'FOREST']
const HERO_INTERVAL_MS = 1800

function HeroTreeCycle() {
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const id = window.setInterval(() => {
      setStageIdx((i) => (i + 1) % HERO_STAGES.length)
    }, HERO_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  const stage = HERO_STAGES[stageIdx]
  const transitionAnim =
    stage === 'FOREST'
      ? 'animate-stage-transition-lg'
      : 'animate-stage-transition'
  const stageName = TREE_STAGE_DISPLAY[stage]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 via-surface to-secondary/40 shadow-soft desktop:h-28 desktop:w-28">
        <div
          key={stage}
          className={`h-3/4 w-3/4 text-primary ${transitionAnim}`}
        >
          <TreeArt
            stage={stage}
            className="h-full w-full"
            title={`${stageName} 단계`}
          />
        </div>
      </div>
      <p
        key={`label-${stage}`}
        className="animate-fade-in text-xs font-semibold uppercase tracking-[0.18em] text-primary"
      >
        {stageName}
      </p>
    </div>
  )
}

function IconRead() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
      <path d="M4 19V5a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v13" />
      <path d="M4 19a2 2 0 0 0 2 2h14" />
      <path d="M4 19a2 2 0 0 1 2-2h14" />
      <path d="M9 7h6M9 11h4" />
    </svg>
  )
}

function IconVerify() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v4.5l2.5 2.5" />
      <path d="M7.5 17.5 C9 15.5 11 15 12 15 C13 15 15 15.5 16.5 17.5" />
    </svg>
  )
}

function IconGrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden>
      <path d="M12 22V13" />
      <path d="M12 13C12 13 8.5 11.5 6 7.5 9 6.5 12 9 12 13Z" />
      <path d="M12 17C12 17 15.5 15.5 18 11.5 15 10.5 12 13 12 17Z" />
    </svg>
  )
}

const STEPS = [
  {
    Icon: IconRead,
    title: '읽어요',
    desc: '마음에 드는 기사를 차분히 읽어요. 광고 없이.',
  },
  {
    Icon: IconVerify,
    title: '검증해요',
    desc: '90% 스크롤 + 30초 머무르면 완독으로 인정해요.',
  },
  {
    Icon: IconGrow,
    title: '자라나요',
    desc: '한 편마다 +10P. 씨앗 → 새싹 → 나무 → 숲으로 성장해요.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-dvh px-4 py-10 desktop:py-16">
      <div className="mx-auto max-w-5xl space-y-12 desktop:space-y-16">
        {/* Hero */}
        <section className="space-y-7 text-center animate-fade-in">
          <HeroTreeCycle />
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight desktop:text-6xl">
              뉴스를 한 편 읽을 때마다,
              <br />
              <span className="text-primary">나무 한 그루가 자라요.</span>
            </h1>
            <p className="mx-auto max-w-md text-base text-fg-muted desktop:text-lg">
              뉴스를 잘 읽지 않는 분도 부담 없이 시작할 수 있는,
              <br className="hidden tablet:inline" /> 게이미피케이션 기반 뉴스 플랫폼이에요.
            </p>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-2">
            <Link to="/onboarding/welcome">
              <Button size="lg" className="w-full">
                지금 시작하기
              </Button>
            </Link>
            <Link to="/home">
              <Button size="md" variant="ghost" className="w-full">
                둘러보기
              </Button>
            </Link>
          </div>
          <p className="text-xs text-fg-faint">로그인 없이 익명으로 사용해요</p>
        </section>

        {/* How it works */}
        <section className="space-y-6">
          <h2 className="text-center text-2xl font-bold tracking-tight desktop:text-3xl">
            어떻게 동작하나요?
          </h2>
          <div className="grid gap-4 desktop:grid-cols-3">
            {STEPS.map((s) => (
              <Card key={s.title} variant="soft" padding="lg">
                <div className="flex items-start gap-4 desktop:flex-col desktop:items-center desktop:text-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary/40 text-primary">
                    <s.Icon />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <p className="text-sm text-fg-muted">{s.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer link */}
        <footer className="space-y-1 text-center">
          <p className="text-xs text-fg-faint">
            <Link to="/privacy" className="hover:text-fg-muted underline underline-offset-2">
              개인정보처리방침
            </Link>
          </p>
          <p className="text-xs text-fg-faint">
            <Link to="/dev/gallery" className="hover:text-fg-muted underline underline-offset-2">
              Component Gallery
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}
