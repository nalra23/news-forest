# 01 — News Forest PRD (Product Requirements Document)

> **문서 상태**: v1.0 (MVP)
> **작성일**: 2026-05-01
> **참조 프롬프트**: `/docs/_prompts/01.PRD.md`
> **프로젝트 룰**: `/CLAUDE.md` (절대 변경 금지 비즈니스 룰 §2)

---

## 1. 제품 개요 (Detailed Product Description)

### 1.1 문제 정의 (Problem Definition)

- **뉴스 직접 소비량 감소**: 한국 20–30대(Gen Z·Millennials)는 SNS·숏폼 영상으로 정보 채널이 분산되며 뉴스 사이트 직접 방문이 빠르게 줄고 있음.
- **뉴스 UX의 심리적 거부감**: 기존 뉴스 사이트는 클릭베이트 헤드라인, 광고 폭탄, 정치 댓글 피로도로 진입 자체를 회피하게 만듦.
- **습관화 동기 부족**: 한 번 읽고 끝나는 단발성 소비. 학습(Duolingo)·운동(Forest 앱) 같은 보상·시각적 진보감 장치가 뉴스 도메인엔 거의 없음.

### 1.2 솔루션 접근 (Solution Approach)

- 뉴스 읽기를 **"숲을 키우는 행위"** 로 재정의 — 기사 1편 완독 = 나무 1단계 성장의 직관적 메타포.
- **Scroll ≥ 90% AND Dwell ≥ 30s** 의 이중 검증으로 "읽었다"의 진정성을 확보 → 게이미피케이션이 어뷰징되지 않게 함.
- **익명(device-based) 사용**으로 가입 마찰 제거. 첫 방문 → 첫 기사 진입까지 클릭 3회 이내.
- **차분한 디자인 톤** (소프트 그린 + 자연 메타포) — 게이미피케이션이지만 유치하지 않음.

### 1.3 핵심 가치 제안 (Core Value Proposition)

> **"당신이 뉴스를 한 편 읽을 때마다, 나무 한 그루가 자랍니다."**

| 이해관계자 | 가치 |
|---|---|
| 사용자 | 가벼운 보상 + 시각적 진보감으로 부담 없는 뉴스 습관 형성 |
| 사회 | 더 많은 사람이 양질의 뉴스를 소비 → 정보 격차 완화 |
| 비즈니스 | 트래픽 + 체류시간 동시 증가 → 광고/B2B/ESG 다각화 가능 |

### 1.4 주요 차별점 (Key Differentiators)

| # | 차별점 | 기존 서비스 |
|---|------|-------------|
| 1 | 읽기 검증 + 보상 동시 결합 | 네이버 뉴스: 검증·보상 모두 없음 |
| 2 | 시각적 성장 메타포 (4단계 나무) | Medium: 텍스트 중심 |
| 3 | 로그인 없는 즉시 진입 | 카카오·네이버: 가입 필수 |
| 4 | 사회적 격려 (Watering) | Forest 앱: 단독 플레이 |
| 5 | 한국 시장 특화 콘텐츠 + UX | Apple News / Medium: 한국어 빈약 |

---

## 2. 경쟁 분석 (Competitive Analysis & Differentiation)

| 서비스 | 타겟 | 핵심 기능 | UX 톤 | 비즈니스 모델 | News Forest와의 차이 |
|--------|------|----------|------|--------------|--------------------|
| 네이버 뉴스 | 전 연령 | 큐레이션 + 댓글 | 정보 밀집 | 광고 | 보상 부재, Gen Z 거부감 |
| 카카오 뷰 | 20–40대 | 큐레이션 채널 | 약간 가벼움 | 광고 | 보상 없음, 검증 없음 |
| Medium | 영어권 | Longform 구독 | 차분함 | 구독 | 한국 콘텐츠 부족, 게임적 요소 없음 |
| Duolingo | 학습자 | 학습 streak | 활기참 | 광고/구독 | 학습 도메인. **메커니즘 차용 가치 ↑** |
| Forest (앱) | 집중력 향상 | 시각적 나무 성장 | 차분함 | 일회성 결제 | 단독 플레이. **시각 메타포 차용** |
| Apple News | iOS 사용자 | 큐레이션 | 세련됨 | 구독 | 한국 미지원 |

