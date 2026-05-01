import { Outlet, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

function getStep(pathname: string): 1 | 2 | 3 {
  if (pathname.endsWith('/welcome')) return 1
  if (pathname.endsWith('/concept')) return 2
  if (pathname.endsWith('/categories')) return 3
  return 1
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="mx-auto flex items-center gap-1.5"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`온보딩 진행률 ${current} / ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1
        const active = idx === current
        const done = idx < current
        return (
          <span
            key={idx}
            aria-hidden
            className={clsx(
              'h-2 rounded-full transition-all',
              active ? 'w-6 bg-primary' : done ? 'w-2 bg-primary' : 'w-2 bg-border-strong',
            )}
          />
        )
      })}
    </div>
  )
}

export function OnboardingLayout() {
  const { pathname } = useLocation()
  const step = getStep(pathname)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex shrink-0 items-center justify-center pt-6 desktop:pt-8">
        <ProgressDots current={step} total={3} />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-6 desktop:py-10">
        <div key={pathname} className="w-full max-w-md animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
