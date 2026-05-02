import { Link } from 'react-router-dom'
import { TreeArt } from '@/components/tree'
import { type TreeStage } from '@/lib/tree'

/* ── Apple / DESIGN.md 토큰 ─────────────────────────────────────
   SF Pro → Inter fallback
   Colors: Pitch Black #000000, Space Gray #1d1d1f, Cloud White #ffffff,
           Ghost White #f5f5f7, Cool Gray #86868b, Deep Graphite #161617,
           Interactive Blue #0071e3, Vivid Blue #2997ff, Highlight Blue #0066cc
──────────────────────────────────────────────────────────────── */

const STAGES: { stage: TreeStage; label: string; range: string; desc: string }[] = [
  { stage: 'SEED',   label: '씨앗',  range: '0 – 29P',    desc: '첫 기사 한 편을 완독하면\n씨앗이 심어져요' },
  { stage: 'SPROUT', label: '새싹',  range: '30 – 99P',   desc: '꾸준히 읽다 보면\n새싹이 돋아나요' },
  { stage: 'TREE',   label: '나무',  range: '100 – 299P', desc: '습관이 쌓이면\n나무로 성장해요' },
  { stage: 'FOREST', label: '숲',    range: '300P +',      desc: '진정한 독자만이\n숲을 이뤄요' },
]

const STATS = [
  { value: '90%',  label: '완독 스크롤 기준' },
  { value: '30s',  label: '완독 체류 시간' },
  { value: '+10P', label: '완독 1편당 포인트' },
  { value: '+2P',  label: '물주기 보너스' },
]