**전략적 포지션**: News Forest는 "**Duolingo의 습관 형성** × **Forest 앱의 시각적 보상** × **Medium의 차분한 톤**"의 교집합에서 한국 뉴스 도메인에 진입.

---

## 3. 레퍼런스 서비스 (References with Rationale)

- **Duolingo** — 학습 행동을 streak·포인트·캐릭터 진화로 보상하는 메커니즘 차용.
  > **Note:** Duolingo의 강한 푸시·죄책감 유발 알림은 News Forest에 부적합. 부드러운 시각적 피드백 위주로 변형.
- **Forest App** — "나무가 자란다"는 시각 메타포의 검증된 사용 사례. 사용자가 직접 시간을 투자한 결과물이 시각화됨.
  > **Note:** Forest는 "안 하기"를 보상하지만, News Forest는 "하기"(읽기)를 보상한다는 점이 다름.
- **Medium** — Longform 콘텐츠 가독성, 차분한 베이지 배경, 시리프 폰트 옵션.
  > **Note:** Article detail 페이지의 reading 모드 디자인 직접 참고.
- **Notion** — 절제된 UI, 명료한 정보 위계, 미묘한 마이크로 인터랙션.
  > **Note:** "게이미피케이션이지만 유치하지 않은" 톤의 베이스라인.
- **Headspace** — 차분하고 따뜻한 색감, 자연 메타포, 부담 없는 UX.
  > **Note:** Empty/Error state 메시지 톤 참고.

---

## 4. 핵심 기능 사양 (Core Features and Specifications)

### 4.1 기사 완독 검증 (Article Reading Validation)

| 항목 | 사양 |
|------|------|
| Scroll 임계값 | **≥ 90%** (article 본문 영역 기준, header/footer 제외) |
| Dwell 임계값 | **≥ 30초** (Page Visibility API로 tab blur 시 일시정지) |
| 검증 방식 | 클라이언트가 두 조건 충족 시 server에 `complete` 이벤트 전송 → server 재검증 후 포인트 지급 |
| 어뷰징 방어 | 동일 article 24h 내 중복 완독 차단, 비현실적 속도(<5s) 차단 |

> **Note:** 위 임계값은 CLAUDE.md §2의 절대 변경 금지 룰. 변경 시 사용자 합의 필수.

### 4.2 포인트 시스템 (Point System)

| 행동 | 포인트 | 비고 |
|------|--------|------|
| 기사 완독 | **+10** | 동일 article 24h 1회 |
| Watering 인터랙션 | **+2** (행위자) | 동일 대상 24h 1회 |
| Weekly quest 완료 | TBD | Phase 2 |

### 4.3 나무 성장 시스템 (Tree Growth)

- 단계: **Seed → Sprout → Tree → Forest** (4단계, CLAUDE.md §2)
- 누적 포인트 기반 단계 전환 (정확한 thresholds는 04-ERD에서 확정 예정)
- 단계 전환 시 **차분한 트랜지션** (350ms ease-out, confetti·과한 폭죽 금지)

### 4.4 AI 기반 개인화 추천 (Personalized Recommendations)

| 단계 | 방식 |
|------|------|
| MVP | 룰 기반: 사용자 카테고리 선호도(완독률·체류시간) + 인기 article |
| Phase 2 | 콘텐츠 기반 임베딩 (article 본문 → vector) + 협업 필터링 |
| Phase 3 | 강화학습 기반 개인화 |

- 추천 결과는 `RecommendationLog` 에 기록 (재추천 방지 + AB 분석 기반)

### 4.5 익명 사용 시스템 (Anonymous Usage)

