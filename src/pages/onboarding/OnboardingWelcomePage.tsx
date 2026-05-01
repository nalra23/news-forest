import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export function OnboardingWelcomePage() {
  return (
    <div className="space-y-8 text-center">
      <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary-100">
        <span className="text-6xl" aria-hidden>
          🌱
        </span>
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold leading-tight desktop:text-3xl">
          당신의 뉴스 습관,
          <br />
          숲이 됩니다.
        </h1>
        <p className="text-sm leading-relaxed text-fg-muted">
          이 앱은 뉴스를 한 편 읽을 때마다,
          <br />
          작은 씨앗에서 시작해 큰 숲으로 자라나요.
        </p>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <Link to="/onboarding/concept">
          <Button size="lg" className="w-full">
            다음
          </Button>
        </Link>
        <Link to="/home">
          <Button size="md" variant="ghost" className="w-full">
            건너뛰기
          </Button>
        </Link>
      </div>
    </div>
  )
}
