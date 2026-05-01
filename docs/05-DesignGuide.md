# 05 — News Forest Design Guide

> **문서 상태**: v1.0 (MVP)
> **작성일**: 2026-05-01
> **참조 프롬프트**: `/docs/_prompts/05.Design.md`
> **사전 참조 문서**: `01-PRD.md`, `02-IA.md`, `03-UseCase.md`, `04-ERD.md`
> **프로젝트 룰**: `/CLAUDE.md`

---

## 1. Design System Overview

### 1.1 디자인 원칙 (Design Principles)

| # | 원칙 | 설명 |
|---|------|------|
| 1 | **Calm over Loud** | 차분한 톤, 색은 절제. 보상은 시각적 변화로 전달하되 폭발하지 않음. |
| 2 | **Reading First** | 본문 가독성 최우선. 광고·장식·UI 노이즈 최소화. |
| 3 | **Subtle Delight** | 350ms 이하의 마이크로 인터랙션. 잎사귀·씨앗 메타포로 작은 기쁨. |
| 4 | **Trustworthy Gamification** | 게임 같지만 유치하지 않음. 게임 폰트·만화 일러스트·confetti 금지. |
| 5 | **Mobile-First, Always** | 320px → 1440px 까지 자연스럽게. 데스크톱은 mobile의 확장. |

### 1.2 무드 키워드
`calm` · `playful` · `trustworthy` · `warm` · `nature` · `growth` · `habit-forming` · `light`

### 1.3 레퍼런스 톤
- **Forest (앱)** — 시각적 메타포의 단순함
- **Headspace** — 따뜻한 자연 색감, subtle delight
- **Notion** — 절제된 UI, 명료한 위계
- **Medium** — Longform 가독성

### 1.4 의도적 회피 (Anti-patterns)

| 회피 | 사유 |
|------|------|
| 🚫 Cartoon-style 마스코트 | 신뢰 톤 훼손 |
| 🚫 Confetti / 폭죽 모션 | 가벼움 → 불안정 인상 |
| 🚫 Highly saturated 색을 큰 배경으로 | 시각 피로 |
| 🚫 Comic-style 폰트 | 정보 신뢰성 ↓ |
| 🚫 강한 빨강 alert | 따뜻한 톤 위배 (CLAUDE.md §6.4) |
| 🚫 진동·강제 푸시 | 사용자 거부감 |

---

## 2. Color Palette (TailwindCSS)

### 2.1 Token 정의

> **무드**: warm cream / forest / paper-like reading. Medium · Apple Books · Kindle Paperwhite 톤.

| Token | Hex | Tailwind 키 | 용도 |
|-------|-----|------------|------|
| **primary-50** | `#E8F5E9` | `bg-primary-50` | 가장 연한 톤 (배경 강조) |
| **primary-100** | `#C8E6C9` | `bg-primary-100` | 카드 호버, 진행률 라인 배경 |
| **primary-200** | `#A5D6A7` | — | (예비) |
| **primary-300** | `#81C784` | `bg-secondary` | **Secondary** — 위젯 배경, 보조 강조 |
| **primary-500** | `#2E7D32` | `bg-primary text-primary` | **Primary** — 버튼, 강조 텍스트 |
| **primary-700** | `#1B5E20` | `text-primary-700` | 호버 active |
| **accent-500** | `#F2C94C` | `bg-accent text-accent` | **Accent (Reward)** — 포인트 badge, streak |
| **accent-100** | `#FBE9A7` | `bg-accent-100` | accent 약한 배경 |
| **bg-base** | `#F0E9D6` | `bg-background` | **Page background** — warm cream / Kindle paperwhite |
| **bg-surface** | `#FFFFFF` | `bg-surface` | 카드, 모달 (cream 위 흰 카드로 또렷한 대비) |
| **bg-muted** | `#E5DCC2` | `bg-muted` | hover · skeleton · 구분선 영역 (deeper warm tan) |
| **fg-base** | `#1F2A44` | `text-foreground` | **Body text (navy)** |
| **fg-muted** | `#5A6378` | `text-fg-muted` | Caption, metadata |
| **fg-faint** | `#8D94A4` | `text-fg-faint` | placeholder, disabled |
| **border-base** | `#D9CDB0` | `border` | 일반 경계선 (warm tan) |
| **border-strong** | `#BFB395` | `border-strong` | 강조 경계선 |
| **state-success** | `#16A34A` | `text-success` | 완독 성공 (사용 절제) |
| **state-warn** | `#D97706` | `text-warn` | 경고 (red 회피, 주황 사용) |
| **state-error** | `#B45309` | `text-error` | 오류 (강한 빨강 X — amber/brown) |

