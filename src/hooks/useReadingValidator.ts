import { useEffect, useRef, useState, type RefObject } from 'react'

export interface UseReadingValidatorOptions {
  articleId: string
  contentRef: RefObject<HTMLElement | null>
  /** Default 0.9 per CLAUDE.md §2 BR-01 */
  scrollThreshold?: number
  /** Default 30 per CLAUDE.md §2 BR-01 */
  dwellThresholdSec?: number
  /** BE 의 24h 중복 완독 체크 결과 (POST /api/reading-sessions 응답). true 면 추적 비활성. */
  alreadyCompleted?: boolean
  onComplete?: () => void
}

export interface ReadingValidatorState {
  /** 0~1, monotonic — 한 번 도달한 최대값을 유지 */
  progress: number
  /** Page Visibility API 기준 누적 visible 초 (정수, 라벨용) */
  dwellSeconds: number
  /** 누적 ms — 부드러운 progress bar 용 */
  dwellMs: number
  /** 현재 탭이 visible 인지 */
  isVisible: boolean
  /** 이번 세션에서 완독 trigger 발생했는지 */
  isCompleted: boolean
  /** BE에서 24h 내 이미 완독한 기사로 알림받음 (UC-05 BR-05) */
  alreadyCompleted: boolean
  /** UC-05 §8.6 — scroll step jump 등 의심 신호 감지 시 true */
  isSuspicious: boolean
}

const TICK_MS = 250
const SUSPICIOUS_JUMP_DELTA = 0.6

/**
 * UC-04 + UC-05 클라이언트 측 추적.
 * - Scroll ≥ scrollThreshold AND Dwell ≥ dwellThresholdSec → onComplete 1회 호출
 * - Page Visibility = hidden 시 dwell timer 정지 (BR-06)
 * - alreadyCompleted=true 면 트래킹 비활성 (BE 가 24h 중복 판단)
 * - Anti-fraud: scroll step jump > 0.6 감지 시 isSuspicious 마킹 (UC-05 §8.6)
 */
export function useReadingValidator({
  articleId,
  contentRef,
  scrollThreshold = 0.9,
  dwellThresholdSec = 30,
  alreadyCompleted = false,
  onComplete,
}: UseReadingValidatorOptions): ReadingValidatorState {
  const initialVisible =
    typeof document !== 'undefined' &&
    document.visibilityState === 'visible'

  const [state, setState] = useState<ReadingValidatorState>(() => ({
    progress: 0,
    dwellSeconds: 0,
    dwellMs: 0,
    isVisible: initialVisible,
    isCompleted: false,
    alreadyCompleted,
    isSuspicious: false,
  }))

  const lastProgressRef = useRef<number>(0)
  const dwellMsRef = useRef<number>(0)
  const visibleSinceRef = useRef<number | null>(
    initialVisible ? Date.now() : null,
  )
  const completedFiredRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // alreadyCompleted prop sync
  useEffect(() => {
    setState((s) =>
      s.alreadyCompleted === alreadyCompleted ? s : { ...s, alreadyCompleted },
    )
  }, [alreadyCompleted])

  // Reset on article change
  useEffect(() => {
    lastProgressRef.current = 0
    dwellMsRef.current = 0
    visibleSinceRef.current =
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible'
        ? Date.now()
        : null
    completedFiredRef.current = false
    setState({
      progress: 0,
      dwellSeconds: 0,
      dwellMs: 0,
      isVisible:
        typeof document !== 'undefined' &&
        document.visibilityState === 'visible',
      isCompleted: false,
      alreadyCompleted,
      isSuspicious: false,
    })
  }, [articleId, alreadyCompleted])

  // Page Visibility + dwell tick
  useEffect(() => {
    if (!articleId || state.alreadyCompleted) return

    const handleVisibility = () => {
      const visible = document.visibilityState === 'visible'
      if (visible) {
        if (visibleSinceRef.current === null) {
          visibleSinceRef.current = Date.now()
        }
      } else {
        if (visibleSinceRef.current !== null) {
          dwellMsRef.current += Date.now() - visibleSinceRef.current
          visibleSinceRef.current = null
        }
      }
      setState((s) =>
        s.isVisible === visible ? s : { ...s, isVisible: visible },
      )
    }

    document.addEventListener('visibilitychange', handleVisibility)

    const tickId = window.setInterval(() => {
      const totalMs =
        dwellMsRef.current +
        (visibleSinceRef.current !== null
          ? Date.now() - visibleSinceRef.current
          : 0)
      const totalSec = Math.floor(totalMs / 1000)
      setState((s) =>
        s.dwellMs === totalMs && s.dwellSeconds === totalSec
          ? s
          : { ...s, dwellMs: totalMs, dwellSeconds: totalSec },
      )
    }, TICK_MS)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.clearInterval(tickId)
      if (visibleSinceRef.current !== null) {
        dwellMsRef.current += Date.now() - visibleSinceRef.current
        visibleSinceRef.current = null
      }
    }
  }, [articleId, state.alreadyCompleted])

  // Scroll progress
  useEffect(() => {
    if (!articleId || state.alreadyCompleted) return

    let rafScheduled = false

    const updateProgress = () => {
      rafScheduled = false
      const el = contentRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const elHeight = rect.height
      if (elHeight <= 0) return

      const viewportHeight = window.innerHeight
      const raw = (viewportHeight - rect.top) / elHeight
      const clamped = Math.max(0, Math.min(1, raw))

      const prev = lastProgressRef.current
      if (clamped - prev > SUSPICIOUS_JUMP_DELTA) {
        setState((s) => (s.isSuspicious ? s : { ...s, isSuspicious: true }))
      }
      lastProgressRef.current = clamped

      setState((s) => {
        const next = Math.max(s.progress, clamped)
        if (next === s.progress) return s
        return { ...s, progress: next }
      })
    }

    const onScroll = () => {
      if (!rafScheduled) {
        rafScheduled = true
        requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [articleId, state.alreadyCompleted, contentRef])

  // Completion trigger (1회만, 부모가 BE complete API 호출)
  useEffect(() => {
    if (!articleId || completedFiredRef.current || state.alreadyCompleted)
      return
    if (
      state.progress >= scrollThreshold &&
      state.dwellSeconds >= dwellThresholdSec
    ) {
      completedFiredRef.current = true
      setState((s) => ({ ...s, isCompleted: true }))
      onCompleteRef.current?.()
    }
  }, [
    articleId,
    state.progress,
    state.dwellSeconds,
    state.alreadyCompleted,
    scrollThreshold,
    dwellThresholdSec,
  ])

  return state
}
