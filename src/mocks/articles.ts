export interface MockArticle {
  id: string
  source: 'segye' | 'yonhap'
  externalId: string
  category: string
  categoryDisplayName: string
  slug: string
  title: string
  summary: string
  body: string
  thumbnailUrl: string
  publishedAt: string
  bodyLength: number
  estimatedReadMinutes: number
}

const longBody = (topic: string) => `
${topic}에 대한 상세한 분석과 함께, 이번 변화가 우리 일상에 어떤 영향을 미칠지 살펴보겠습니다.

전문가들은 이번 흐름이 단기적인 유행이 아닌 구조적 변화의 시작점이라고 분석합니다. 특히 한국 시장의 경우 글로벌 트렌드와는 또 다른 양상을 보이고 있어 주의 깊게 살펴볼 필요가 있습니다.

업계 관계자에 따르면, "지난 분기 대비 관련 지표가 두 배 이상 증가했으며, 이런 추세는 적어도 향후 1~2년간 지속될 것으로 보인다"고 밝혔습니다. 이는 단순히 시장 데이터의 변화를 넘어, 사용자 행동 양식의 본질적인 변화를 시사하는 것이기도 합니다.

한편, 이러한 변화가 초래할 부작용에 대한 우려의 목소리도 적지 않습니다. 특히 정보 격차의 심화, 소비자 보호 장치의 부재, 그리고 환경적 비용 등은 정책적 대응이 필요한 영역으로 지목되고 있습니다.

한국 정부도 관련 부처를 중심으로 대응 방안을 마련하고 있는 것으로 알려졌습니다. 특히 디지털 전환 가속화에 따라 발생할 수 있는 사회적 비용을 최소화하기 위한 종합적인 정책 패키지가 검토되고 있습니다.

전문가들은 "지금이 바로 균형 잡힌 정책 설계가 필요한 시점"이라며 "기술 발전과 사회적 가치를 동시에 고려한 접근이 요구된다"고 강조했습니다.

소비자 입장에서도 변화에 대한 적극적인 학습과 참여가 필요하다는 지적이 나오고 있습니다. 정보 소비 습관을 점검하고, 신뢰할 수 있는 출처에서 양질의 정보를 꾸준히 섭취하는 것이 그 어느 때보다 중요해진 시점입니다.

이번 변화가 가져올 새로운 기회와 도전을 함께 살펴보면서, 우리 모두가 더 나은 방향으로 적응해 나갈 수 있기를 기대합니다.

긴 글 읽어주셔서 감사합니다. 다음 기사에서는 관련 주제에 대한 보다 심층적인 분석을 이어가겠습니다.
`.trim()

const CATEGORY_NAMES: Record<string, string> = {
  politics: '정치',
  economy: '경제',
  society: '사회',
  it: 'IT',
  culture: '문화',
  sports: '스포츠',
}

interface SeedInput {
  category: string
  slug: string
  title: string
  summary: string
  topic: string
  publishedDaysAgo: number
}

