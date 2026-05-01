import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'

const FLOW = [
  { icon: '📰', label: '기사 읽기' },
  { icon: '✓', label: '90% + 30초' },
  { icon: '🌱', label: '+10P 성장' },
] as const

export function OnboardingConceptPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold desktop:text-3xl">
          기사 한 편 = 나무 한 단계
        </h1>
        <p className="text-sm leading-relaxed text-fg-muted">
          광고 없이 차분히 읽고,
          <br />
          90% 스크롤 + 30초 머무르면 완독으로 인정해요.
        </p>
      </div>

      <Card variant="flat" padding="lg">
        <ol className="flex items-center justify-between gap-2">
          {FLOW.map((step, i) => (
            <li key={step.label} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col items-center gap-1.5 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-xl">
                  <span aria-hidden>{step.icon}</span>
                </div>
                <span className="text-xs text-fg-muted">{step.label}</span>
              </div>
              {i < FLOW.length - 1 && (
                <span aria-hidden className="text-fg-faint">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </Card>

      <div className="space-y-2 rounded-lg bg-primary-50 p-4 text-sm text-foreground">
        <p className="font-medium text-primary">🌳 차분한 보상</p>
        <p className="text-fg-muted">
          폭죽이나 진동 없이, 잎사귀가 부드럽게 피어나는 정도의 작은 변화로 응원해요.
        </p>
      </div>

      <div className="flex gap-2">
        <Link to="/onboarding/welcome" className="flex-1">
          <Button variant="ghost" className="w-full">
            이전
          </Button>
        </Link>
        <Link to="/onboarding/categories" className="flex-1">
          <Button className="w-full">다음</Button>
        </Link>
      </div>
    </div>
  )
}
