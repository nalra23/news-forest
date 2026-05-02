import { Link } from 'react-router-dom'
import { TreeArt } from '@/components/tree'
import { type TreeStage } from '@/lib/tree'

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

export function ShowcasePage() {
  return (
    <div className="min-h-dvh bg-background font-sans text-foreground antialiased">

      {/* ── Sticky Nav ───────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-3">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            News Forest
          </span>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { label: '특징', href: '#features' },
              { label: '성장 단계', href: '#stages' },
              { label: '숫자로 보기', href: '#stats' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-1.5 text-[14px] font-medium text-fg-muted transition hover:bg-muted hover:text-foreground"
                style={{ letterSpacing: '-0.006px' }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link
            to="/onboarding/welcome"
            className="rounded-lg bg-primary px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-primary-700 active:scale-95"
            style={{ borderRadius: '8px' }}
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="flex min-h-dvh flex-col items-center justify-center px-6 pt-16 text-center"
        style={{ background: 'rgb(var(--color-foreground))', color: '#fff' }}
      >
        {/* Badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium"
          style={{ background: 'rgba(255,255,255,0.12)', letterSpacing: '0.01px', color: 'rgba(255,255,255,0.75)' }}
        >
          게이미피케이션 기반 뉴스 플랫폼
        </div>

        {/* Display Headline */}
        <h1
          className="mx-auto max-w-[820px]"
          style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: 'clamp(-0.033px, -0.36vw, -0.036px)', color: '#fff' }}
        >
          뉴스를 읽으면,
          <br />
          <span style={{ color: 'rgb(var(--color-secondary))' }}>숲이 자란다.</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-[480px] leading-relaxed"
          style={{ fontSize: '20px', lineHeight: '1.35', letterSpacing: '-0.011px', color: 'rgba(255,255,255,0.6)' }}
        >
          광고 없이, 부담 없이.
          <br />
          한 편마다 나무 한 그루가 자라요.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/onboarding/welcome"
            className="rounded-full bg-primary px-8 py-3 text-[15px] font-semibold text-white transition hover:bg-primary-700 active:scale-95"
            style={{ borderRadius: '9999px' }}
          >
            지금 시작하기
          </Link>
          <Link
            to="/home"
            className="rounded-full px-8 py-3 text-[15px] font-semibold transition active:scale-95"
            style={{ borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
          >
            둘러보기
          </Link>
        </div>

        <p className="mt-5 text-[12px]" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.01px' }}>
          로그인 없이 익명으로 사용해요
        </p>

        {/* Tree icons row */}
        <div className="mt-20 flex gap-3">
          {(['SEED', 'SPROUT', 'TREE', 'FOREST'] as TreeStage[]).map((s, i) => (
            <div
              key={s}
              className="flex h-14 w-14 items-center justify-center opacity-0 animate-[fadeUp_0.6s_ease_forwards]"
              style={{
                animationDelay: `${0.1 + i * 0.12}s`,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
              }}
            >
              <TreeArt stage={s} className="h-9 w-9" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="bg-background px-6 py-28">
        <div className="mx-auto max-w-[1080px]">
          {/* Info badge */}
          <div className="mb-6 flex justify-center">
            <span
              className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-[12px] font-medium text-primary"
              style={{ borderRadius: '9999px', letterSpacing: '0.01px' }}
            >
              어떻게 동작하나요?
            </span>
          </div>

          <h2
            className="mb-4 text-center text-foreground"
            style={{ fontSize: 'clamp(32px, 4.5vw, 40px)', fontWeight: 700, lineHeight: 1.23, letterSpacing: '-0.035px' }}
          >
            세 가지 단계, 아주 간단해요.
          </h2>
          <p
            className="mb-14 text-center text-fg-muted"
            style={{ fontSize: '20px', lineHeight: '1.35', letterSpacing: '-0.011px' }}
          >
            읽고, 검증되고, 성장해요.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: '📖', title: '읽어요',   body: '마음에 드는 기사를 차분히 읽어요. 광고도, 방해도 없이.' },
              { icon: '✅', title: '검증해요', body: '90% 스크롤 + 30초 머무르면 완독으로 인정해요.' },
              { icon: '🌱', title: '자라나요', body: '한 편마다 +10P. 씨앗 → 새싹 → 나무 → 숲으로 성장해요.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface p-6 shadow-sm transition hover:shadow-md"
                style={{ borderRadius: '12px', padding: '24px' }}
              >
                <div className="mb-5 text-4xl">{item.icon}</div>
                <h3
                  className="mb-3 text-foreground"
                  style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1.33, letterSpacing: '-0.024px' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-fg-muted"
                  style={{ fontSize: '15px', lineHeight: '1.6', letterSpacing: '-0.006px' }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Growth Stages ────────────────────────────────── */}
      <section id="stages" className="bg-muted px-6 py-28">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-6 flex justify-center">
            <span
              className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-[12px] font-medium text-primary"
              style={{ borderRadius: '9999px', letterSpacing: '0.01px' }}
            >
              나무 성장 단계
            </span>
          </div>

          <h2
            className="mb-14 text-center text-foreground"
            style={{ fontSize: 'clamp(32px, 4.5vw, 40px)', fontWeight: 700, lineHeight: 1.23, letterSpacing: '-0.035px' }}
          >
            씨앗에서 숲까지
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STAGES.map(({ stage, label, range, desc }) => (
              <div
                key={stage}
                className="group flex flex-col items-center bg-surface text-center shadow-sm transition hover:shadow-md"
                style={{ borderRadius: '12px', padding: '32px 24px' }}
              >
                <div className="mb-6 h-20 w-20 text-primary transition group-hover:scale-105">
                  <TreeArt stage={stage} className="h-full w-full" title={label} />
                </div>
                <p
                  className="mb-1 text-foreground"
                  style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.33, letterSpacing: '-0.024px' }}
                >
                  {label}
                </p>
                <p
                  className="mb-4 font-semibold text-primary"
                  style={{ fontSize: '12px', letterSpacing: '0.01px' }}
                >
                  {range}
                </p>
                <p
                  className="text-fg-muted"
                  style={{ fontSize: '14px', lineHeight: '1.6', letterSpacing: '-0.006px', whiteSpace: 'pre-line' }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section id="stats" className="bg-background px-6 py-28">
        <div className="mx-auto max-w-[1080px]">
          <h2
            className="mb-14 text-center text-foreground"
            style={{ fontSize: 'clamp(32px, 4.5vw, 40px)', fontWeight: 700, lineHeight: 1.23, letterSpacing: '-0.035px' }}
          >
            숫자로 보는 뉴스 포레스트
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-surface text-center shadow-sm"
                style={{ borderRadius: '12px', padding: '40px 24px' }}
              >
                <p
                  className="mb-3 font-bold tabular-nums text-primary"
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.035px' }}
                >
                  {s.value}
                </p>
                <p
                  className="text-fg-muted"
                  style={{ fontSize: '14px', lineHeight: 1.43, letterSpacing: '-0.006px' }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Share / Social ───────────────────────────────── */}
      <section className="bg-muted px-6 py-28">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-6 flex justify-center">
            <span
              className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-[12px] font-medium text-primary"
              style={{ borderRadius: '9999px', letterSpacing: '0.01px' }}
            >
              함께 자라는 숲
            </span>
          </div>

          <h2
            className="mb-4 text-center text-foreground"
            style={{ fontSize: 'clamp(32px, 4.5vw, 40px)', fontWeight: 700, lineHeight: 1.23, letterSpacing: '-0.035px' }}
          >
            내 숲을 주변과 나눠요.
          </h2>
          <p
            className="mb-14 text-center text-fg-muted"
            style={{ fontSize: '20px', lineHeight: '1.35', letterSpacing: '-0.011px' }}
          >
            링크 하나로 내 독서 숲을 공유하고,
            <br />
            친구의 나무에 물도 줄 수 있어요.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { emoji: '🔗', title: '숲 공유',  body: '내 숲 링크를 카카오톡·인스타그램 어디든 공유할 수 있어요.' },
              { emoji: '💧', title: '물주기',   body: '친구 숲에 방문해 나무에 물을 주면 +2P를 보너스로 드려요.' },
              { emoji: '🏆', title: '랭킹',     body: '얼마나 많이 읽었는지 랭킹으로 확인하고 비교해봐요.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-surface shadow-sm transition hover:shadow-md"
                style={{ borderRadius: '12px', padding: '24px' }}
              >
                <div className="mb-5 text-4xl">{item.emoji}</div>
                <h3
                  className="mb-3 text-foreground"
                  style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1.33, letterSpacing: '-0.024px' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-fg-muted"
                  style={{ fontSize: '15px', lineHeight: '1.6', letterSpacing: '-0.006px' }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="bg-primary px-6 py-36 text-center">
        <h2
          className="mx-auto mb-5 max-w-[560px] text-white"
          style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', fontWeight: 700, lineHeight: 1.07, letterSpacing: '-0.035px' }}
        >
          지금 첫 나무를
          <br />
          심어볼까요?
        </h2>
        <p
          className="mb-10 text-white/70"
          style={{ fontSize: '20px', lineHeight: 1.35, letterSpacing: '-0.011px' }}
        >
          로그인 없이 익명으로, 지금 바로 시작해요.
        </p>
        <Link
          to="/onboarding/welcome"
          className="inline-block bg-white text-primary transition hover:bg-primary-50 active:scale-95"
          style={{ borderRadius: '9999px', padding: '14px 40px', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.006px' }}
        >
          시작하기
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted px-6 py-10">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center gap-3 text-center">
          <p className="text-[12px] text-fg-faint" style={{ letterSpacing: '0.01px' }}>
            © 2026 News Forest
          </p>
          <Link
            to="/privacy"
            className="text-[12px] text-fg-faint transition hover:text-fg-muted"
            style={{ letterSpacing: '0.01px' }}
          >
            개인정보처리방침
          </Link>
        </div>
      </footer>
    </div>
  )
}
