import { Outlet } from 'react-router-dom'

export function MinimalLayout() {
  return (
    <main className="min-h-dvh bg-background" id="main-content">
      <Outlet />
    </main>
  )
}
