import { clsx } from 'clsx'
import { useThemeStore } from '@/stores'
import type { TreeStage } from '@/lib/tree'
import { PixelTreeArt } from './PixelTreeArt'

export interface TreeArtProps {
  stage: TreeStage
  className?: string
  title?: string
}

/**
 * Stage별 일러스트. 테마 모드에 따라 자동 분기.
 * - default: cubic bezier organic SVG (currentColor + opacity)
 * - pixel: 16x16 Minecraft 스타일 픽셀 아트
 */
export function TreeArt({ stage, className, title }: TreeArtProps) {
  const mode = useThemeStore((s) => s.mode)

  if (mode === 'pixel') {
    return <PixelTreeArt stage={stage} className={className} title={title} />
  }

  return (
    <svg
      viewBox="0 0 100 100"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={!title}
      className={clsx('text-primary', className)}
    >
      {stage === 'SEED' && <SeedShape />}
      {stage === 'SPROUT' && <SproutShape />}
      {stage === 'TREE' && <TreeShape />}
      {stage === 'FOREST' && <ForestShape />}
    </svg>
  )
}

function Ground() {
  return (
    <ellipse
      cx="50"
      cy="93"
      rx="34"
      ry="2.5"
      fill="currentColor"
      opacity="0.1"
    />
  )
}

/* ────────────────────────────────────────────────
 * SEED — 작은 씨앗에서 첫 새싹이 막 올라오는 순간
 * 따뜻한 둥근 씨앗 + 가느다란 첫 줄기 + 첫 잎
 * ──────────────────────────────────────────────── */
function SeedShape() {
  return (
    <g>
      <Ground />
      {/* Seed body — soft droplet, slightly offset for warmth */}
      <path
        d="M50 82 C 38 82 33 70 38 60 C 41 53 46 50 50 50 C 54 50 59 53 62 60 C 67 70 62 82 50 82 Z"
        fill="currentColor"
        opacity="0.55"
      />
      {/* Inner shadow for depth */}
      <path
        d="M50 78 C 43 78 41 70 44 64 C 46 60 49 58 50 58 C 51 58 54 60 56 64 C 59 70 57 78 50 78 Z"
        fill="currentColor"
        opacity="0.25"
      />
      {/* Emerging stem — gently curved */}
      <path
        d="M50 50 C 49 44 51 39 53 35"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* First tiny leaf — heart shape */}
      <path
        d="M53 35 C 56 31 61 33 60 36 C 59 39 55 39 53 35 Z"
        fill="currentColor"
      />
    </g>
  )
}

/* ────────────────────────────────────────────────
 * SPROUT — 두 잎이 펼쳐진 어린 새싹
 * 부드러운 곡선의 줄기 + 양쪽 하트 잎 + 위쪽 봉오리
 * ──────────────────────────────────────────────── */
function SproutShape() {
  return (
    <g>
      <Ground />
      {/* Stem — gentle S-curve */}
      <path
        d="M50 92 C 48 80 52 68 50 56 C 49 52 50 48 50 46"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left leaf — teardrop curving back to stem */}
      <path
        d="M50 65 C 42 60 32 64 32 70 C 32 76 42 73 50 67 C 50 66 50 65 50 65 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Right leaf — mirror */}
      <path
        d="M50 56 C 58 50 68 54 68 60 C 68 66 58 63 50 58 C 50 57 50 56 50 56 Z"
        fill="currentColor"
      />
      {/* Top bud */}
      <path
        d="M50 46 C 47 44 47 39 50 38 C 53 39 53 44 50 46 Z"
        fill="currentColor"
        opacity="0.95"
      />
    </g>
  )
}

/* ────────────────────────────────────────────────
 * TREE — 잘 자란 나무 한 그루
 * 자연스럽게 살짝 휜 트렁크 + 클라우드/하트 같은 부드러운 캐노피
 * + 미세한 옆 잎 클러스터로 풍성함
 * ──────────────────────────────────────────────── */
