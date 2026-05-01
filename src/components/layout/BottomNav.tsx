import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Icon } from '@/components/ui'
import type { PixelIconName } from '@/components/ui'

interface BottomTab {
  to: string
  prefix: string
  iconName: PixelIconName
  emoji: string
  label: string
}

const TABS: BottomTab[] = [
  { to: '/home', prefix: '/home', iconName: 'sprout', emoji: '🌱', label: 'Home' },
  {
    to: '/forest/me',
    prefix: '/forest',
    iconName: 'tree',
    emoji: '🌳',
    label: 'Forest',
  },
  {
    to: '/dashboard',
    prefix: '/dashboard',
    iconName: 'chart',
    emoji: '📊',
    label: 'Dashboard',
  },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const isActive = (prefix: string) =>
    pathname === prefix || pathname.startsWith(prefix + '/')

  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl desktop:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-xl">
        {TABS.map((tab) => {
          const active = isActive(tab.prefix)
          return (
            <li key={tab.to} className="flex-1">
              <Link
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                  active
                    ? 'font-semibold text-primary'
                    : 'text-fg-muted hover:text-foreground',
                )}
              >
                <Icon
                  name={tab.iconName}
                  emoji={tab.emoji}
                  className="h-5 w-5 text-lg leading-none"
                />
                <span>{tab.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