> **Note:** CLAUDE.md §4의 5개 절대 토큰(`#2E7D32`, `#81C784`, `#F2C94C`, `#F0E9D6`, `#1F2A44`)이 단일 진실 소스. 위 ramp는 토큰을 보조하는 일관 확장이며, 절대 토큰을 임의로 변경하지 않음.

### 2.2 `tailwind.config.js` 권장 설정

```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#E8F5E9",
          100: "#C8E6C9",
          200: "#A5D6A7",
          300: "#81C784",   // = secondary
          500: "#2E7D32",   // 절대 토큰
          700: "#1B5E20",
          DEFAULT: "#2E7D32",
        },
        secondary: {
          DEFAULT: "#81C784",  // 절대 토큰
        },
        accent: {
          100: "#FBE9A7",
          500: "#F2C94C",      // 절대 토큰 — Reward 의미
          DEFAULT: "#F2C94C",
        },
        background: "#F0E9D6", // 절대 토큰 (warm cream / paperwhite)
        surface:    "#FFFFFF",
        muted:      "#E5DCC2", // deeper warm tan
        foreground: "#1F2A44", // 절대 토큰 (navy)
        "fg-muted": "#5A6378",
        "fg-faint": "#8D94A4",
        border: {
          DEFAULT: "#D9CDB0",  // warm tan border
          strong:  "#BFB395",
        },
        success: "#16A34A",
        warn:    "#D97706",
        error:   "#B45309",
      },
      fontFamily: {
        sans:  ['Pretendard', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif KR"', 'serif'],
      },
      fontSize: {
        // ramp는 §3 참조
      },
      screens: {
        mobile:  "320px",
        tablet:  "768px",
        desktop: "1024px",
        wide:    "1440px",
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      keyframes: {
        leaf: {
          '0%':   { opacity: '0', transform: 'scale(0.85) translateY(8px)' },
          '60%':  { opacity: '1', transform: 'scale(1.05) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1.0) translateY(0)' },
        },
        countup: {
          '0%':   { transform: 'translateY(6px)', opacity: '0.4' },
          '100%': { transform: 'translateY(0)',   opacity: '1.0' },
        },
      },
      animation: {
        leaf:    'leaf 350ms ease-out',
        countup: 'countup 350ms ease-out',
      },
    },
  },
  plugins: [],
};
```

### 2.3 명도 대비 (WCAG 2.2 AA)

| 조합 | 비율 | 통과 |
|------|------|------|
| `foreground (#1F2A44)` on `background (#F5F1E8)` | ~14 : 1 | ✅ AAA |
| `primary (#2E7D32)` on `background` | ~5.8 : 1 | ✅ AA (텍스트) |
| `accent (#F2C94C)` on `foreground` | ~10 : 1 | ✅ AAA (badge 위 텍스트) |
| `accent (#F2C94C)` on `background` | ~1.4 : 1 | ❌ 텍스트 사용 금지 (badge 배경 only) |
| `secondary (#81C784)` on `background` | ~2.0 : 1 | ❌ 텍스트 사용 금지 (장식 only) |
| `fg-muted (#5A6378)` on `background` | ~5.5 : 1 | ✅ AA |

> **Note:** `accent` 와 `secondary` 는 텍스트 색이 아니라 **배경/장식**으로만 사용. badge 위 텍스트는 `foreground` (navy).

---

## 3. Typography Guide

### 3.1 Type Roles

| Role | Family | Size (Mobile) | Size (Desktop) | Weight | Line Height |
|------|--------|--------------|---------------|--------|-------------|
| Display | Pretendard | 28px | 36px | 700 | 1.25 |
| Heading 1 | Pretendard | 22px | 28px | 700 | 1.30 |
| Heading 2 | Pretendard | 18px | 22px | 600 | 1.35 |
| Heading 3 | Pretendard | 16px | 18px | 600 | 1.40 |
| **Body** | Pretendard | 15px | 16px | 400 | 1.55 |
| **Article body** | Pretendard **or** Noto Serif KR | 16px | 18px | 400 | **1.75** |
| Caption | Pretendard | 13px | 13px | 400 | 1.45 |
| Numeric (포인트) | Pretendard | 16~28px | 16~28px | 600 | 1.0 |

### 3.2 Article Body 가독성 정책

