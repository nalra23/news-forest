import { clsx } from 'clsx'

export interface PixelIconProps {
  name: PixelIconName
  className?: string
  title?: string
}

export type PixelIconName =
  | 'sprout'
  | 'tree'
  | 'drop'
  | 'news'
  | 'map'
  | 'chart'
  | 'gear'
  | 'bell'
  | 'leaf'
  | 'flame'
  | 'clock'
  | 'sparkle'

/**
 * 16x16 픽셀 아이콘 셋. shape-rendering="crispEdges" 로 안티에일리어싱 OFF.
 * Pixel 테마에서 emoji 대체용.
 */

const PALETTE: Record<string, string> = {
  L: '#4FA84F', // leaf mid
  l: '#7BC25C', // leaf light
  T: '#7C4A2A', // trunk dark
  t: '#A06A3A', // trunk light
  D: '#9B7849', // dirt
  d: '#785C36', // dirt dark
  g: '#5DAB45', // grass
  B: '#6BAED6', // water blue
  b: '#9DCCE7', // water highlight
  Y: '#F2C94C', // mustard gold
  y: '#FBE9A7', // gold light
  K: '#1F2A44', // navy (line/icon)
  k: '#5A6378', // muted navy
  W: '#FFFFFF',
  w: '#EFEAD9',
  R: '#E45757', // red accent
  r: '#FF8B6B', // orange accent
  S: '#7A7A7A', // stone
  s: '#A8A8A8', // light stone
}