/* Apple SF Pro 대체 폰트 스택 */
const SF = `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

export function ShowcasePage() {
  return (
    <div style={{ fontFamily: SF }} className="min-h-dvh bg-black text-white antialiased">

      {/* ── Sticky Nav ───────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#000]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[980px] items-center justify-between px-5 py-3">
          <span
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.32px' }}
            className="text-white/90"
          >
            News Forest
          </span>
          <nav className="hidden items-center gap-7 md:flex">
            {['특징', '성장 단계', '숫자로 보기'].map((t) => (
              <button
                key={t}
                style={{ fontSize: 14, fontWeight: 400, letterSpacing: '-0.31px' }}
                className="text-white/70 transition hover:text-white"
              >
                {t}
              </button>
            ))}
          </nav>
          <Link
            to="/onboarding/welcome"
            style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.31px' }}
            className="rounded-full bg-[#0071e3] px-[18px] py-[8px] text-white transition hover:bg-[#0077ed] active:scale-95"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-black px-5 text-center">
        {/* subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(41,151,255,0.12) 0%, transparent 70%)',
          }}
        />

        <p
          style={{ fontSize: 17, fontWeight: 400, letterSpacing: '-0.32px' }}
          className="mb-5 text-[#86868b]"
        >
          게이미피케이션 기반 뉴스 플랫폼
        </p>

        <h1
          style={{
            fontSize: 'clamp(44px, 8vw, 80px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: 'clamp(-0.13px, -0.56vw, -0.45px)',
          }}
          className="mx-auto max-w-[820px] text-white"
        >
          뉴스를 읽으면,
          <br />
          숲이 자란다.
        </h1>

        <p
          style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.2px' }}
          className="mx-auto mt-6 max-w-[480px] text-[#86868b]"
        >
          광고 없이, 부담 없이.
          <br />
          한 편마다 나무 한 그루가 자라요.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/onboarding/welcome"
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.32px' }}
            className="rounded-full bg-[#0071e3] px-8 py-3.5 text-white transition hover:bg-[#0077ed] active:scale-95"
          >
            지금 시작하기
          </Link>
          <Link
            to="/home"
            style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.32px' }}
            className="rounded-full px-8 py-3.5 text-[#2997ff] transition hover:text-white"
          >
            둘러보기 ›
          </Link>
        </div>

        <p
          style={{ fontSize: 12, letterSpacing: '-0.48px' }}
          className="mt-7 text-[#424245]"
        >
          로그인 없이 익명으로 사용해요
        </p>

        {/* Hero tree graphic */}
        <div className="mt-20 flex gap-6">
          {(['SEED', 'SPROUT', 'TREE', 'FOREST'] as TreeStage[]).map((s, i) => (
            <div
              key={s}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d1d1f] text-[#2997ff] opacity-0 animate-[fadeUp_0.6s_ease_forwards]"
              style={{ animationDelay: `${0.1 + i * 0.12}s` }}
            >
              <TreeArt stage={s} className="h-9 w-9" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards (How it works) ─────────────────── */}
      <section className="bg-[#161617] px-5 py-28">
        <div className="mx-auto max-w-[980px]">
          <h2
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.13px' }}
            className="mb-3 text-center text-white"
          >
            어떻게 동작하나요?
          </h2>
          <p
            style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.2px' }}
            className="mb-14 text-center text-[#86868b]"
          >
            세 가지 단계, 아주 간단해요.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: '📖',
                title: '읽어요',
                body: '마음에 드는 기사를 차분히 읽어요. 광고도, 방해도 없이.',
              },
              {
                icon: '✅',
                title: '검증해요',
                body: '90% 스크롤 + 30초 머무르면 완독으로 인정해요.',
              },
              {
                icon: '🌱',
                title: '자라나요',
                body: '한 편마다 +10P. 씨앗 → 새싹 → 나무 → 숲으로 성장해요.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-[28px] bg-[#1d1d1f] p-8"
              >
                <div className="mb-5 text-4xl">{item.icon}</div>
                <h3
                  style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.17, letterSpacing: '-0.14px' }}
                  className="mb-3 text-white"
                >
                  {item.title}
                </h3>
                <p
                  style={{ fontSize: 17, lineHeight: 1.47, letterSpacing: '-0.32px' }}
                  className="text-[#86868b]"
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Growth stages ────────────────────────────────── */}
      <section className="bg-black px-5 py-28">
        <div className="mx-auto max-w-[980px]">
          <p
            style={{ fontSize: 17, letterSpacing: '-0.32px' }}
            className="mb-3 text-center text-[#86868b]"
          >
            나무 성장 단계
          </p>
          <h2
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.13px' }}
            className="mb-14 text-center text-white"
          >
            씨앗에서 숲까지
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STAGES.map(({ stage, label, range, desc }) => (
              <div
                key={stage}
                className="group flex flex-col items-center rounded-[28px] bg-[#1d1d1f] px-6 py-10 text-center transition hover:bg-[#333336]"
              >
                <div className="mb-6 h-20 w-20 text-[#2997ff] transition group-hover:scale-105">
                  <TreeArt stage={stage} className="h-full w-full" title={label} />
                </div>
                <p
                  style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.14px' }}
                  className="mb-1 text-white"
                >
                  {label}
                </p>
                <p
                  style={{ fontSize: 14, letterSpacing: '-0.31px' }}
                  className="mb-4 text-[#0066cc]"
                >
                  {range}
                </p>
                <p
                  style={{ fontSize: 14, lineHeight: 1.5, letterSpacing: '-0.31px', whiteSpace: 'pre-line' }}
                  className="text-[#86868b]"
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="bg-[#161617] px-5 py-28">
        <div className="mx-auto max-w-[980px]">
          <h2
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.13px' }}
            className="mb-14 text-center text-white"
          >
            숫자로 보는 뉴스 포레스트
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-[28px] bg-[#1d1d1f] px-6 py-10 text-center"
              >
                <p
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.73px' }}
                  className="mb-3 text-[#2997ff]"
                >
                  {s.value}
                </p>
                <p
                  style={{ fontSize: 14, lineHeight: 1.43, letterSpacing: '-0.31px' }}
                  className="text-[#86868b]"
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black px-5 py-36 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(41,151,255,0.1) 0%, transparent 70%)',
          }}
        />
        <h2
          style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 600, lineHeight: 1.07, letterSpacing: '-0.73px' }}
          className="mx-auto mb-5 max-w-[600px] text-white"
        >
          지금 첫 나무를
          <br />
          심어볼까요?
        </h2>
        <p
          style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.2px' }}
          className="mb-10 text-[#86868b]"
        >
          로그인 없이 익명으로, 지금 바로 시작해요.
        </p>
        <Link
          to="/onboarding/welcome"
          style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.32px' }}
          className="inline-block rounded-full bg-[#0071e3] px-10 py-4 text-white transition hover:bg-[#0077ed] active:scale-95"
        >
          시작하기
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-[#333336] bg-[#161617] px-5 py-10">
        <div className="mx-auto max-w-[980px] flex flex-col items-center gap-3 text-center">
          <p
            style={{ fontSize: 12, letterSpacing: '-0.48px' }}
            className="text-[#424245]"
          >
            © 2026 News Forest
          </p>
          <Link
            to="/privacy"
            style={{ fontSize: 12, letterSpacing: '-0.48px' }}
            className="text-[#424245] transition hover:text-[#86868b]"
          >
            개인정보처리방침
          </Link>
        </div>
      </footer>
    </div>
  )
}
