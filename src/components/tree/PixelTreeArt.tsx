import { clsx } from 'clsx'
import type { TreeStage } from '@/lib/tree'

export interface PixelTreeArtProps {
  stage: TreeStage
  className?: string
  title?: string
}

/**
 * Minecraft-inspired 픽셀 아트 일러스트.
 * 16x16 grid, viewBox="0 0 16 16", shape-rendering="crispEdges" 로 안티에일리어싱 비활성화.
 * 각 픽셀은 1x1 rect.
 */

const PALETTE: Record<string, string> = {
  L: '#4FA84F', // leaf mid
  l: '#7BC25C', // leaf highlight
  T: '#7C4A2A', // trunk dark
  t: '#A06A3A', // trunk light
  D: '#9B7849', // dirt mid
  d: '#785C36', // dirt dark
  g: '#5DAB45', // grass tip
  S: '#C9A77B', // seed shell light
  s: '#9B7B4F', // seed shell dark
}

const PATTERNS: Record<TreeStage, string[]> = {
  // 작은 씨앗이 흙 속에서 싹을 막 틔움
  SEED: [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '.......l........',
    '.......L........',
    '......SSS.......',
    '......sss.......',
    '.....ggggg......',
    '.....DdDdD......',
    '.....DDDDD......',
    '................',
  ],
  // 작은 새싹 — 둥근 잎 클러스터 + 얇은 줄기
  SPROUT: [
    '................',
    '................',
    '................',
    '................',
    '.......l........',
    '......LlL.......',
    '.....LLLLL......',
    '.....LLLLL......',
    '......LLL.......',
    '.......L........',
    '.......L........',
    '.......L........',
    '.....ggggg......',
    '.....DdDdD......',
    '.....DDDDD......',
    '................',
  ],
  // 잘 자란 나무 — 큰 잎 캐노피 + 2칸 트렁크
  TREE: [
    '................',
    '.....LLLLLLL....',
    '....LLLLLLLLL...',
    '....LlLLlLLlL...',
    '....LLLLLLLLL...',
    '....LLLLLLLLL...',
    '....LLLLLLLLL...',
    '.....LLLLLLL....',
    '......LLLLL.....',
    '.......TT.......',
    '.......Tt.......',
    '.......TT.......',
    '.....ggggggg....',
    '....DdDddDdDd...',
    '....DDDDDDDDD...',
    '................',
  ],
  // 빽빽한 숲 — 5그루 (양옆 small × 4 + 가운데 large), 캐노피 일부 합쳐짐
  FOREST: [
    '................',
    '.......LL.......',
    '......LLLL......',
    '......LLLL......',
    'LL.LL.LLLL.LL.LL',
    'LLLLL.LLLL.LLLLL',
    'LLLLLLLLLLLLLLLL',
    'LLLLLLLLLLLLLLLL',
    'LLLLL.LLLL.LLLLL',
    '.LL...LLLL...LL.',
    '.T..T.LLLL.T..T.',
    '.T..T..TT..T..T.',
    '.T..T..TT..T..T.',
    '.T..T..TT..T..T.',
    'gggggggggggggggg',
    'DDDDDDDDDDDDDDDD',
  ],
}

export function PixelTreeArt({ stage, className, title }: PixelTreeArtProps) {
  const pattern = PATTERNS[stage]

  return (
    <svg
      viewBox="0 0 16 16"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={!title}
      shapeRendering="crispEdges"
      className={clsx(className)}
    >
      {pattern.map((row, y) =>
        row.split('').map((char, x) => {
          if (char === '.') return null
          const color = PALETTE[char]
          if (!color) return null
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={color}
            />
          )
        }),
      )}
    </svg>
  )
}
