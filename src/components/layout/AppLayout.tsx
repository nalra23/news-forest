import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <Topbar />
      <div className="desktop:flex">
        <Sidebar />
        <main
          id="main-content"
          className="min-h-[calc(100dvh-3.5rem)] flex-1 pb-20 desktop:min-h-[calc(100dvh-4rem)] desktop:pb-0"
        >
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