- 최소 16px (한국어 longform 가독 기준)
- line-height 1.7~1.75
- 한 줄 폭: 320~640px (CSS `max-width: 38rem`)
- 단락 간 간격: 1.4em
- Pretendard와 Noto Serif KR 중 사용자가 선택 가능 (Settings — Phase 2). MVP 기본은 Pretendard.

### 3.3 숫자 표시 (포인트, 카운트)

```css
.numeric {
  font-feature-settings: "tnum" 1;
  font-variant-numeric: tabular-nums;
}
```

> **Note:** CLAUDE.md §3 강제. 카운트업 시 width 흔들림 방지.

### 3.4 Font Loading

```html
<!-- Pretendard: subset variable woff2 권장 -->
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/Pretendard-Variable.woff2" crossorigin>
<style>
  @font-face {
    font-family: 'Pretendard';
    font-weight: 100 900;
    src: url('/fonts/Pretendard-Variable.woff2') format('woff2-variations');
    font-display: swap;
  }
</style>
```

---

## 4. Spacing & Radius

### 4.1 Spacing Scale (Tailwind 기본 + 커스텀)

| Token | px | 용도 |
|-------|-----|------|
| `space-1` | 4 | 아이콘 간격 |
| `space-2` | 8 | 컴포넌트 내부 |
| `space-3` | 12 | 컴포넌트 간 |
| `space-4` | 16 | 섹션 내 |
| `space-6` | 24 | 섹션 간 |
| `space-8` | 32 | 큰 구분 |
| `space-12` | 48 | 페이지 padding (desktop) |

### 4.2 Border Radius

| Token | px | 용도 |
|-------|-----|------|
| `rounded-sm` | 4 | 작은 chip |
| `rounded-md` | 8 | Button |
| `rounded-lg` | 12 | Card |
| `rounded-xl` | 16 | Modal, large card |
| `rounded-full` | 9999 | Badge, avatar |

### 4.3 Shadow

| Token | 값 | 용도 |
|-------|-----|------|
| `shadow-soft` | `0 1px 2px rgba(31,41,55,.04), 0 4px 12px rgba(31,41,55,.06)` | 일반 card |
| `shadow-lift` | `0 4px 8px rgba(31,41,55,.06), 0 16px 32px rgba(31,41,55,.10)` | 호버, modal |
| `shadow-none` | none | flat card |

> **Note:** Shadow는 무거우면 톤 깨짐. 위 두 단계만 사용.

---

## 5. Layout Components

### 5.1 Topbar

**구조 (모든 플랫폼 공통, sticky top)**
```
┌──────────────────────────────────────────┐
│ [🌱 News Forest]   [search?]    [12P 🔔]│
└──────────────────────────────────────────┘
```

| 영역 | Mobile | Desktop |
|------|--------|---------|
| 좌측 | 로고 (24px) + 텍스트 | 로고 + 검색바 (240px) |
| 우측 | PointBadge + 알림 | PointBadge + 알림 + Settings 아이콘 |
| 높이 | 56px | 64px |
| 배경 | `bg-surface` + `border-b border-base` | 동일 |

### 5.2 Mobile Bottom Nav

**구조 (mobile only, fixed bottom)**
```
┌──────────────────────────────────────────┐
│   🌱 Home    🌳 Forest    📊 Dashboard   │
└──────────────────────────────────────────┘
```

| 항목 | 사양 |
|------|------|
| 높이 | 64px (safe-area-inset-bottom 고려) |
| 활성 상태 | icon + label 모두 `text-primary` |
| 비활성 | `text-fg-muted` |
| 트랜지션 | 색만 변화, 200ms ease |
| 표시 영역 | tablet 미만 (`< md`) |

### 5.3 Desktop Sidebar (left, 240px)

| 항목 | 사양 |
|------|------|
| 폭 | 240px (collapsed: 64px — Phase 2) |
| 메뉴 | Home / Articles / Forest / Dashboard / Quests(P2) / Settings |
| 활성 표시 | 좌측 4px primary 라인 + `bg-primary-50` |
| 표시 영역 | desktop 이상 (`>= lg`) |

### 5.4 ArticleCard

**구조**
```
┌─────────────────────────────┐
│ [thumbnail 16:9]            │
├─────────────────────────────┤
│ [Category chip]             │
│ Title (Heading 3)           │
│ Summary line clamp 2        │
│                             │
│ ⏱ 3분 · 어제                │
└─────────────────────────────┘
```

| 항목 | 사양 |
|------|------|
| Container | `rounded-lg shadow-soft bg-surface` |
| Padding | `p-4` (Mobile) / `p-5` (Desktop) |
| 썸네일 | 16:9, `rounded-md`, fallback: `https://picsum.photos/600/338` |
| 카테고리 칩 | `text-xs text-primary-700 bg-primary-50 rounded-full px-2 py-0.5` |
| Hover (Desktop) | `shadow-lift transition` |
| Tap (Mobile) | `active:scale-[0.99]` |