- 첫 방문 시 device fingerprint(canvas + UA + screen 등) → **SHA-256 해시** → 익명 ID 발급
- localStorage + httpOnly 쿠키 이중 저장. 쿠키 삭제 시 fingerprint로 복구 시도(best-effort).
- **raw device ID는 DB에 절대 저장하지 않음** (CLAUDE.md §9, PIPA 준수)
- URL에 raw ID 노출 금지 → public-safe identifier(별도 UUID) 사용

### 4.6 사회적 인터랙션 — Watering (물주기)

| 항목 | 정책 |
|------|------|
| 행위자 보상 | +2 포인트 |
| 대상자 보상 | 시각적 피드백만 (어뷰징 방지) |
| 빈도 제한 | 동일 대상 24h 내 1회 |
| 익명성 | "익명의 누군가가 물을 줬어요" 메시지 |

> **Note:** 대상자에게 직접 포인트 미지급은 다중 계정 어뷰징 방지를 위함. CLAUDE.md §2와 별도의 운영 정책.

---

## 5. 추가 기능 제안 (Suggested Additional Features)

| # | 기능 | 단계 | 가치 |
|---|------|------|------|
| 1 | **Daily Streak Badge** | Phase 2 | 연속 일수 시각화 → 습관 형성 강화 |
| 2 | **Weekly Forest Ranking** | Phase 2 | 익명 닉네임 + 나무 단계 기준 상위 100인 |
| 3 | **Category Quest** | Phase 2 | "오늘 IT 기사 3개 읽기" 일일 퀘스트 |
| 4 | **Tree PNG 공유** | Phase 2 | 자기 숲을 SNS 공유 → 유기적 유입 |
| 5 | **Reading Digest Email (opt-in)** | Phase 3 | 주간 활동 요약 → 재방문 hook |

---

## 6. 페르소나 & 시나리오 (User Persona and Scenarios)

### Persona A — "지원" (24, 마케팅 인턴)
- **일상**: 출근길 지하철 30분, SNS·유튜브 위주 정보 소비
- **뉴스 회피 사유**: 정치 댓글 피로함, 어디서부터 봐야 할지 모름
- **시나리오 (첫 방문 → 7일 retention)**:
  1. 친구 카톡 링크로 첫 진입 → 온보딩 3카드(컨셉 설명)
  2. 추천 카드 3개 중 1개 선택 → 본문 읽기 → 진행률 게이지 차오름
  3. 30초 + 90% 충족 → 차분한 잎사귀 모션 → 씨앗이 새싹으로 변환
  4. "내 숲 보기" 클릭 → 자기 진행도 확인 → 다음 추천 기사 클릭
  5. 7일 후: 푸시 없이도 "스트릭이 끊길 것 같다"는 시각적 hook으로 재방문 유도

### Persona B — "민호" (31, 백엔드 개발자)
- **일상**: 점심·퇴근 후 단편적 IT 뉴스 소비
- **뉴스 회피 사유**: 광고가 너무 많고 본문은 짧음, 출처 의심
- **시나리오**:
  1. Google 검색으로 IT 기사 직접 진입 (SEO)
  2. 광고 없는 깔끔한 본문에 만족 → 완독
  3. "기사 1편 읽었어요. +10P" 차분한 알림
  4. 추천 피드에서 4편 더 읽음 (세션 18분)
  5. 1주일 후 다시 검색 유입 → 본인 숲 누적된 것 확인 → "Watering"으로 다른 사람 응원

### Persona C — "수진" (28, 프리랜서 디자이너)
- **일상**: 작업 사이 시각적 콘텐츠로 휴식
- **뉴스 회피 사유**: 텍스트 위주가 부담, 무거운 톤
- **시나리오**:
  1. SNS에서 누군가의 "숲" 이미지 발견 → 호기심으로 클릭
  2. 랜딩의 시각적 톤에 매력 → 직접 시작
  3. 디자인·문화 카테고리 위주 추천 받음 → 가볍게 완독
  4. 자기 나무 시각화에 만족 → SNS 공유 → 유기적 유입 발생

