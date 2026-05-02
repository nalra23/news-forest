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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[980px] items-center justify-between px-5 py-3">
          <span className="text-[17px] font-semibold tracking-tight text-foreground">
            News Forest
          </span>
          <Link
            to="/onboarding/welcome"
            className="rounded-full bg-primary px-[18px] py-2 text-sm font-semibold text-white transition hover:bg-primary-700 active:scale-95"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
        <p className="mb-4 text-[17px] text-fg-muted">
          게이미피케이션 기반 뉴스 플랫폼
        </p>
        <h1
          className="mx-auto max-w-[820px] text-foreground"
          style={{ fontSize: 'clamp(44px, 8vw, 80px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: 'clamp(-0.13px, -0.56vw, -0.45px)' }}
        >
          뉴스를 읽으면,
          <br />
          <span className="text-primary">숲이 자란다.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[480px] text-[20px] leading-relaxed text-fg-muted">
          광고 없이, 부담 없이.
          <br />
          한 편마다 나무 한 그루가 자라요.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/onboarding/welcome"
            className="rounded-full bg-primary px-8 py-3.5 text-[17px] font-semibold text-white transition hover:bg-primary-700 active:scale-95"
          >
            지금 시작하기
          </Link>
          <Link
            to="/home"
            className="rounded-full px-8 py-3.5 text-[17px] font-semibold text-primary transition hover:text-primary-700"
          >
            둘러보기 ›
          </Link>
        </div>

        <p className="mt-6 text-xs text-fg-faint">로그인 없이 익명으로 사용해요</p>

        {/* Hero tree icons */}
        <div className="mt-20 flex gap-4">
          {(['SEED', 'SPROUT', 'TREE', 'FOREST'] as TreeStage[]).map((s, i) => (
            <div
              key={s}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-primary shadow-sm opacity-0 animate-[fadeUp_0.6s_ease_forwards]"
              style={{ animationDelay: `${0.1 + i * 0.12}s` }}
            >
              <TreeArt stage={s} className="h-9 w-9" />
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="bg-muted px-5 py-28">
        <div className="mx-auto max-w-[980px]">
          <h2
            className="mb-3 text-center text-foreground"
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.13px' }}
          >
            어떻게 동작하나요?
          </h2>
          <p className="mb-14 text-center text-[20px] text-fg-muted">세 가지 단계, 아주 간단해요.</p>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: '📖', title: '읽어요',   body: '마음에 드는 기사를 차분히 읽어요. 광고도, 방해도 없이.' },
              { icon: '✅', title: '검증해요', body: '90% 스크롤 + 30초 머무르면 완독으로 인정해요.' },
              { icon: '🌱', title: '자라나요', body: '한 편마다 +10P. 씨앗 → 새싹 → 나무 → 숲으로 성장해요.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] bg-surface p-8 shadow-sm">
                <div className="mb-5 text-4xl">{item.icon}</div>
                <h3 className="mb-3 text-[24px] font-bold leading-snug text-foreground">{item.title}</h3>
                <p className="text-[17px] leading-relaxed text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Growth stages ────────────────────────────────── */}
      <section className="bg-background px-5 py-28">
        <div className="mx-auto max-w-[980px]">
          <p className="mb-3 text-center text-[17px] text-fg-muted">나무 성장 단계</p>
          <h2
            className="mb-14 text-center text-foreground"
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.13px' }}
          >
            씨앗에서 숲까지
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STAGES.map(({ stage, label, range, desc }) => (
              <div
                key={stage}
                className="group flex flex-col items-center rounded-[28px] bg-surface px-6 py-10 text-center shadow-sm transition hover:shadow-md"
              >
                <div className="mb-6 h-20 w-20 text-primary transition group-hover:scale-105">
                  <TreeArt stage={stage} className="h-full w-full" title={label} />
                </div>
                <p className="mb-1 text-[24px] font-bold text-foreground">{label}</p>
                <p className="mb-4 text-[14px] font-semibold text-primary">{range}</p>
                <p className="text-[14px] leading-relaxed text-fg-muted" style={{ whiteSpace: 'pre-line' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="bg-muted px-5 py-28">
        <div className="mx-auto max-w-[980px]">
          <h2
            className="mb-14 text-center text-foreground"
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.13px' }}
          >
            숫자로 보는 뉴스 포레스트
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-[28px] bg-surface px-6 py-10 text-center shadow-sm">
                <p
                  className="mb-3 font-bold text-primary"
                  style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.73px' }}
                >
                  {s.value}
                </p>
                <p className="text-[14px] leading-snug text-fg-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Share / Social ───────────────────────────────── */}
      <section className="bg-background px-5 py-28">
        <div className="mx-auto max-w-[980px]">
          <p className="mb-3 text-center text-[17px] text-fg-muted">함께 자라는 숲</p>
          <h2
            className="mb-5 text-center text-foreground"
            style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.13px' }}
          >
            내 숲을 주변과 나눠요.
          </h2>
          <p className="mb-14 text-center text-[20px] leading-relaxed text-fg-muted">
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
              <div key={item.title} className="rounded-[28px] bg-surface p-8 shadow-sm">
                <div className="mb-5 text-4xl">{item.emoji}</div>
                <h3 className="mb-3 text-[24px] font-bold leading-snug text-foreground">{item.title}</h3>
                <p className="text-[17px] leading-relaxed text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="bg-primary px-5 py-36 text-center">
        <h2
          className="mx-auto mb-5 max-w-[600px] text-white"
          style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, lineHeight: 1.07, letterSpacing: '-0.73px' }}
        >
          지금 첫 나무를
          <br />
          심어볼까요?
        </h2>
        <p className="mb-10 text-[20px] text-white/70">
          로그인 없이 익명으로, 지금 바로 시작해요.
        </p>
        <Link
          to="/onboarding/welcome"
          className="inline-block rounded-full bg-white px-10 py-4 text-[17px] font-semibold text-primary transition hover:bg-primary-50 active:scale-95"
        >
          시작하기
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted px-5 py-10">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-3 text-center">
          <p className="text-xs text-fg-faint">© 2026 News Forest</p>
          <Link to="/privacy" className="text-xs text-fg-faint transition hover:text-fg-muted">
            개인정보처리방침
          </Link>
        </div>
      </footer>
    </div>
  )
}