### 5.5 TreeWidget

**구조**
```
┌──────────────────────────┐
│   (시각적 나무 SVG)      │
│                          │
│   "🌱 새싹"              │
│   누적 78 P              │
│                          │
│   ░░░░░░░░░░░░░░░░░░░░  │ ← 다음 단계까지 진행률
│   다음 단계까지 122 P    │
└──────────────────────────┘
```

| Variant | 위치 | 크기 |
|---------|------|------|
| `compact` | Topbar 옆, Home 우측 rail | 64×64 SVG |
| `medium` | Home 상단 | 200×200 |
| `large` | `/forest/me` 메인 | 320×320 (모바일) / 480×480 (데스크톱) |

**stage 별 SVG 자산** (단순 라인 일러스트, color: `primary`):
- SEED: 둥근 점 + 작은 새싹 끝
- SPROUT: 짧은 줄기 + 잎 2장
- TREE: 줄기 + 잎 5~7장 + 가지
- FOREST: 나무 3그루 작게 배치

### 5.6 GrowthGauge

**구조 (TreeWidget 내 사용)**
```
░░░░░░░░░░░░░░░░░░  78%
```

- 배경: `bg-primary-100`
- 채워진 부분: `bg-primary-500`, `transition-[width] duration-500 ease-out`
- 높이: 6px (compact) / 8px (medium+)
- 텍스트: 우측에 `% 또는 'n / m P'`

### 5.7 PointBadge

**구조** (Topbar 우측, Pill)
```
┌─────────┐
│ 🪙 78 P │
└─────────┘
```

| 항목 | 사양 |
|------|------|
| 배경 | `bg-accent-100` |
| 텍스트 | `text-foreground numeric` |
| 형태 | `rounded-full px-3 py-1 text-sm` |
| 카운트업 | `animate-countup` 350ms |

### 5.8 ReadingProgressBar (Article detail 상단)

| 항목 | 사양 |
|------|------|
| 위치 | Topbar 바로 아래 sticky |
| 두께 | 2px |
| 배경 | `bg-primary-100` |
| 진행 | `bg-primary-500` (transform: scaleX(progress)) |
| Tab blur 시 | opacity 0.4 |
| 완독 직후 | 100%로 머무른 후 fade out 600ms |

### 5.9 ForestMapCard (다른 사용자 카드)

```
┌────────────────────┐
│   (small tree SVG) │
│   푸른잎사귀-1234   │
│   🌳 나무 단계      │
└────────────────────┘
```

| 항목 | 사양 |
|------|------|
| 크기 | 정사각형 grid item (Mobile 2열, Desktop 4열) |
| 컨테이너 | `bg-surface rounded-lg p-3 hover:shadow-lift` |
| 클릭 | `/forest/u/:publicId` 이동 |

### 5.10 QuestCard (Phase 2)

```
┌──────────────────────────┐
│ Daily · 오늘의 미션       │
│ IT 기사 3개 읽기          │
│ ▣▣▣ 1/3                  │
│                +50 P     │
└──────────────────────────┘
```

> **Note:** MVP에서는 디자인만 정의, 구현은 Phase 2.

### 5.11 Button

| Variant | Background | Text | 사용 |
|---------|-----------|------|------|
| `primary` | `bg-primary` | white | 주요 CTA (시작하기, 물 주기) |
| `secondary` | `bg-secondary` | `text-primary-700` | 보조 |
| `ghost` | transparent | `text-foreground` | 텍스트 link 풍 |
| `danger` (사용 절제) | `bg-error` | white | 데이터 초기화 등 (warn 톤) |

| 사이즈 | Padding | Font |
|--------|---------|------|
| sm | px-3 py-1.5 | 13px |
| md | px-4 py-2 | 15px (default) |
| lg | px-6 py-3 | 16px |

### 5.12 Toast (포인트 알림)

```
┌──────────────────────────────┐
│ 🍃 기사 한 편 읽었어요. +10P │
└──────────────────────────────┘
```

| 항목 | 사양 |
|------|------|
| 위치 | Bottom (Mobile, `bottom-20`) / Top-Right (Desktop, `top-20 right-6`) |
| 배경 | `bg-foreground/95 text-white` |
| 형태 | `rounded-full px-4 py-2 shadow-lift` |
| Auto-dismiss | 3s |

