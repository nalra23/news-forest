import { Link } from 'react-router-dom'
import { TreeArt } from '@/components/tree'
import { type TreeStage } from '@/lib/tree'

const GROWTH_STAGES: { stage: TreeStage; label: string; range: string; desc: string }[] = [
  { stage: 'SEED',   label: '씨앗',  range: '0 – 29P',   desc: '첫 기사를 읽으면 씨앗이 심어져요' },
  { stage: 'SPROUT', label: '새싹',  range: '30 – 99P',  desc: '꾸준히 읽으면 새싹이 돋아요' },
  { stage: 'TREE',   label: '나무',  range: '100 – 299P', desc: '습관이 되면 나무로 자라요' },
  { stage: 'FOREST', label: '숲',    range: '300P +',     desc: '진정한 독자는 숲을 이뤄요' },
]

const STATS = [
  { value: '90%',   label: '스크롤 완독 기준' },
  { value: '30초',  label: '최소 체류 시간' },
  { value: '+10P',  label: '완독 1편당 포인트' },
  { value: '+2P',   label: '물주기 보너스' },
]

const HOW = [
  {
    num: '01',
    title: '읽어요',
    desc: '광고 없이, 내가 고른 기사를 차분하게 읽어요.',
  },
  {
    num: '02',
    title: '검증해요',
    desc: '90% 스크롤 + 30초 머무르면 완독으로 인정해요.',
  },
  {
    num: '03',
    title: '자라나요',
    desc: '한 편마다 +10P. 씨앗에서 시작해 숲을 이뤄요.',
  },
]

export function ShowcasePage() {
  return (
    <div
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif" }}
      className="min-h-dvh bg-black text-white"
    >
      {/* ── Nav ── */}
      <nav className="fixed top-0 z-50 w-full bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[980px] items-center justify-between px-6 py-3">
          <span className="text-sm font-semibold tracking-tight text-white/90">
            News Forest
          </span>
          <Link
            to="/onboarding/welcome"
            className="rounded-full bg-[#0071e3] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#0077ed]"
          >
            시작하기
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-[17px] font-normal tracking-[-0.32px] text-[#86868b]">
          뉴스 × 게이미피케이션
        </p>
        <h1
          className="mx-auto max-w-3xl text-[56px] font-semibold leading-[1.07] tracking-[-0.73px] text-white md:text-[80px] md:leading-[1.05] md:tracking-[-0.45px]"
        >
          뉴스를 읽으면,
          <br />
          숲이 자란다.
        </h1>
        <p className="mt-6 max-w-md text-[20px] font-normal leading-[1.25] tracking-[-0.2px] text-[#86868b]">
          광고 없이, 부담 없이.
          <br />
          한 편마다 나무 한 그루가 자라요.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            to="/onboarding/welcome"
            className="rounded-full bg-[#0071e3] px-8 py-3 text-[17px] font-semibold tracking-[-0.32px] text-white transition hover:bg-[#0077ed]"
          >
            지금 시작하기
          </Link>
          <Link
            to="/home"
            className="rounded-full px-8 py-3 text-[17px] font-semibold tracking-[-0.32px] text-[#2997ff] transition hover:text-white"
          >
            둘러보기 →
          </Link>
        </div>
        <p className="mt-6 text-[12px] tracking-[-0.48px] text-[#424245]">
          로그인 없이 익명으로 사용해요
        </p>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-[980px]">
          <h2 className="mb-16 text-center text-[44px] font-semibold leading-[1.05] tracking-[-0.13px] text-white">
            어떻게 동작하나요?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {HOW.map((item) => (
              <div
                key={item.num}
                className="rounded-[28px] bg-[#1d1d1f] p-8"
              >
                <p className="mb-4 text-[56px] font-semibold leading-none tracking-[-0.73px] text-[#424245]">
                  {item.num}
                </p>
                <h3 className="mb-2 text-[24px] font-semibold leading-[1.17] tracking-[-0.14px] text-white">
                  {item.title}
                </h3>
                <p className="text-[17px] leading-[1.29] tracking-[-0.32px] text-[#86868b]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Growth stages ── */}
      <section className="bg-[#161617] px-6 py-24">
        <div className="mx-auto max-w-[980px]">
          <p className="mb-3 text-center text-[17px] tracking-[-0.32px] text-[#86868b]">
            나무 성장 단계
          </p>
          <h2 className="mb-16 text-center text-[44px] font-semibold leading-[1.05] tracking-[-0.13px] text-white">
            씨앗에서 숲까지
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {GROWTH_STAGES.map(({ stage, label, range, desc }) => (
              <div
                key={stage}
                className="flex flex-col items-center rounded-[28px] bg-[#1d1d1f] px-6 py-10 text-center"
              >
                <div className="mb-6 h-20 w-20 text-[#2997ff]">
                  <TreeArt stage={stage} className="h-full w-full" title={label} />
                </div>
                <p className="mb-1 text-[24px] font-semibold tracking-[-0.14px] text-white">
                  {label}
                </p>
                <p className="mb-3 text-[14px] tracking-[-0.31px] text-[#0066cc]">
                  {range}
                </p>
                <p className="text-[14px] leading-[1.43] tracking-[-0.31px] text-[#86868b]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-[980px]">
          <h2 className="mb-16 text-center text-[44px] font-semibold leading-[1.05] tracking-[-0.13px] text-white">
            숫자로 보는 뉴스 포레스트
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-[28px] bg-[#1d1d1f] px-6 py-10 text-center"
              >
                <p className="mb-2 text-[56px] font-semibold leading-none tracking-[-0.73px] text-[#2997ff]">
                  {s.value}
                </p>
                <p className="text-[14px] leading-[1.43] tracking-[-0.31px] text-[#86868b]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-[#161617] px-6 py-32 text-center">
        <h2 className="mx-auto mb-4 max-w-2xl text-[56px] font-semibold leading-[1.07] tracking-[-0.73px] text-white">
          지금 첫 나무를
          <br />
          심어볼까요?
        </h2>
        <p className="mb-10 text-[20px] tracking-[-0.2px] text-[#86868b]">
          로그인 없이 익명으로, 지금 바로 시작해요.
        </p>
        <Link
          to="/onboarding/welcome"
          className="inline-block rounded-full bg-[#0071e3] px-10 py-4 text-[17px] font-semibold tracking-[-0.32px] text-white transition hover:bg-[#0077ed]"
        >
          시작하기
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#333336] px-6 py-8">
        <div className="mx-auto max-w-[980px] flex flex-col items-center gap-2 text-center text-[12px] tracking-[-0.48px] text-[#424245]">
          <p>© 2026 News Forest</p>
          <Link to="/privacy" className="hover:text-[#86868b] transition">
            개인정보처리방침
          </Link>
        </div>
      </footer>
    </div>
  )
}