const SEEDS: SeedInput[] = [
  {
    category: 'it',
    slug: 'ai-trend-2026-five-shifts',
    title: 'AI가 바꾸는 일상: 2026년 핵심 트렌드 5가지',
    summary: '생성형 AI 도구가 일상 업무에 깊숙이 자리 잡으며 우리 생활 방식이 근본적으로 변화하고 있습니다.',
    topic: '생성형 AI 트렌드',
    publishedDaysAgo: 0,
  },
  {
    category: 'it',
    slug: 'startup-funding-q1-2026',
    title: '1분기 한국 스타트업 투자, 작년 대비 18% 증가',
    summary: '시드~시리즈 A 단계 투자가 회복세를 보이며 AI·클라이밋 테크 분야가 주도하고 있습니다.',
    topic: '스타트업 투자',
    publishedDaysAgo: 1,
  },
  {
    category: 'economy',
    slug: 'inflation-stabilization-outlook',
    title: '한은 “하반기 물가 안정세 점차 가시화”',
    summary: '한국은행이 기준금리 동결을 결정하며 하반기 물가 안정 전망을 내놨습니다.',
    topic: '한국 경제 전망',
    publishedDaysAgo: 2,
  },
  {
    category: 'economy',
    slug: 'gen-z-consumer-trends',
    title: 'Z세대 소비 트렌드, 가성비에서 가심비로',
    summary: '20대 소비자의 구매 결정에 가치 소비와 윤리적 소비가 주요 변수로 떠오르고 있습니다.',
    topic: 'Z세대 소비 트렌드',
    publishedDaysAgo: 3,
  },
  {
    category: 'society',
    slug: 'remote-work-after-pandemic',
    title: '재택근무 4년차, 한국 직장 문화는 어떻게 바뀌었나',
    summary: '하이브리드 근무가 표준으로 자리 잡으며 사무실의 역할도 재정의되고 있습니다.',
    topic: '한국 직장 문화',
    publishedDaysAgo: 1,
  },
  {
    category: 'society',
    slug: 'urban-greening-seoul-plan',
    title: '서울시, 2030년까지 도심 녹지 30% 확대',
    summary: '서울시가 발표한 새로운 도시 계획안에는 옥상 녹화와 가로수 다양성이 핵심으로 담겨 있습니다.',
    topic: '도시 녹지 정책',
    publishedDaysAgo: 5,
  },
  {
    category: 'politics',
    slug: 'national-assembly-digital-bill',
    title: '국회, 디지털 전환 종합법 본회의 통과',
    summary: '디지털 격차 해소와 데이터 주권 강화를 위한 종합법이 여야 합의로 처리됐습니다.',
    topic: '디지털 전환 정책',
    publishedDaysAgo: 4,
  },
  {
    category: 'politics',
    slug: 'local-election-youth-voting',
    title: '지방선거 청년 투표율, 역대 최고치 경신 전망',
    summary: '청년층의 정치 참여 확대가 이번 선거의 핵심 관전 포인트로 부상했습니다.',
    topic: '청년 정치 참여',
    publishedDaysAgo: 6,
  },
  {
    category: 'culture',
    slug: 'kpop-second-decade-shift',
    title: 'K-POP 2.0, 글로벌 협업으로 확장되는 한국 음악',
    summary: '국내외 아티스트의 협업이 늘면서 K-POP의 정의가 확장되고 있습니다.',
    topic: 'K-POP의 진화',
    publishedDaysAgo: 0,
  },
  {
    category: 'culture',
    slug: 'busan-film-festival-lineup',
    title: '부산국제영화제 라인업 공개, 아시아 신인 감독 약진',
    summary: '올해 BIFF는 아시아 지역 신인 감독의 작품을 대거 초청해 다양성을 강조했습니다.',
    topic: '한국 영화 산업',
    publishedDaysAgo: 3,
  },
  {
    category: 'sports',
    slug: 'kbo-rising-stars-2026',
    title: 'KBO 리그, 올해 주목할 신예 5인',
    summary: '2026년 시즌 초반 강한 인상을 남긴 신예 선수들을 정리했습니다.',
    topic: 'KBO 신예 선수',
    publishedDaysAgo: 2,
  },
  {
    category: 'sports',
    slug: 'k-league-attendance-record',
    title: 'K리그 누적 관중, 전 시즌 대비 22% 증가',
    summary: '경기장 인프라 개선과 가족 단위 관람객 확대가 흥행을 이끌고 있습니다.',
    topic: 'K리그 흥행',
    publishedDaysAgo: 5,
  },
]

function daysAgoIso(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString()
}

export const MOCK_ARTICLES: MockArticle[] = SEEDS.map((seed, i) => {
  const body = longBody(seed.topic)
  return {
    id: String(i + 1),
    source: i % 2 === 0 ? 'segye' : 'yonhap',
    externalId: `${i % 2 === 0 ? 'seg' : 'yon'}-${String(i + 1).padStart(3, '0')}`,
    category: seed.category,
    categoryDisplayName: CATEGORY_NAMES[seed.category] ?? seed.category,
    slug: seed.slug,
    title: seed.title,
    summary: seed.summary,
    body,
    thumbnailUrl: `https://picsum.photos/seed/nf-article-${i + 1}/600/338`,
    publishedAt: daysAgoIso(seed.publishedDaysAgo),
    bodyLength: body.length,
    estimatedReadMinutes: Math.max(2, Math.round(body.length / 500)),
  }
})

export function findArticleBySlug(slug: string): MockArticle | undefined {
  return MOCK_ARTICLES.find((a) => a.slug === slug)
}

export function listArticlesByCategory(category: string): MockArticle[] {
  return MOCK_ARTICLES.filter((a) => a.category === category)
}

export function getArticlesForCategories(categories: string[], limit = 5): MockArticle[] {
  if (categories.length === 0) {
    return MOCK_ARTICLES.slice(0, limit)
  }
  const matched = MOCK_ARTICLES.filter((a) => categories.includes(a.category))
  if (matched.length >= limit) return matched.slice(0, limit)
  const filler = MOCK_ARTICLES.filter((a) => !categories.includes(a.category)).slice(
    0,
    limit - matched.length,
  )
  return [...matched, ...filler]
}