---

## 6. Page Implementations

### 6.1 Landing (`/`) — SEO + 신규 유입

| 항목 | 사양 |
|------|------|
| **Core purpose** | 컨셉 소개 + "지금 시작하기" CTA |
| **Key components** | Hero + 3-step 시각화 + Sample article + CTA 버튼 |
| **Layout (Mobile)** | 단일 컬럼 세로 스크롤, hero 80vh |
| **Layout (Desktop)** | 중앙 정렬 max-w-5xl, hero + 3-col feature grid |
| **이미지** | https://picsum.photos/1200/600 (hero) |
| **CTA 버튼** | "내 숲 시작하기" → onboarding |

### 6.2 Onboarding (`/onboarding/*`) — 3-step

| Step | 콘텐츠 |
|------|--------|
| 1. Welcome | 큰 씨앗 일러스트 + "당신의 뉴스 습관, 숲이 됩니다" + 다음 |
| 2. Concept | Reading→Tree 시각 다이어그램 + 다음 |
| 3. Categories | 6개 카테고리 칩 grid (≥1 선택) + "시작하기" |

| 항목 | 사양 |
|------|------|
| Layout | 단일 컬럼 중앙 정렬, max-w-md |
| Progress dots | 3개 (`primary` / `border` 색) |
| 모션 | 페이지 전환 fade 200ms |

### 6.3 Home (`/home`)

**구조 (Mobile)**
```
┌────────────────────────┐
│ Topbar          [78P]  │
├────────────────────────┤
│  [TreeWidget medium]   │
│  새싹 · 78P            │
├────────────────────────┤
│  For You               │
│  ┌──┐ ┌──┐ ┌──┐        │ ← 가로 스크롤 옵션
│  └──┘ └──┘ └──┘        │
├────────────────────────┤
│  Trending              │
│  [ArticleCard] (full)  │
│  [ArticleCard]         │
├────────────────────────┤
│  Recent                │
│  ...                   │
├────────────────────────┤
│  Categories            │
│  [정치][경제][사회]    │
│  [IT][문화][스포츠]    │
├────────────────────────┤
│ [Home][Forest][Dash]   │
└────────────────────────┘
```

**구조 (Desktop)**
```
┌─────┬──────────────────┬───────┐
│Side │ Recommendation   │ Tree  │
│ bar │ (3-col grid)     │widget │
│     │                  │       │
└─────┴──────────────────┴───────┘
```

| State | 표현 |
|-------|------|
| Loading | ArticleCard skeleton 5개 + TreeWidget skeleton |
| Empty (첫 방문) | "첫 기사를 골라볼까요?" + 카테고리 6개 |
| Error | warm tone + retry |

### 6.4 Article Detail (`/articles/:category/:slug`)

**구조 (Mobile)**
```
┌────────────────────────┐
│ Topbar                 │
│ [ReadingProgressBar]   │ ← sticky 2px
├────────────────────────┤
│ [Category chip]        │
│ # Title (Heading 1)    │
│ Author · 발행일        │
│                        │
│ [thumbnail 16:9]       │
│                        │
│ Body (Pretendard 16px) │
│ 단락 단락 단락          │
│ ...                    │
│                        │
│ ─── 완독 ───           │
│ "기사 한 편 읽었어요"  │
│                        │
│ ─── Related ───        │
│ [Card] [Card]          │
└────────────────────────┘
```

| 항목 | 사양 |
|------|------|
| 본문 폭 | max-w-2xl 중앙 정렬 |
| 폰트 | 16px / 1.75 / Pretendard (Setting toggle: Noto Serif KR) |
| 광고 | 0개 (MVP) |
| 완독 모션 | leaf 350ms 1회 |
| 완독 후 | 진행률 바 100% → fade out 600ms |

### 6.5 Forest — `/forest/me`

| 항목 | 사양 |
|------|------|
| 메인 | TreeWidget large (320~480px) 중앙 |
| 하위 | GrowthGauge + 누적 P + 단계 표시 |
| 추가 섹션 | 최근 완독 5건 (ArticleCard compact) |

### 6.6 Forest — `/forest/explore`

| 항목 | 사양 |
|------|------|
| Header | "다른 숲 둘러보기" |
| Sub-tabs | Random / Top / Recent |
| Grid | Mobile 2col, Tablet 3col, Desktop 4col |
| Card | ForestMapCard |
| 무한스크롤 | TanStack Query infinite |

### 6.7 Forest — `/forest/u/:publicId`