---

## 7. 비즈니스 모델 (Business Model / Monetization Strategy)

| # | 모델 | 단계 | 메커니즘 | 톤 보호 |
|---|------|------|---------|---------|
| 1 | **네이티브 광고** | MVP 후반 | 추천 피드 사이 1개 / 카드형, 대비 제한 | 디자인 톤 깨지지 않음 |
| 2 | **B2B 파트너십** | Phase 2 | 언론사: API 트래픽 송출 / 학교·공공기관: 단체 캠페인 | — |
| 3 | **ESG 기부 매칭** | Phase 2 | "n그루 자라면 실제 식수 1그루" — 스폰서 부담 | 브랜드 강화 효과 |
| 4 | **프리미엄 구독** | Phase 3 | 광고 제거 + 다크 모드 + 고급 통계 | 강제 결제 절대 X |

> **Note:** MVP에서는 수익화보다 **engagement KPI 검증**(DAU·retention·완독률)에 집중. 광고는 P1.6 이후 도입 검토.

---

## 8. KPI 정의 & 측정 방법 (KPI Definition & Measurement)

| KPI | 정의 | 3개월 목표 | 측정 |
|-----|------|------------|------|
| **DAU** | 일별 활성 익명 사용자 수 | 5,000 | session 시작 이벤트 unique device hash |
| **D7 Retention** | 첫 방문 → 7일 이내 재방문률 | ≥ 25% | cohort 분석 |
| **Articles per User per Week** | 주당 사용자별 평균 완독 기사 수 | ≥ 4 | 완독 이벤트 / 활성 user |
| **Avg Session Time** | 세션 시작–종료 평균 | ≥ 8분 | session 이벤트 |
| **완독률 (시작 대비)** | 완독 이벤트 / article 진입 이벤트 | ≥ 35% | article 이벤트 funnel |
| **Tree 성장 도달률** | Seed→Sprout 도달 사용자 비율 | ≥ 50% | tree stage 변경 이벤트 |

> **Note:** 위 목표는 MVP 가정값. 첫 4주 실측 후 04-ERD 데이터 기반 재조정.

**측정 도구**: PostHog (event tracking) + 자체 BI 대시보드.

---

## 9. 기술 스택 권장사항 (Technical Stack Recommendations)

| 레이어 | 권장 스택 | 사유 |
|--------|----------|------|
| Frontend | **React 18 + TypeScript + Vite** | 빠른 빌드, 타입 안정성, 생태계 |
| Styling | **TailwindCSS 3.x** | 디자인 토큰과 직결, 유지보수 용이 |
| Routing | **React Router v6** | MVP 적합한 단순함 |
| Client State | **Zustand** | 가벼움, Boilerplate 적음 |
| Server State | **TanStack Query (React Query)** | 캐싱·refetch 정책 표준화 |
| Backend | **Node.js + Fastify** | Express보다 빠르고 schema validation 내장 |
| DB | **PostgreSQL 16** | TIMESTAMPTZ + JSONB 지원 |
| Cache | **Redis** | 세션, rate-limit, 추천 캐싱 |
| Event Tracking | **PostHog (self-hosted)** | KPI 측정 + cohort 분석 |
| Hosting | **Vercel (FE) + Fly.io / Railway (BE)** | 한국 latency 무난 |
| External News | **세계일보 API + 연합뉴스 API (후보)** | RSS fallback 권장 |

> **Note:** CLAUDE.md §3와 일치 확인됨. Redis는 §3에 명시되지 않았지만 anti-abuse + rate-limit 위해 추가 권장.

---

## 10. 개발 로드맵 (Development Roadmap)

