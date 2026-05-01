import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Icon } from '@/components/ui'
import type { PixelIconName } from '@/components/ui'

interface SidebarItem {
  to: string
  match: (pathname: string) => boolean
  iconName: PixelIconName
  emoji: string
  label: string
}

const ITEMS: SidebarItem[] = [
  {
    to: '/home',
    match: (p) => p === '/home' || p.startsWith('/home/'),
    iconName: 'sprout',
    emoji: '🌱',
    label: 'Home',
  },
  {
    to: '/articles',
    match: (p) => p === '/articles' || p.startsWith('/articles/'),
    iconName: 'news',
    emoji: '📰',
    label: 'Articles',
  },
  {
    to: '/forest/me',
    match: (p) =>
      p === '/forest' ||
      p === '/forest/me' ||
      p.startsWith('/forest/me/') ||
      p.startsWith('/forest/explore') ||
      p.startsWith('/forest/u/'),
    iconName: 'tree',
    emoji: '🌳',
    label: 'Forest',
  },
  {
    to: '/forest/map',
    match: (p) => p.startsWith('/forest/map'),
    iconName: 'map',
    emoji: '🗺️',
    label: 'Nearby',
  },
  {
    to: '/quests',
    match: (p) => p.startsWith('/quests'),
    iconName: 'sparkle',
    emoji: '🎯',
    label: 'Quests',
  },
  {
    to: '/ranking',
    match: (p) => p.startsWith('/ranking'),
    iconName: 'flame',
    emoji: '🏆',
    label: 'Ranking',
  },
  {
    to: '/dashboard',
    match: (p) => p.startsWith('/dashboard'),
    iconName: 'chart',
    emoji: '📊',
    label: 'Dashboard',
  },
  {
    to: '/settings',
    match: (p) => p.startsWith('/settings'),
    iconName: 'gear',
    emoji: '⚙️',
    label: 'Settings',
  },
]

export function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside
      aria-label="사이드 메뉴"
      className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 border-r border-border/60 bg-surface/60 backdrop-blur desktop:block"
    >
      <nav className="p-3">
        <ul className="space-y-1">
          {ITEMS.map((it) => {
            const active = it.match(pathname)
            return (
              <li key={it.to}>
                <Link
                  to={it.to}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    active
                      ? 'bg-primary-50 font-semibold text-primary'
                      : 'text-fg-muted hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon
                    name={it.iconName}
                    emoji={it.emoji}
                    className="h-4 w-4 text-base leading-none"
                  />
                  <span>{it.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