const PATTERNS: Record<PixelIconName, string[]> = {
  // 작은 새싹 — Home / 새싹 단계
  sprout: [
    '................',
    '................',
    '......l.........',
    '.....LlL........',
    '....LLLLL.......',
    '....LlLLL.......',
    '.....LLL........',
    '......L.........',
    '......L.........',
    '......L.........',
    '......L.........',
    '....DDDDD.......',
    '....DdDdD.......',
    '....DDDDD.......',
    '................',
    '................',
  ],
  // 나무 — Forest tab
  tree: [
    '................',
    '.....LLLLL......',
    '....LLLLLLL.....',
    '....LlLLlLL.....',
    '....LLLLLLL.....',
    '....LLLLLLL.....',
    '.....LLLLL......',
    '......LLL.......',
    '......TT........',
    '......TT........',
    '......TT........',
    '......TT........',
    '....DDDDDD......',
    '....DdDddD......',
    '....DDDDDD......',
    '................',
  ],
  // 물방울 — PointBadge / Watering
  drop: [
    '................',
    '................',
    '.......B........',
    '......BBB.......',
    '......BbB.......',
    '.....BBBBB......',
    '.....BBBBB......',
    '....BBBBBBB.....',
    '....BBBBBBB.....',
    '....BBBBBBB.....',
    '....BBBBBBB.....',
    '.....BBBBB......',
    '......BBB.......',
    '................',
    '................',
    '................',
  ],
  // 신문 — Articles tab
  news: [
    '................',
    '.KKKKKKKKKKKK...',
    '.KWWWWWWWWWWK...',
    '.KWKKKKKKKKWK...',
    '.KWWWWWWWWWWK...',
    '.KWKKKWKKKKWK...',
    '.KWKKKWKKKKWK...',
    '.KWKKKWKKKKWK...',
    '.KWKKKWKKKKWK...',
    '.KWWWWWWWWWWK...',
    '.KWKKKKKKKKWK...',
    '.KWWWWWWWWWWK...',
    '.KKKKKKKKKKKK...',
    '................',
    '................',
    '................',
  ],
  // 지도 핀 — Nearby tab
  map: [
    '................',
    '................',
    '......RRR.......',
    '.....RrrrR......',
    '....RrrrrrR.....',
    '....RrWWrrR.....',
    '....RrWWrrR.....',
    '....RrrrrrR.....',
    '.....RrrrR......',
    '......RRR.......',
    '.......R........',
    '.......R........',
    '......KKK.......',
    '................',
    '................',
    '................',
  ],
  // 차트 — Dashboard tab
  chart: [
    '................',
    '................',
    '...........YY...',
    '..........YYy...',
    '..........YYY...',
    '......LL..YYY...',
    '.....LlLL.YYY...',
    '.....LLLL.YYY...',
    '.g...LLLL.YYY...',
    'gggg.LLLL.YYY...',
    'gggg.LLLL.YYY...',
    'gggg.LLLL.YYY...',
    'KKKKKKKKKKKKKK..',
    '................',
    '................',
    '................',
  ],
  // 톱니바퀴 — Settings tab
  gear: [
    '................',
    '......KK........',
    '...K..KK..K.....',
    '...KKKKKKKK.....',
    '....KKKKKK......',
    '....KKWWKK......',
    '..KKKKWWKKKK....',
    '..KKWWWWWWKK....',
    '..KKWWWWWWKK....',
    '..KKKKWWKKKK....',
    '....KKWWKK......',
    '....KKKKKK......',
    '...KKKKKKKK.....',
    '...K..KK..K.....',
    '......KK........',
    '................',
  ],
  // 종 — 알림
  bell: [
    '................',
    '.......K........',
    '......YYY.......',
    '.....YYYYY......',
    '.....YyYYY......',
    '....YYYYYYY.....',
    '....YYYYYYY.....',
    '...YYYYYYYYY....',
    '...YYYYYYYYY....',
    '..YYYYYYYYYYY...',
    '..YYYYYYYYYYY...',
    '.YYYYYYYYYYYYY..',
    '..............,.',
    '......KKK.......',
    '.......K........',
    '................',
  ],
  // 잎사귀 — 완독 toast
  leaf: [
    '................',
    '...........L....',
    '..........LLl...',
    '.........LLLL...',
    '........LLLLL...',
    '.......LLLLLL...',
    '......LLLlLLL...',
    '.....LLLLLLLL...',
    '....LLLLLLLL....',
    '...LLLLLLLL.....',
    '..LLLLLLL.......',
    '..LLLLL.........',
    '..LLT...........',
    '..T.............',
    '................',
    '................',
  ],
  // 불꽃 — Trending
  flame: [
    '................',
    '.......R........',
    '......RrR.......',
    '.....RrYrR......',
    '....RrYYYrR.....',
    '....RYYYYYR.....',
    '...RYYYYYYYR....',
    '...RYYyYYYYR....',
    '...RYYyYYYYR....',
    '....RYyyyYR.....',
    '....RrYYYrR.....',
    '.....RYYR.......',
    '......RR........',
    '................',
    '................',
    '................',
  ],
  // 시계 — Recent
  clock: [
    '................',
    '......KKKK......',
    '....KKwwwwKK....',
    '...KwwwwwwwwK...',
    '..KwwwKwwwwwwK..',
    '..KwwwKwwwwwwK..',
    '.KwwwKKKKKwwwwK.',
    '.KwwwwKwwwwwwwK.',
    '.KwwwwKwwwwwwwK.',
    '.KwwwwwwwwwwwwK.',
    '..KwwwwwwwwwwK..',
    '..KwwwwwwwwwwK..',
    '...KwwwwwwwwK...',
    '....KKwwwwKK....',
    '......KKKK......',
    '................',
  ],
  // 반짝임 — For You
  sparkle: [
    '................',
    '......Y.........',
    '......YY........',
    '......YY........',
    '....YYYYYYY.....',
    '...YYYYYYYYY....',
    '....YYYYYYY.....',
    '......YY........',
    '......YY........',
    '......Y.........',
    '...........Y....',
    '..........YY....',
    '.........YYYY...',
    '..........YY....',
    '...........Y....',
    '................',
  ],
}

export function PixelIcon({ name, className, title }: PixelIconProps) {
  const pattern = PATTERNS[name]
  if (!pattern) return null

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
          if (char === '.' || char === ',') return null
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