function TreeShape() {
  return (
    <g>
      <Ground />
      {/* Trunk — tapered with gentle natural curve */}
      <path
        d="M47 92 C 46 84 47 76 48 65 L 52 65 C 53 76 54 84 53 92 Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* Branch — left */}
      <path
        d="M49 72 C 44 68 39 64 35 60"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Branch — right */}
      <path
        d="M51 67 C 56 63 60 60 64 58"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Side leaf cluster — left, behind */}
      <path
        d="M30 56 C 22 56 18 46 24 40 C 28 36 34 38 34 44 C 38 42 42 46 38 52 C 36 56 32 58 30 56 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Side leaf cluster — right, behind */}
      <path
        d="M70 54 C 78 54 82 44 76 38 C 72 34 66 36 66 42 C 62 40 58 44 62 50 C 64 54 68 56 70 54 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Main canopy — soft cloud/heart shape */}
      <path
        d="M50 20 C 32 20 24 36 30 48 C 26 52 28 60 36 60 C 40 66 60 66 64 60 C 72 60 74 52 70 48 C 76 36 68 20 50 20 Z"
        fill="currentColor"
      />
      {/* Subtle inner highlight */}
      <ellipse cx="42" cy="34" rx="6" ry="4" fill="currentColor" opacity="0.15" />
    </g>
  )
}

/* ────────────────────────────────────────────────
 * FOREST — 작은 숲 (3그루, 깊이감)
 * 가운데 큰 나무 + 양옆 작은 나무 (opacity로 원근)
 * ──────────────────────────────────────────────── */
function ForestShape() {
  return (
    <g>
      <Ground />

      {/* ─── Far-left tiny tree (most faded — depth) ─── */}
      <path
        d="M8 92 C 7.5 88 8 84 8.5 81 L 10 81 C 10.5 84 11 88 10.5 92 Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M9 68 C 3 68 0 76 4 82 C 6 86 14 86 16 82 C 20 76 17 68 9 68 Z"
        fill="currentColor"
        opacity="0.4"
      />

      {/* ─── Mid-left small tree (faded) ─── */}
      <path
        d="M22 92 C 21.5 86 22 80 23 75 L 25 75 C 26 80 26.5 86 26 92 Z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M24 56 C 14 56 10 68 16 76 C 18 80 30 80 32 76 C 38 68 34 56 24 56 Z"
        fill="currentColor"
        opacity="0.6"
      />

      {/* ─── Mid-right tree ─── */}
      <path
        d="M74 92 C 73.5 84 74 76 75 68 L 77 68 C 78 76 78.5 84 78 92 Z"
        fill="currentColor"
        opacity="0.78"
      />
      <path
        d="M76 46 C 64 46 58 60 66 70 C 68 74 84 74 86 70 C 92 60 88 46 76 46 Z"
        fill="currentColor"
        opacity="0.78"
      />

      {/* ─── Far-right tiny tree (most faded) ─── */}
      <path
        d="M90 92 C 89.5 88 90 84 90.5 80 L 92 80 C 92.5 84 93 88 92.5 92 Z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M91 66 C 84 66 81 76 86 82 C 88 86 96 86 98 82 C 102 76 99 66 91 66 Z"
        fill="currentColor"
        opacity="0.45"
      />

      {/* ─── Center main tree ─── */}
      <path
        d="M47 92 C 46 84 47 76 48 62 L 52 62 C 53 76 54 84 53 92 Z"
        fill="currentColor"
      />
      <path
        d="M49 70 C 45 66 41 62 38 58"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 22 C 32 22 24 38 32 50 C 28 54 30 62 38 62 C 42 68 58 68 62 62 C 70 62 72 54 68 50 C 76 38 68 22 50 22 Z"
        fill="currentColor"
      />

      {/* ─── Front-left small tree (1.0 op, overlapping) ─── */}
      <path
        d="M36 92 C 35.5 88 36 84 37 80 L 39 80 C 40 84 40.5 88 40 92 Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M38 64 C 30 64 26 74 32 80 C 34 84 44 84 46 80 C 52 74 46 64 38 64 Z"
        fill="currentColor"
        opacity="0.95"
      />

      {/* ─── Front-right small tree ─── */}
      <path
        d="M62 92 C 61.5 88 62 84 63 80 L 65 80 C 66 84 66.5 88 66 92 Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M64 64 C 56 64 52 74 58 80 C 60 84 70 84 72 80 C 78 74 72 64 64 64 Z"
        fill="currentColor"
        opacity="0.92"
      />
    </g>
  )
}