| 항목 | 사양 |
|------|------|
| 메인 | TreeWidget large (readonly) + 닉네임 + 단계 |
| CTA | "🚿 물 주기" Button (24h 1회 disabled 처리) |
| 자기 자신일 경우 | "내 숲" → `/forest/me` redirect |

### 6.8 Dashboard (`/dashboard`)

**구조**
```
┌────────────────────────┐
│ 누적 포인트             │
│ [78 P] (numeric large)  │
├────────────────────────┤
│ StatCard grid (2x2)    │
│ ┌──┐┌──┐               │
│ │읽│ │7 │              │
│ │은│ │일│              │
│ │글│ │스│              │
│ └──┘└──┘               │
│ ┌──┐┌──┐               │
│ │평│ │완│              │
│ │균│ │독│              │
│ │분│ │율│              │
│ └──┘└──┘               │
├────────────────────────┤
│ ActivityChart (7-day)  │
│  ▁▂▅▃▆▇▄              │
├────────────────────────┤
│ 최근 완독 history      │
│ [ArticleCard compact]  │
└────────────────────────┘
```

### 6.9 Settings (`/settings`)

| 섹션 | 항목 |
|------|------|
| 알림 | (Phase 2) 푸시 옵션 |
| 데이터 | 데이터 초기화 (PIPA 권리, 확인 모달 필수) |
| 정보 | About, Privacy Policy, Terms |

---

## 7. Interaction Patterns

### 7.1 Article Reading Progress

| 단계 | 효과 |
|------|------|
| 페이지 진입 | progress bar 0%, dwell timer 시작 |
| Scroll | bar `transform: scaleX(p)` linear |
| Tab blur | bar opacity 0.4 + timer pause |
| Tab focus | opacity 복원 + timer resume |
| 90% + 30s | leaf 350ms 모션 1회 + Toast + countup |
| 완독 후 | bar 100% → 600ms fade out |

### 7.2 Point Earning Feedback

```
1. PointBadge 숫자 카운트up: 78 → 88 (350ms ease-out)
2. Badge 배경: 0.6초간 pulse (subtle)
3. Toast: "🍃 기사 한 편 읽었어요. +10P" (3s)
```

> **Note:** Confetti, 효과음, vibrate 모두 금지.

### 7.3 Tree Growth Transition

| from → to | 모션 |
|-----------|------|
| Seed → Sprout | TreeWidget cross-fade 350ms + scale 1.05→1.0 |
| Sprout → Tree | 동일 |
| Tree → Forest | 500ms (마지막 단계 강조) + glow 1회 (primary-100) |

### 7.4 Watering Interaction

```
1. 버튼 tap
2. 물방울 SVG 1회 떨어지는 애니메이션 (300ms)
3. 행위자 PointBadge +2 카운트업
4. 버튼 disabled 24h ("내일 다시 주세요" tooltip)
```

### 7.5 Recommendation Refresh

| 플랫폼 | 트리거 | 인디케이터 |
|--------|--------|----------|
| Mobile | Pull-to-refresh | 잎사귀 회전 spinner |
| Desktop | "새로고침" 버튼 | 버튼 내 spinner |

### 7.6 Empty / Loading / Error States

#### Empty
```
┌────────────────────────┐
│      (씨앗 SVG)        │
│  아직 씨앗이 심어지지   │
│  않았어요               │
│  [첫 기사 둘러보기]    │
└────────────────────────┘
```
- 톤: 격려, 자연 메타포
- 색: `text-foreground` + small caption `text-fg-muted`

#### Loading (Skeleton)
- 색: `bg-muted` + shimmer (subtle, opacity 0.6 → 1.0 → 0.6 / 1.5s)
- 절대 spinner overlay 사용 X (전체 페이지)

#### Error
```
┌────────────────────────┐
│      (낙엽 SVG)         │
│  잠시 문제가 있었어요   │
│  다시 시도해볼까요?     │
│  [다시 시도]            │
└────────────────────────┘
```
- 색: `text-warn` (amber, **red 금지**)
- CTA: 명확한 retry

---

## 8. Iconography & Imagery

### 8.1 아이콘
- 라이브러리: **Lucide Icons** (line, 1.5 stroke)
- 색: 컨텍스트에 따라 `text-foreground`, `text-fg-muted`, 또는 `text-primary`
- 크기: 16 / 20 / 24px

### 8.2 일러스트 (씨앗·새싹·나무·낙엽)
- 스타일: 단색(`primary`) 라인 일러스트, fill 최소
- 표현: 추상적 (디테일 ↓)
- 회피: 표정 있는 캐릭터, 만화체

