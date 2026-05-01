import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const longBody = (topic) => `
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

const SEEDS = [
  // Politics (6)
  { category: 'politics', slug: 'national-assembly-digital-bill', title: '국회, 디지털 전환 종합법 본회의 통과', summary: '디지털 격차 해소와 데이터 주권 강화를 위한 종합법이 여야 합의로 처리됐습니다.', topic: '디지털 전환 정책', daysAgo: 4 },
  { category: 'politics', slug: 'local-election-youth-voting', title: '지방선거 청년 투표율, 역대 최고치 경신 전망', summary: '청년층의 정치 참여 확대가 이번 선거의 핵심 관전 포인트로 부상했습니다.', topic: '청년 정치 참여', daysAgo: 6 },
  { category: 'politics', slug: 'regional-balance-policy-2026', title: '정부, 지역균형발전 신규 정책 발표', summary: '수도권 집중 완화를 위한 6대 광역권 거점 도시 육성 방안이 제시됐습니다.', topic: '지역균형발전', daysAgo: 1 },
  { category: 'politics', slug: 'korea-japan-summit-regular', title: '외교부 "한일 정상회담 정례화 방안 추진"', summary: '한일 양국이 연 1회 이상 정상회담을 정례화하는 방향으로 논의를 진행 중입니다.', topic: '한일 외교 관계', daysAgo: 3 },
  { category: 'politics', slug: 'budget-review-2027', title: '국회 예산결산위, 내년 추경예산 본격 심사 착수', summary: '복지·청년·기후 분야에 대한 증액 요구가 주요 쟁점으로 부상했습니다.', topic: '예산 심사', daysAgo: 2 },
  { category: 'politics', slug: 'constitutional-court-hearing', title: '헌법재판소, 새 헌법재판관 후보 인사청문회 일정 확정', summary: '신임 헌법재판관 후보의 인사청문회가 다음 주 진행될 예정입니다.', topic: '사법부 인사', daysAgo: 5 },

  // Economy (6)
  { category: 'economy', slug: 'inflation-stabilization-outlook', title: '한은 "하반기 물가 안정세 점차 가시화"', summary: '한국은행이 기준금리 동결을 결정하며 하반기 물가 안정 전망을 내놨습니다.', topic: '한국 경제 전망', daysAgo: 2 },
  { category: 'economy', slug: 'gen-z-consumer-trends', title: 'Z세대 소비 트렌드, 가성비에서 가심비로', summary: '20대 소비자의 구매 결정에 가치 소비와 윤리적 소비가 주요 변수로 떠오르고 있습니다.', topic: 'Z세대 소비 트렌드', daysAgo: 3 },
  { category: 'economy', slug: 'q1-export-semiconductor', title: '1분기 한국 수출 반도체 회복세에 흑자 전환', summary: '메모리 반도체 단가 회복으로 수출액이 작년 대비 12% 증가했습니다.', topic: '한국 수출', daysAgo: 1 },
  { category: 'economy', slug: 'real-estate-divergence', title: '부동산 시장, 전세가 상승 vs 매매가 보합 양극화', summary: '전세 수요는 늘어나는 반면 매매 시장은 관망세가 지속되는 양상입니다.', topic: '부동산 시장', daysAgo: 5 },
  { category: 'economy', slug: 'kospi-3000-recovery', title: '코스피 3,000선 회복 후 횡보세 지속', summary: '대형주 중심 반등 후 외국인 매수세는 둔화된 모습입니다.', topic: '주식 시장', daysAgo: 0 },
  { category: 'economy', slug: 'sme-digital-grant-expansion', title: '정부, 중소기업 디지털 전환 지원 예산 30% 확대', summary: 'SaaS 도입과 클라우드 마이그레이션 비용을 직접 보조하는 방식이 신설됐습니다.', topic: '중소기업 정책', daysAgo: 4 },

  // Society (6)
  { category: 'society', slug: 'remote-work-after-pandemic', title: '재택근무 4년차, 한국 직장 문화는 어떻게 바뀌었나', summary: '하이브리드 근무가 표준으로 자리 잡으며 사무실의 역할도 재정의되고 있습니다.', topic: '한국 직장 문화', daysAgo: 1 },
  { category: 'society', slug: 'urban-greening-seoul-plan', title: '서울시, 2030년까지 도심 녹지 30% 확대', summary: '서울시가 발표한 새로운 도시 계획안에는 옥상 녹화와 가로수 다양성이 핵심으로 담겨 있습니다.', topic: '도시 녹지 정책', daysAgo: 5 },
  { category: 'society', slug: 'single-household-policy', title: '1인 가구 30% 시대, 정책 패러다임 전환 시급', summary: '4인 가족 중심 설계에서 벗어난 1인 가구 친화 주거·복지 모델이 논의되고 있습니다.', topic: '1인 가구 정책', daysAgo: 3 },
  { category: 'society', slug: 'youth-mental-health-school', title: '청소년 정신건강, 학교 상담 인력 2배로 확충', summary: '교육부와 보건복지부가 합동으로 학교 상담 시스템 강화 방안을 발표했습니다.', topic: '청소년 정신건강', daysAgo: 2 },
  { category: 'society', slug: 'rural-revival-young', title: '지방소멸 위기, 청년 귀향 지원 정책 효과 분석', summary: '주거·창업 지원 통합 프로그램으로 청년 정착률이 35% 상승했습니다.', topic: '지방소멸 대응', daysAgo: 6 },
  { category: 'society', slug: 'kiosk-accessibility-standard', title: '고령자 디지털 격차 해소, 키오스크 표준화 본격화', summary: '음성 안내·큰 글씨 모드 등을 의무화하는 표준안이 마련됐습니다.', topic: '디지털 접근성', daysAgo: 4 },

  // IT (6)
  { category: 'it', slug: 'ai-trend-2026-five-shifts', title: 'AI가 바꾸는 일상: 2026년 핵심 트렌드 5가지', summary: '생성형 AI 도구가 일상 업무에 깊숙이 자리 잡으며 우리 생활 방식이 근본적으로 변화하고 있습니다.', topic: '생성형 AI 트렌드', daysAgo: 0 },
  { category: 'it', slug: 'startup-funding-q1-2026', title: '1분기 한국 스타트업 투자, 작년 대비 18% 증가', summary: '시드~시리즈 A 단계 투자가 회복세를 보이며 AI·클라이밋 테크 분야가 주도하고 있습니다.', topic: '스타트업 투자', daysAgo: 1 },
  { category: 'it', slug: 'enterprise-genai-adoption', title: '국내 주요 IT기업, 생성형 AI 사내 도구 도입 본격화', summary: '코드 작성 보조부터 회의록 자동화까지 사내 워크플로우가 빠르게 변하고 있습니다.', topic: '엔터프라이즈 AI', daysAgo: 3 },
  { category: 'it', slug: 'quantum-computing-korea', title: '양자컴퓨터 상용화 가시화, 국내 연구진 핵심 부품 개발', summary: 'KAIST 연구팀이 큐비트 안정화에 핵심적인 새 소재를 개발했습니다.', topic: '양자 컴퓨팅', daysAgo: 5 },
  { category: 'it', slug: 'cybersecurity-integrated-response', title: '사이버보안 위협 증가, 정부 통합 대응체계 마련', summary: '랜섬웨어 피해 신고 건수가 작년 대비 60% 증가하며 통합 대응 필요성이 부각됐습니다.', topic: '사이버 보안', daysAgo: 2 },
  { category: 'it', slug: 'robotics-manufacturing-shift', title: '로보틱스 산업, 한국 제조업 패러다임 전환 가속', summary: '협동 로봇 도입이 중소 제조사 중심으로 빠르게 확산되고 있습니다.', topic: '로보틱스', daysAgo: 4 },

  // Culture (6)
  { category: 'culture', slug: 'kpop-second-decade-shift', title: 'K-POP 2.0, 글로벌 협업으로 확장되는 한국 음악', summary: '국내외 아티스트의 협업이 늘면서 K-POP의 정의가 확장되고 있습니다.', topic: 'K-POP의 진화', daysAgo: 0 },
  { category: 'culture', slug: 'busan-film-festival-lineup', title: '부산국제영화제 라인업 공개, 아시아 신인 감독 약진', summary: '올해 BIFF는 아시아 지역 신인 감독의 작품을 대거 초청해 다양성을 강조했습니다.', topic: '한국 영화 산업', daysAgo: 3 },
  { category: 'culture', slug: 'national-museum-digital-2', title: '국립박물관, 디지털 전시 시즌 2 시작', summary: 'AR·VR 기술을 활용한 몰입형 전시가 새 시즌으로 돌아왔습니다.', topic: '디지털 전시', daysAgo: 5 },
  { category: 'culture', slug: 'webtoon-ip-expansion', title: '웹툰 IP 글로벌 확산, 드라마·게임으로 다각화', summary: '주요 플랫폼의 웹툰 원작 콘텐츠가 글로벌 시장에서 성과를 내고 있습니다.', topic: '웹툰 IP', daysAgo: 1 },
  { category: 'culture', slug: 'korean-literature-translation', title: '한국 문학 번역지원사업, 올해 50개 작품 선정', summary: '한국문학번역원이 2026년 지원 대상 작품을 발표했습니다.', topic: '한국 문학', daysAgo: 4 },
  { category: 'culture', slug: 'regional-arts-foundation-grant', title: '지역 문화재단, 청년 예술가 창작 지원 본격 확대', summary: '소외 지역 청년 예술가를 위한 창작 지원 프로그램이 2배 규모로 늘어났습니다.', topic: '청년 예술가 지원', daysAgo: 2 },

  // Sports (6)
  { category: 'sports', slug: 'kbo-rising-stars-2026', title: 'KBO 리그, 올해 주목할 신예 5인', summary: '2026년 시즌 초반 강한 인상을 남긴 신예 선수들을 정리했습니다.', topic: 'KBO 신예 선수', daysAgo: 2 },
  { category: 'sports', slug: 'k-league-attendance-record', title: 'K리그 누적 관중, 전 시즌 대비 22% 증가', summary: '경기장 인프라 개선과 가족 단위 관람객 확대가 흥행을 이끌고 있습니다.', topic: 'K리그 흥행', daysAgo: 5 },
  { category: 'sports', slug: 'national-soccer-friendlies', title: '한국 축구 국가대표, 친선전 2연승으로 평가전 성공', summary: '월드컵 예선을 앞두고 가진 평가전에서 좋은 결과를 거뒀습니다.', topic: '축구 국가대표', daysAgo: 1 },
  { category: 'sports', slug: 'gangwon-winter-olympics', title: '동계올림픽 유치 검토, 강원도 또다시 도전', summary: '평창 이후 이어지는 동계 스포츠 인프라 활용 방안이 논의되고 있습니다.', topic: '동계올림픽 유치', daysAgo: 6 },
  { category: 'sports', slug: 'esports-5tn-industry', title: 'e스포츠 산업 5조원 시대, 정부 종합 지원 방안 발표', summary: '문화체육관광부가 e스포츠 종합 지원 5개년 계획을 공개했습니다.', topic: 'e스포츠', daysAgo: 0 },
  { category: 'sports', slug: 'marathon-1m-runners', title: '마라톤 인구 100만 시대, 도시별 대회 인프라 정비', summary: '러닝 열풍으로 도시별 마라톤 대회 수요가 폭발적으로 증가하고 있습니다.', topic: '마라톤 문화', daysAgo: 3 },
]

function daysAgoIso(days) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString()
}

async function main() {
  console.log(`Seeding ${SEEDS.length} articles...`)

  // Get category id map
  const cats = await pool.query('SELECT id, code FROM article_category')
  const catMap = new Map(cats.rows.map((r) => [r.code, r.id]))

  let inserted = 0
  let skipped = 0
  for (let i = 0; i < SEEDS.length; i++) {
    const seed = SEEDS[i]
    const catId = catMap.get(seed.category)
    if (!catId) {
      console.warn(`  skip: unknown category "${seed.category}" for ${seed.slug}`)
      continue
    }
    const body = longBody(seed.topic)
    const source = i % 2 === 0 ? 'segye' : 'yonhap'
    const externalId = `${source}-${String(i + 1).padStart(3, '0')}`
    const thumbnail = `https://picsum.photos/seed/nf-article-${i + 1}/600/338`
    const publishedAt = daysAgoIso(seed.daysAgo)

    const result = await pool.query(
      `INSERT INTO article
         (source, external_article_id, slug, category_id, title, summary, body, body_length, thumbnail_url, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (slug) DO NOTHING
       RETURNING id`,
      [
        source,
        externalId,
        seed.slug,
        catId,
        seed.title,
        seed.summary,
        body,
        body.length,
        thumbnail,
        publishedAt,
      ],
    )
    if (result.rowCount && result.rowCount > 0) {
      inserted++
    } else {
      skipped++
    }
  }

  console.log(`Done. Inserted ${inserted}, skipped ${skipped} (already existed).`)
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
