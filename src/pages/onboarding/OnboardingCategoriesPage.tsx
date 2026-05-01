import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, CategoryChip } from '@/components/ui'
import { CATEGORIES } from '@/lib/categories'
import { useUpdatePreferences } from '@/hooks/queries'

export function OnboardingCategoriesPage() {
  const navigate = useNavigate()
  const updatePrefs = useUpdatePreferences()
  const [selected, setSelected] = useState<string[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const toggle = (code: string) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    )
  }

  const canProceed = selected.length >= 1

  const handleStart = async () => {
    if (!canProceed || updatePrefs.isPending) return
    setErrorMsg(null)
    try {
      await updatePrefs.mutateAsync(selected)
      navigate('/home', { replace: true })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '저장에 실패했어요. 다시 시도해주세요.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold desktop:text-3xl">
          관심 카테고리를 골라주세요
        </h1>
        <p className="text-sm leading-relaxed text-fg-muted">
          최소 1개 이상 선택해주세요.
          <br />
          나중에 설정에서 언제든 바꿀 수 있어요.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.code}
            emoji={c.emoji}
            selected={selected.includes(c.code)}
            onClick={() => toggle(c.code)}
          >
            {c.displayName}
          </CategoryChip>
        ))}
      </div>

      <p className="text-center text-xs text-fg-muted" aria-live="polite">
        {selected.length === 0
          ? '아직 선택된 카테고리가 없어요'
          : `${selected.length}개 카테고리 선택됨`}
      </p>

      {errorMsg && (
        <p className="text-center text-xs text-error" role="alert">
          {errorMsg}
        </p>
      )}

      <div className="flex gap-2">
        <Link to="/onboarding/concept" className="flex-1">
          <Button variant="ghost" className="w-full">
            이전
          </Button>
        </Link>
        <Button
          className="flex-1"
          disabled={!canProceed || updatePrefs.isPending}
          loading={updatePrefs.isPending}
          onClick={() => { void handleStart() }}
        >
          시작하기
        </Button>
      </div>
    </div>
  )
}
