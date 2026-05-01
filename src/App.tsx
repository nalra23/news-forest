import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from '@/components/ui'
import { AppLayout, MinimalLayout } from '@/components/layout'
import { OnboardingLayout } from '@/components/onboarding'
import { useAnonymousId } from '@/hooks/useAnonymousId'
import { useThemeStore } from '@/stores'

import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OnboardingWelcomePage } from '@/pages/onboarding/OnboardingWelcomePage'
import { OnboardingConceptPage } from '@/pages/onboarding/OnboardingConceptPage'
import { OnboardingCategoriesPage } from '@/pages/onboarding/OnboardingCategoriesPage'
import { HomePage } from '@/pages/HomePage'
import { ArticleIndexPage } from '@/pages/articles/ArticleIndexPage'
import { CategoryPage } from '@/pages/articles/CategoryPage'
import { ArticleDetailPage } from '@/pages/articles/ArticleDetailPage'
import { MyForestPage } from '@/pages/forest/MyForestPage'
import { ForestExplorePage } from '@/pages/forest/ForestExplorePage'
import { UserForestPage } from '@/pages/forest/UserForestPage'
import { NearbyMapPage } from '@/pages/forest/NearbyMapPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { QuestsPage } from '@/pages/QuestsPage'
import { RankingPage } from '@/pages/RankingPage'
import { ComponentGallery } from '@/pages/dev/ComponentGallery'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function App() {
  useAnonymousId()
  const themeMode = useThemeStore((s) => s.mode)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('theme-pixel', 'theme-dark')
    if (themeMode === 'pixel') root.classList.add('theme-pixel')
    if (themeMode === 'dark') root.classList.add('theme-dark')
  }, [themeMode])

  return (
    <>
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        본문으로 건너뛰기
      </a>
      <Routes>
        {/* Minimal layout: Landing */}
        <Route element={<MinimalLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Onboarding flow with shared progress dots */}
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<Navigate to="/onboarding/welcome" replace />} />
          <Route path="welcome" element={<OnboardingWelcomePage />} />
          <Route path="concept" element={<OnboardingConceptPage />} />
          <Route path="categories" element={<OnboardingCategoriesPage />} />
        </Route>

        {/* App layout: 인증된 페이지 (실제로는 익명 ID) */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/articles" element={<ArticleIndexPage />} />
          <Route path="/articles/:category" element={<CategoryPage />} />
          <Route path="/articles/:category/:slug" element={<ArticleDetailPage />} />
          <Route path="/forest" element={<Navigate to="/forest/me" replace />} />
          <Route path="/forest/me" element={<MyForestPage />} />
          <Route path="/forest/explore" element={<ForestExplorePage />} />
          <Route path="/forest/map" element={<NearbyMapPage />} />
          <Route path="/forest/u/:publicId" element={<UserForestPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        {/* Dev (no layout) */}
        <Route path="/dev/gallery" element={<ComponentGallery />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