### 8.3 이미지 placeholder
| 용도 | URL |
|------|-----|
| Hero | `https://picsum.photos/1200/600` |
| Article 썸네일 | `https://picsum.photos/600/338` |
| 정사각형 (Forest card) | `https://picsum.photos/300/300` |

---

## 9. Motion & Animation

### 9.1 표준 timing

| Easing | 사용 |
|--------|------|
| `ease-out` (default) | 진입, 보상 모션 |
| `ease-in-out` | 트랜지션 |
| `linear` | 진행률 (scaleX) |

### 9.2 표준 duration

| Duration | 사용 |
|----------|------|
| 150ms | hover, tap |
| 200ms | 페이지 fade |
| 300~350ms | 잎사귀, countup, 일반 트랜지션 |
| 500ms | Tree → Forest stage 변경 (강조) |
| 600ms | 완독 후 progress bar fade out |
| > 800ms | **사용 X** (느려서 답답함) |

### 9.3 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

> **Note:** 모션 비활성 시에도 시각적 피드백은 유지 (예: leaf 모션 → 정적 leaf 아이콘 변경).

---

## 10. Accessibility (WCAG 2.2 + KWCAG 2.2)

| 항목 | 정책 |
|------|------|
| 명도 대비 | 본문 ≥ 4.5:1 (AA), 큰 텍스트 ≥ 3:1 |
| 키보드 | 모든 interactive 요소 Tab 순회, focus ring 명확 (`ring-2 ring-primary ring-offset-2`) |
| 스크린리더 | semantic HTML (`<article>`, `<nav>`, `<main>`, `<aside>`) + ARIA label 보조 |
| Article 본문 | 최소 16px, line-height 1.7+ |
| Reduced motion | §9.3 |
| Skip-to-content | Topbar 다음 hidden link, Tab 시 visible |
| Touch target | ≥ 44×44px (Mobile) |
| Color-only 정보 금지 | 카테고리 칩은 색 + 텍스트 둘 다 |

---

## 11. Component States Table

| 컴포넌트 | Default | Hover | Active / Focus | Disabled | Loading |
|---------|---------|-------|----------------|----------|---------|
| Button-primary | `bg-primary` | `bg-primary-700` | ring-2 ring-primary | opacity 0.5 | spinner inside |
| Button-secondary | `bg-secondary` | `bg-primary-300` | ring-2 | opacity 0.5 | spinner |
| ArticleCard | shadow-soft | shadow-lift + `-translate-y-0.5` | ring-2 | — | skeleton |
| TreeWidget | static SVG | (스토리북에서만 hover) | — | — | gray skeleton |
| PointBadge | bg-accent-100 | (변화 X) | — | — | — |
| Bottom nav 항목 | text-fg-muted | text-foreground | text-primary | — | — |
| 입력 필드 (Phase 2) | border-base | border-strong | ring-2 ring-primary | bg-muted | — |

---

## 12. Dark Mode (Phase 2 Only — 정의만)

| Token | Light | Dark (Phase 2) |
|-------|-------|----------------|
| background | `#F5F1E8` | `#1A1814` |
| surface | `#FFFFFF` | `#23211C` |
| foreground | `#1F2A44` | `#E8E5DD` |
| primary | `#2E7D32` | `#66BB6A` |
| secondary | `#81C784` | `#4CAF50` |
| accent | `#F2C94C` | `#E6B83C` |

> **MVP에서 dark mode UI는 구현하지 않음**. Tailwind `dark:` variant도 작성하지 않음. 위 표는 Phase 2 reference only.

---

## 13. Sample Visual Direction (Image References)

| 화면 | 톤 reference 이미지 |
|------|--------------------|
| Hero | https://picsum.photos/seed/forest1/1200/600 |
| Onboarding 일러스트 | (실제 디자이너 작업 — placeholder 단순 SVG) |
| Article 썸네일 fallback | https://picsum.photos/seed/article-default/600/338 |
| Forest map card | https://picsum.photos/seed/forest-card/300/300 |

---

## 14. 개발 친화 가이드

### 14.1 컴포넌트 구현 우선순위 (코드 단계용)

| 순서 | 컴포넌트 |
|-----|--------|
| 1 | Button, PointBadge, Topbar, BottomNav |
| 2 | ArticleCard, TreeWidget(compact, medium, large), GrowthGauge |
| 3 | ReadingProgressBar, Toast |
| 4 | ForestMapCard, StatCard |
| 5 | Layout (Topbar+BottomNav | Topbar+Sidebar) |
| 6 | Page composition (Home → Article → Forest → Dashboard) |
| 7 | (Phase 2) QuestCard, NotificationBell |

