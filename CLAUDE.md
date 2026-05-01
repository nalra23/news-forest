# News Forest Project — Claude Code 작업 규칙

이 문서는 News Forest 프로젝트에서 Claude Code가 항상 따라야 하는 규칙입니다.
모든 작업 시작 전에 반드시 이 문서를 우선 적용하세요.

---

## 1. 프로젝트 개요

- **제품명**: News Forest
- **컨셉**: 게이미피케이션 기반 뉴스 소비 플랫폼 (뉴스 읽기 → 포인트 → 나무 성장 → 숲 형성)
- **타겟**: 한국 시장 / 뉴스 소비를 잘 하지 않는 Gen Z & Millennials
- **플랫폼**: Web MVP (Mobile-first)
- **인증**: 익명 사용 (device-based ID, 해시 처리)

---

## 2. 절대 변경 금지 비즈니스 룰

다음 수치/정책은 모든 문서·코드에서 일관되게 사용합니다.
변경이 필요할 경우 사용자에게 먼저 확인받고, 모든 문서에 일괄 반영해야 합니다.

| 항목 | 값 |
|------|-----|
| Article 완료 조건 (scroll) | ≥ 90% |
| Article 완료 조건 (dwell time) | ≥ 30초 |
| Article 완료 시 포인트 | 10 |
| Watering 인터랙션 포인트 | 2 |
| Tree 성장 단계 | Seed → Sprout → Tree → Forest |
| 사용자 식별 | device-based 익명 ID (해시 저장, raw 노출 금지) |
| 시간 저장 | TIMESTAMPTZ + UTC 저장, KST는 앱 레이어에서 변환 |

---

## 3. 기술 스택

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js
- **Database**: PostgreSQL
- **Font**:
  - UI: Pretendard
  - 본문 (long-form): Pretendard 또는 Noto Serif KR
  - 숫자 표시: tabular-nums
- **Theme**: Light only (MVP), Dark는 Phase 2

---

## 4. 디자인 토큰

| 토큰 | 값 | 의미 |
|------|-----|------|
| Primary | `#2E7D32` | forest green (saturated) — 메인 CTA·강조 |
| Secondary | `#81C784` | sage / mint — 보조 강조 |
| Accent (Reward) | `#F2C94C` | mustard gold — 포인트 badge, streak |
| Background | `#F0E9D6` | warm cream / Kindle paperwhite — reading-first 톤 |
| Foreground (Text) | `#1F2A44` | navy — 본문 텍스트 |

> **변경 이력**:
> - 2026-05-01 — reading-first / habit-forming 컨셉 강화를 위해 cool-white 팔레트(`#2F855A`/`#A7F3D0`/`#FBBF24`/`#F8FAF7`/`#1F2937`)에서 warm-paper 팔레트로 전환. Medium · Apple Books · Kindle Paperwhite 톤 참고.
> - 2026-05-01 — Background 톤 강화: `#F5F1E8` → `#F0E9D6` (Kindle Paperwhite 가까운 톤). 카드 elevation도 함께 강화 (soft/lift shadow ↑).

### Breakpoints
- mobile: 320px
- tablet: 768px
- desktop: 1024px
- wide: 1440px

---

## 5. 문서 참조 정책 (가장 중요)

`/docs` 폴더에는 프로젝트의 모든 의사결정이 단계별 문서로 저장되어 있습니다.

```
/docs
├── 01-PRD.md          # 제품 요구사항
├── 02-IA.md           # 정보 구조
├── 03-UseCase.md      # 시스템 동작
├── 04-ERD.md          # 데이터 모델
└── 05-DesignGuide.md  # 디자인 시스템
```

### 5.1 단계별 문서 작성 시 참조 규칙

각 문서를 새로 작성할 때는 **이전 단계 문서를 모두 먼저 읽고**, 핵심 결정사항을 요약한 뒤 작성을 시작합니다.

| 작성 단계 | 사전에 반드시 읽을 문서 |
|---------|----------------------|
| 01-PRD 작성 | (없음 — 첫 단계) |
| 02-IA 작성 | `01-PRD.md` |
| 03-UseCase 작성 | `01-PRD.md`, `02-IA.md` |
| 04-ERD 작성 | `01-PRD.md`, `02-IA.md`, `03-UseCase.md` |
| 05-DesignGuide 작성 | `01-PRD.md`, `02-IA.md`, `03-UseCase.md`, `04-ERD.md` |

### 5.2 문서 작성 워크플로우 (필수 준수)

새 문서 작성 요청을 받으면 다음 순서로 진행합니다:

1. **사전 읽기**: 위 표에 따라 이전 문서들을 모두 읽기
2. **핵심 요약 보고**: 이전 문서들의 핵심 결정사항을 표/리스트로 요약해서 사용자에게 보여주기
3. **사용자 확인**: "이 컨텍스트로 진행할까요?" 라고 명시적으로 확인 요청
4. **작성 진행**: 사용자 확인 후 문서 작성
5. **저장**: 지정된 파일명(`/docs/0N-XXX.md`)으로 저장
6. **정합성 검증**: 작성 완료 후, 이전 문서들과의 정합성을 표로 검증해서 보고
7. **다음 단계 안내**: "다음으로 진행할까요?" 라고 사용자에게 확인 요청