### Phase 1 — MVP (0–3개월)
| ID | 범위 |
|---|---|
| P1.1 | 익명 ID 시스템 + 첫 진입 onboarding |
| P1.2 | 외부 뉴스 API 통합 + caching |
| P1.3 | Article 완독 검증 (scroll + dwell) |
| P1.4 | 포인트 + 4단계 나무 성장 |
| P1.5 | Home / Article detail / Dashboard 페이지 |
| P1.6 | Watering MVP (제한적) + 네이티브 광고 1슬롯 |

### Phase 2 — Growth (3–6개월)
| ID | 범위 |
|---|---|
| P2.1 | 카테고리 기반 추천 고도화 (콘텐츠 임베딩) |
| P2.2 | Daily/Weekly Quest |
| P2.3 | Forest map 확장 + Weekly Ranking |
| P2.4 | Dark mode (long-form 가독성 최적화) |
| P2.5 | PWA 설치 + opt-in 푸시 |
| P2.6 | B2B 파트너십 베타 (언론사 1곳) |

### Phase 3 — Expansion (6+개월)
| ID | 범위 |
|---|---|
| P3.1 | ESG 기부 매칭 (실제 식수 파트너) |
| P3.2 | 보상 교환 시스템 (포인트 → 기프티콘 등) |
| P3.3 | Premium 구독 출시 |
| P3.4 | Native 앱 (iOS/Android) 검토 |

---

## 11. UI/UX 컨셉 가이드 (개념 제안 — 상세는 05-DesignGuide)

| 화면 | 핵심 컨셉 |
|------|----------|
| 첫 진입 | 화면 가운데 작은 씨앗 일러스트 → "당신의 첫 기사를 골라주세요" 3카드 |
| Home (Mobile) | 상단 나무 위젯 + 하단 추천 피드 세로 스크롤 + Bottom nav |
| Home (Desktop) | 좌측 사이드바 + 중앙 피드 + 우측 나무 위젯 |
| Article detail | 상단 가는 진행률 라인, 본문은 Pretendard or Noto Serif KR, 광고 없음 |
| 완독 시 | 차분한 잎사귀 모션 1회 (350ms), 포인트 카운트업 (tabular-nums) |
| Empty state | "아직 씨앗이 심어지지 않았어요" 같은 자연 메타포 |
| Error state | 따뜻한 톤 + 명확한 복구 액션 ("다시 시도해볼까요?") |

---

## 12. 보안 & 컴플라이언스 (Security & Compliance)

- **PIPA(개인정보보호법) 준수**: 개인정보 최소 수집 원칙
- raw device ID는 **저장·노출 금지**. SHA-256 해시 후 저장
- API 통신 HTTPS 필수
- PointTransaction 등 감사 추적 데이터는 **hard delete 금지** (CLAUDE.md §9)
- 익명 사용자의 데이터 보유기간 정책: TBD (04-ERD에서 확정)

---

## 13. 정합성 검증 (CLAUDE.md §2 절대 변경 금지 룰과의 일치)

| 항목 | CLAUDE.md §2 | 본 PRD | 일치 |
|------|-------------|--------|------|
| Article 완료 조건 (scroll) | ≥ 90% | ≥ 90% (§4.1) | ✅ |
| Article 완료 조건 (dwell) | ≥ 30초 | ≥ 30초 (§4.1) | ✅ |
| Article 완료 시 포인트 | 10 | +10 (§4.2) | ✅ |
| Watering 포인트 | 2 | +2 (§4.2, §4.6) | ✅ |
| Tree 성장 단계 | Seed → Sprout → Tree → Forest | 동일 (§4.3) | ✅ |
| 사용자 식별 | device-based 익명 ID (해시 저장) | 동일 (§4.5, §12) | ✅ |
| 시간 저장 | TIMESTAMPTZ + UTC | 04-ERD에서 확정 | 🔜 |

---

## 끝맺음

이 PRD는 News Forest MVP의 **제품 비전과 핵심 사양**을 정의합니다.
다음 단계인 **02-IA(Information Architecture)** 는 본 PRD를 기반으로 사이트맵·URL 구조·네비게이션을 정의합니다.