### 14.2 폴더 구조 권장

```
src/
├── styles/         # tailwind config 외 global css
├── components/
│   ├── ui/         # Button, Toast 등 atomic
│   ├── article/    # ArticleCard, ReadingProgressBar
│   ├── tree/       # TreeWidget, GrowthGauge
│   └── layout/     # Topbar, BottomNav, Sidebar
├── pages/
│   ├── home/
│   ├── article/
│   ├── forest/
│   └── dashboard/
├── hooks/
├── stores/         # Zustand
├── lib/            # api client, utils
└── App.tsx
```

### 14.3 Tailwind 사용 가이드라인

- HEX 직접 사용 금지 (token만 사용)
- `text-xs / text-sm / text-base` 등 scale 사용
- 동적 클래스명 X (Tailwind purge가 못 잡음): `bg-primary-${level}` 같은 패턴 회피
- 길어진 className은 `clsx` 또는 컴포넌트 분리

---

## 15. 정합성 검증

### 15.1 vs `01-PRD.md`

| 항목 | PRD | DesignGuide | 일치 |
|------|-----|-------------|------|
| 차분한 게이미피케이션 톤 | §1.4, §11 | §1, §1.4 | ✅ |
| Pretendard / Noto Serif KR | §9 | §3 | ✅ |
| 잎사귀 모션 350ms | §11 | §7.1, §9.2 | ✅ |
| 광고 0 (MVP) | §7 | §6.4 (Article 광고 0) | ✅ |

### 15.2 vs `02-IA.md`

| 항목 | IA | DesignGuide | 일치 |
|------|----|----|------|
| Mobile Topbar+Bottom / Desktop Topbar+Sidebar | §4.1, §4.2 | §5.1, §5.2, §5.3, §6 | ✅ |
| 핵심 페이지 6종 | §5.1 | §6 (모두 정의) | ✅ |
| Empty / Loading / Error 톤 | §8 | §7.6 | ✅ |
| Reading progress 2px sticky | §7.1 | §5.8 | ✅ |
| Watering 24h 1회 | §7.4 | §7.4 (버튼 disabled) | ✅ |

### 15.3 vs `03-UseCase.md`

| 항목 | UseCase | DesignGuide | 일치 |
|------|---------|-------------|------|
| Article 90%+30s 검증 시각 | UC-05 §8.7 | §7.1 | ✅ |
| Tree 4단계 모션 | UC-06 §9.4 | §7.3 | ✅ |
| Watering 모션 | UC-07 §10.4 | §7.4 | ✅ |
| Empty/Error 자연 메타포 | §21 | §7.6 | ✅ |
| Reduced motion 존중 | UC-04 §7.6 | §9.3 | ✅ |

### 15.4 vs `04-ERD.md`

| 항목 | ERD | DesignGuide | 일치 |
|------|-----|-------------|------|
| 카테고리 6종 표시명 | §3.2 seed | §6.2 onboarding 카테고리 칩 | ✅ |
| Tree stage display_name (씨앗/새싹/나무/숲) | §3.7 seed | §5.5 SVG asset 매핑 | ✅ |
| public_id URL 노출 | §3.1 | §6.7 `/forest/u/:publicId` | ✅ |

### 15.5 vs `CLAUDE.md`

| 항목 | CLAUDE.md | DesignGuide | 일치 |
|------|-----------|-------------|------|
| 절대 토큰 5종 (#2E7D32 / #81C784 / #F2C94C / #F5F1E8 / #1F2A44) | §4 | §2.1 | ✅ |
| Pretendard / Noto Serif KR / tabular-nums | §3 | §3.1, §3.3 | ✅ |
| Light only MVP, Dark Phase 2 | §3 | §12 (정의만) | ✅ |
| Breakpoints (320/768/1024/1440) | §4 | §2.2, 페이지별 | ✅ |
| 게이미피케이션이지만 유치하지 않음 | §6.4 | §1.4 anti-patterns | ✅ |

---

## 끝맺음

이 Design Guide는 News Forest MVP의 **시각 디자인 시스템 + 컴포넌트 + 페이지 구성 + 인터랙션 + 접근성** 을 정의합니다.

`/docs/01~05` 5개 문서가 모두 완성되었으므로, 다음 단계는 **CLAUDE.md §5.3 코드 구현 워크플로우** 에 따라 5개 문서를 통합 요약하고 작은 단위로 쪼갠 구현 계획을 사용자에게 보여드린 후 코드 작업을 시작합니다.
