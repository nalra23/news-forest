import { Link } from 'react-router-dom'
import { Icon, PointBadge } from '@/components/ui'
import { useUserStore } from '@/stores'

export function Topbar() {
  const totalPoints = useUserStore((s) => s.user?.totalPoints ?? 0)
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 desktop:h-16 desktop:px-6">
        <Link
          to="/home"
          className="flex items-center gap-2 rounded text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="News Forest 홈"
        >
          <Icon name="sprout" emoji="🌱" className="h-5 w-5 text-base" />
          <span>News Forest</span>
        </Link>
        <div className="flex items-center gap-2 desktop:gap-3">
          <Link
            to="/dashboard"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="대시보드로 이동"
          >
            <PointBadge value={totalPoints} />
          </Link>
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary tablet:inline-flex"
            aria-label="알림 (예정)"
          >
            <Icon name="bell" emoji="🔔" className="h-5 w-5 text-base" />
          </button>
        </div>
      </div>
    </header>
  )
}
