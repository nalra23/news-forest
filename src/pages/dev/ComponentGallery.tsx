import { useState } from 'react'
import {
  Button,
  Card,
  GrowthGauge,
  PointBadge,
  Skeleton,
} from '@/components/ui'
import { TreeArt } from '@/components/tree'
import { TREE_STAGE_DISPLAY, type TreeStage } from '@/lib/tree'
import { useToastStore } from '@/stores/toastStore'

const ALL_STAGES: TreeStage[] = ['SEED', 'SPROUT', 'TREE', 'FOREST']

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-fg-muted">{description}</p>
        )}
      </div>
      <Card padding="md">{children}</Card>
    </section>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-2 first:pt-0 last:pb-0">
      <span className="w-24 shrink-0 text-xs text-fg-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const STAGE_TARGETS = [50, 200, 500] as const
type StageIndex = 0 | 1 | 2

export function ComponentGallery() {
  const [points, setPoints] = useState(78)
  const [stageIdx, setStageIdx] = useState<StageIndex>(1)
  const showToast = useToastStore((s) => s.show)

  const target = STAGE_TARGETS[stageIdx]

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 desktop:py-12">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          M2 · Component Gallery
        </p>
        <h1 className="text-2xl font-bold desktop:text-3xl">
          News Forest Design Tokens
        </h1>
        <p className="text-sm text-fg-muted">
          DesignGuide §2 · §5 의 토큰과 기본 컴포넌트 시각 검증 페이지입니다.
          이 라우트는 M3 이후 Layout으로 교체됩니다.
        </p>
      </header>

      <Section title="Color Tokens" description="절대 토큰 5종 + ramp">
        <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
          {[
            { name: 'primary', cls: 'bg-primary text-white' },
            { name: 'secondary', cls: 'bg-secondary text-primary-700' },
            { name: 'accent', cls: 'bg-accent text-foreground' },
            { name: 'background', cls: 'bg-background text-foreground border' },
            { name: 'surface', cls: 'bg-surface text-foreground border' },
            { name: 'muted', cls: 'bg-muted text-foreground' },
            { name: 'foreground', cls: 'bg-foreground text-white' },
            { name: 'error', cls: 'bg-error text-white' },
          ].map((c) => (
            <div
              key={c.name}
              className={`rounded-md p-3 text-xs font-medium ${c.cls}`}
            >
              {c.name}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        description="Pretendard / Noto Serif KR · numeric tabular-nums"
      >
        <div className="space-y-2">
          <div className="text-3xl font-bold">Display 28/36px · 700</div>
          <div className="text-2xl font-bold">Heading 1 · 700</div>
          <div className="text-lg font-semibold">Heading 2 · 600</div>
          <div className="text-base font-semibold">Heading 3 · 600</div>
          <div className="text-[15px]">
            Body — 뉴스를 한 편 읽을 때마다, 나무 한 그루가 자랍니다.
          </div>
          <div className="font-serif text-base leading-[1.75]">
            Article body (Noto Serif KR) — 한국어 longform 가독성 위주의 본문.
            line-height 1.75.
          </div>
          <div className="text-xs text-fg-muted">
            Caption · 13px · text-fg-muted
          </div>
          <div className="numeric text-xl font-semibold">
            123,456 (tabular-nums) · 78 P
          </div>
        </div>
      </Section>

      <Section title="Button" description="primary / secondary / ghost / danger × sm / md / lg">
        <div className="space-y-3">
          <Row label="primary">
            <Button size="sm">시작하기</Button>
            <Button size="md">시작하기</Button>
            <Button size="lg">시작하기</Button>
          </Row>
          <Row label="secondary">
            <Button variant="secondary" size="md">다음</Button>
            <Button variant="secondary" size="md" loading>
              저장 중
            </Button>
            <Button variant="secondary" size="md" disabled>
              비활성
            </Button>
          </Row>
          <Row label="ghost">
            <Button variant="ghost">텍스트 링크</Button>
            <Button variant="ghost" disabled>
              비활성
            </Button>
          </Row>
          <Row label="danger">
            <Button variant="danger" size="md">
              데이터 초기화
            </Button>
          </Row>
        </div>
      </Section>

      <Section title="Card" description="soft / lift / flat">
        <div className="grid gap-3 tablet:grid-cols-3">
          <Card variant="soft">
            <div className="text-sm font-semibold">Card · soft</div>
            <p className="mt-1 text-xs text-fg-muted">기본 카드 그림자</p>
          </Card>
          <Card variant="lift">
            <div className="text-sm font-semibold">Card · lift</div>
            <p className="mt-1 text-xs text-fg-muted">호버/모달 그림자</p>
          </Card>
          <Card variant="flat">
            <div className="text-sm font-semibold">Card · flat</div>
            <p className="mt-1 text-xs text-fg-muted">테두리만</p>
          </Card>
        </div>
      </Section>

      <Section
        title="PointBadge · countup"
        description="350ms ease-out 숫자 보간. + / − 클릭 시 애니메이션 확인"
      >
        <div className="flex flex-wrap items-center gap-4">
          <PointBadge value={points} />
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setPoints((p) => p + 10)}>
              +10
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setPoints((p) => p + 2)}>
              +2 (Watering)
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPoints(0)}>
              리셋
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="GrowthGauge"
        description="Tree 단계 진행률 · width transition 500ms ease-out"
      >
        <div className="space-y-4">
          <GrowthGauge current={Math.min(points, target)} target={target} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-fg-muted">목표:</span>
            {STAGE_TARGETS.map((t, i) => (
              <Button
                key={t}
                size="sm"
                variant={stageIdx === i ? 'primary' : 'ghost'}
                onClick={() => setStageIdx(i as StageIndex)}
              >
                {t} P
              </Button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Skeleton" description="shimmer 1.5s · loading state">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Section>

      <Section title="Toast" description="Mobile bottom-20 · Desktop top-right · 3s auto dismiss">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() =>
              showToast('기사 한 편 읽었어요. +10P', { icon: '🍃' })
            }
          >
            완독 토스트
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => showToast('물을 줬어요. +2P', { icon: '💧' })}
          >
            Watering 토스트
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              showToast('잠시 문제가 있었어요. 다시 시도해볼까요?', {
                icon: '🍂',
              })
            }
          >
            Error 토스트 (warm tone)
          </Button>
        </div>
      </Section>

      <Section title="Tree Stages" description="4단계 SVG art (currentColor 기반)">
        <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
          {ALL_STAGES.map((stage) => (
            <div key={stage} className="flex flex-col items-center gap-3">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 via-surface to-secondary/40 shadow-soft">
                <div className="h-2/3 w-2/3 text-primary">
                  <TreeArt stage={stage} className="h-full w-full" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">
                  {TREE_STAGE_DISPLAY[stage]}
                </p>
                <p className="text-xs text-fg-muted">{stage}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-fg-faint">
          이 SVG는 currentColor 기반이라 부모 텍스트 색을 따라가요. 단계 간
          전환 시 350ms (FOREST는 500ms) 자동 모션.
        </p>
      </Section>

      <Section title="Motion" description="leaf 350ms (1회 trigger)">
        <LeafPlayground />
      </Section>
    </div>
  )
}

function LeafPlayground() {
  const [key, setKey] = useState(0)
  return (
    <div className="flex items-center gap-4">
      <div
        key={key}
        className="flex h-16 w-16 animate-leaf items-center justify-center rounded-full bg-primary-100 text-2xl"
        aria-hidden
      >
        🍃
      </div>
      <Button size="sm" variant="secondary" onClick={() => setKey((k) => k + 1)}>
        모션 재생
      </Button>
    </div>
  )
}
