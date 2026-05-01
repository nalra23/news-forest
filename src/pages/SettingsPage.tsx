import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, ConfirmDialog } from '@/components/ui'
import { CATEGORIES } from '@/lib/categories'
import { clearAllNamespaced } from '@/lib/storage'
import { useThemeStore, useToastStore, useUserStore } from '@/stores'
import { useDeleteAccount } from '@/hooks/queries'

export function SettingsPage() {
  const navigate = useNavigate()
  const user = useUserStore((s) => s.user)
  const clearSession = useUserStore((s) => s.clearSession)
  const themeMode = useThemeStore((s) => s.mode)
  const setThemeMode = useThemeStore((s) => s.setMode)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteAccount = useDeleteAccount()

  const handleReset = async () => {
    setConfirmOpen(false)
    try {
      await deleteAccount.mutateAsync()
      clearAllNamespaced()
      clearSession()
      useToastStore.getState().show('모든 데이터가 삭제됐어요', { icon: '🍃' })
      navigate('/', { replace: true })
    } catch {
      useToastStore.getState().show('삭제 중 문제가 있었어요. 잠시 후 다시 시도해 주세요.', { icon: '🍂' })
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 desktop:py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold desktop:text-3xl">설정</h1>
        {user && (
          <p className="text-sm text-fg-muted">
            <span className="font-medium">{user.nickname}</span>
            <span className="mx-1.5" aria-hidden>
              ·
            </span>
            <span className="text-xs text-fg-faint">
              ID:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5">
                {user.publicId.slice(0, 8)}…
              </code>
            </span>
          </p>
        )}
      </header>

      <Section title="관심 카테고리">
        <Card variant="flat" padding="md">
          {user && user.preferredCategories.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">현재 선택된 카테고리</p>
                <p className="text-xs text-fg-muted">
                  {user.preferredCategories.length}개 선택됨 · 추천 피드는 이
                  카테고리 기준으로 구성돼요.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pb-1">
                {user.preferredCategories.map((code) => {
                  const cat = CATEGORIES.find((c) => c.code === code)
                  if (!cat) return null
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary"
                    >
                      <span aria-hidden>{cat.emoji}</span>
                      {cat.displayName}
                    </span>
                  )
                })}
              </div>
              <div className="pt-1">
                <Link to="/onboarding/categories">
                  <Button variant="secondary" size="sm">
                    카테고리 변경
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">관심 카테고리 미설정</p>
                <p className="text-xs text-fg-muted">
                  관심 카테고리를 골라주시면 당신을 위한 추천이 시작돼요.
                </p>
              </div>
              <div className="pt-1">
                <Link to="/onboarding/categories">
                  <Button size="sm">설정하기</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </Section>

      <Section title="테마">
        <Card variant="flat" padding="md">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">전체 테마</p>
              <p className="text-xs text-fg-muted">
                Easter egg! TreeArt · 폰트 · 모서리 · 그림자 · 아이콘 톤이 함께 변해요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                variant={themeMode === 'default' ? 'primary' : 'secondary'}
                onClick={() => setThemeMode('default')}
              >
                🌳 Default
              </Button>
              <Button
                size="sm"
                variant={themeMode === 'dark' ? 'primary' : 'secondary'}
                onClick={() => setThemeMode('dark')}
              >
                🌙 Dark
              </Button>
              <Button
                size="sm"
                variant={themeMode === 'pixel' ? 'primary' : 'secondary'}
                onClick={() => setThemeMode('pixel')}
              >
                ⛏️ Minecraft
              </Button>
            </div>
            {themeMode === 'dark' && (
              <p className="text-xs text-primary">
                🌙 Dark 모드: long-form 가독성 최적화. 본문 ·UI 모두 darken
              </p>
            )}
            {themeMode === 'pixel' && (
              <p className="text-xs text-primary">
                🎮 Minecraft 모드: 픽셀 폰트 · 픽셀 아이콘 · 하드 그림자 · step 모션
              </p>
            )}
          </div>
        </Card>
      </Section>

      <Section title="알림">
        <Card variant="flat" padding="md">
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden>
              🔔
            </span>
            <div className="space-y-1">
              <p className="text-sm font-medium">푸시 알림</p>
              <p className="text-xs text-fg-muted">
                연속 읽기 격려, 다른 사용자의 watering 알림 등은 Phase 2에서
                제공돼요.
              </p>
            </div>
          </div>
        </Card>
      </Section>

      <Section title="데이터 관리">
        <Card variant="flat" padding="md">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">모든 데이터 초기화</p>
              <p className="text-xs text-fg-muted">
                내 나무 · 누적 포인트 · 완독 기록 · 카테고리 설정 등 이 기기에 저장된
                모든 데이터를 지워요. 다시 시작할 수 있어요.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              데이터 초기화
            </Button>
          </div>
        </Card>
      </Section>

      <Section title="정보">
        <Card variant="flat" padding="md">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-fg-muted">버전</span>
              <span className="numeric font-medium">0.1.0 (MVP)</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-fg-muted">사용자 식별</span>
              <span className="text-xs text-fg-muted">익명 (device-based)</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-fg-muted">한국 PIPA</span>
              <span className="text-xs text-fg-muted">최소 수집 원칙</span>
            </li>
            <li className="pt-1">
              <Link to="/privacy">
                <Button variant="ghost" size="sm" className="px-0 text-primary underline-offset-2 hover:underline">
                  개인정보처리방침 보기
                </Button>
              </Link>
            </li>
          </ul>
        </Card>
      </Section>

      <div className="flex flex-wrap gap-2 pt-2">
        <Link to="/home">
          <Button variant="ghost" size="sm">
            ← 홈
          </Button>
        </Link>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="정말 모든 데이터를 초기화할까요?"
        description={
          <>
            이 기기뿐 아니라 서버의 내 식별자도 무효화돼요. 활동 기록은 익명화된
            상태로 보존됩니다.
            <br />이 작업은 되돌릴 수 없어요.
          </>
        }
        confirmLabel="초기화"
        cancelLabel="취소"
        variant="danger"
        onConfirm={handleReset}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  )
}