### 5.3 코드 구현 시 참조 규칙

`/docs` 가 모두 완성된 후 코드 작업을 시작할 때는:

1. **모든 문서(01~05)를 먼저 읽기**
2. **통합 요약 보고**: 다음 5가지 관점으로 요약
   - 기술 스택 (PRD + ERD)
   - 페이지 라우팅 맵 (IA의 URL Structure)
   - 데이터 모델 (ERD의 entities)
   - 핵심 비즈니스 로직 (UseCase의 main flows)
   - 디자인 토큰 (DesignGuide)
3. **구현 단위 제안**: 작은 단위로 쪼갠 작업 계획 보여주기
4. **사용자 확인 후 진행**

---

## 6. 작업 진행 원칙

### 6.1 항상 확인받기

- 새 단계 시작 전 → 사용자 확인
- 큰 변경/구조적 결정 → 사용자 확인
- 비즈니스 룰 변경 시 → 사용자 확인 (Section 2의 수치는 절대 임의 변경 금지)
- 작업 완료 시 → "다음 단계는 어떻게 진행할까요?" 라고 명시적으로 확인 요청

### 6.2 작업 단위 쪼개기

큰 작업은 한 번에 처리하지 않고 작은 단위로 쪼갭니다.

코드 구현 단계의 권장 단위 예시:
1. 프로젝트 부트스트랩 (vite + React + TS + Tailwind 설정)
2. 라우팅 + 레이아웃 컴포넌트
3. 디자인 토큰 + 기본 컴포넌트 (Button, Card 등)
4. Article 카드 + 리스트
5. Article detail + scroll/dwell 검증
6. Tree widget + point 시스템
7. Watering 인터랙션
8. ...

각 단위 완료 시 사용자 확인 후 다음으로 진행합니다.

### 6.3 정합성 우선

- 어떤 작업이든 `/docs` 의 결정사항과 충돌하면 안 됩니다.
- 충돌 발견 시 → 작업 중단 → 사용자에게 보고 → 해결 방향 확인 → 진행
- 정합성 검증 시 표 형식으로 보고:
  ```
  | 항목 | docs 결정사항 | 현재 코드/문서 | 일치 여부 |
  ```

### 6.4 Over-engineering 금지

- MVP 범위 내에서만 구현
- 미래 기능(ESG 기부, 보상 교환 등)은 확장 가능하게 설계만 하고 구현하지 않음
- 복잡한 ML/AI 기반 fraud detection 같은 over-engineering 회피
- 추상화/패턴은 실제 필요할 때만 도입

---

## 7. 비즈니스 룰 변경 시 전파 규칙

만약 작업 도중 핵심 수치를 변경하기로 결정되면 (예: 포인트 10 → 15):

1. **사용자에게 확인**: "이 변경은 모든 문서와 코드에 영향을 미칩니다. 진행할까요?"
2. **영향 범위 보고**: 어떤 문서/파일에 변경이 필요한지 표로 보여주기
3. **일괄 수정**: `/docs` 의 모든 관련 문서 + 관련 코드 모두 수정
4. **이 CLAUDE.md도 수정**: Section 2 표의 값 업데이트
5. **변경 내역 보고**: 수정 전/후 표로 보여주기

---

## 8. 응답 스타일

- 모든 응답은 **한국어**
- 마크다운 형식 사용 (헤더, 표, 리스트 활용)
- 코드 변경 전에는 **변경 계획을 먼저 보여주고 확인** 후 진행
- 작업 완료 시 **변경 사항을 명확히 요약**해서 보고
- 응답 마지막에 **다음 단계 옵션 제시** (선택지 형식: ① ② ③)
- 추측보다 **실제 코드/문서를 먼저 확인** 후 답변

---

## 9. 보안 및 컴플라이언스

- 한국 개인정보보호법(PIPA) 준수
- 최소 개인정보 수집 원칙
- raw device ID는 절대 저장/노출 금지 (해시만 저장)
- API 통신은 HTTPS 필수
- PointTransaction 등 감사 추적이 필요한 데이터는 hard delete 금지

---

## 10. 빠른 참조 — 프롬프트 팩 위치

원본 프롬프트 5종은 다음 파일에 보관되어 있습니다:
- `news_forest_prompt_pack.md` (프로젝트 루트 또는 `/docs/_prompts/` 등)

새 단계 문서 작성 시 이 프롬프트를 그대로 사용하되, Section 5.2의 워크플로우를 함께 따릅니다.

---

## 끝맺음

이 CLAUDE.md는 News Forest 프로젝트의 작업 규칙입니다.
변경이 필요하면 사용자와 상의 후 명시적으로 업데이트하며,
작업 중에 임의로 무시하지 않습니다.
