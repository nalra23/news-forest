# 04 — News Forest ERD (Entity Relationship Diagram)

> **문서 상태**: v1.0 (MVP)
> **작성일**: 2026-05-01
> **참조 프롬프트**: `/docs/_prompts/04.ERD.md`
> **사전 참조 문서**: `01-PRD.md`, `02-IA.md`, `03-UseCase.md`
> **프로젝트 룰**: `/CLAUDE.md`
> **DBMS**: PostgreSQL 16
> **정규화**: 3NF + 선택적 비정규화 (`Tree.total_points`)

---

## 1. ERD 다이어그램 (Mermaid)

```mermaid
erDiagram
    ANONYMOUS_USER ||--o{ READING_SESSION : "reads"
    ANONYMOUS_USER ||--o{ POINT_TRANSACTION : "earns"
    ANONYMOUS_USER ||--|| TREE : "owns"
    ANONYMOUS_USER ||--o{ WATERING_INTERACTION : "actor"
    ANONYMOUS_USER ||--o{ WATERING_INTERACTION : "target"
    ANONYMOUS_USER ||--o{ RECOMMENDATION_LOG : "shown"
    ANONYMOUS_USER ||--o{ QUEST_PARTICIPATION : "joins"

    ARTICLE_CATEGORY ||--o{ ARTICLE : "categorizes"
    ARTICLE ||--o{ READING_SESSION : "is_read"
    ARTICLE ||--o{ RECOMMENDATION_LOG : "recommends"

    READING_SESSION ||--o| POINT_TRANSACTION : "triggers"
    WATERING_INTERACTION ||--o| POINT_TRANSACTION : "triggers"
    QUEST_PARTICIPATION ||--o| POINT_TRANSACTION : "triggers"

    TREE ||--o{ TREE_GROWTH_HISTORY : "grows"
    TREE_GROWTH_STAGE ||--o{ TREE : "defines"
    TREE_GROWTH_STAGE ||--o{ TREE_GROWTH_HISTORY : "from_stage"
    TREE_GROWTH_STAGE ||--o{ TREE_GROWTH_HISTORY : "to_stage"

    QUEST ||--o{ QUEST_PARTICIPATION : "participated"

    ANONYMOUS_USER {
        BIGSERIAL id PK
        UUID public_id UK
        TEXT anonymous_hash UK
        TEXT nickname
        TEXT_ARRAY preferred_categories
        TIMESTAMPTZ onboarding_completed_at
        TIMESTAMPTZ last_active_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
        TIMESTAMPTZ deleted_at
    }

    ARTICLE_CATEGORY {
        SMALLSERIAL id PK
        TEXT code UK
        TEXT display_name
        SMALLINT sort_order
        TIMESTAMPTZ created_at
    }

    ARTICLE {
        BIGSERIAL id PK
        TEXT source
        TEXT external_article_id
        TEXT slug UK
        SMALLINT category_id FK
        TEXT title
        TEXT summary
        TEXT body
        INTEGER body_length
        TEXT thumbnail_url
        TIMESTAMPTZ published_at
        JSONB external_metadata
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
        TIMESTAMPTZ deleted_at
    }

    READING_SESSION {
        BIGSERIAL id PK
        BIGINT user_id FK
        BIGINT article_id FK
        TEXT status
        NUMERIC max_scroll_pct
        INTEGER dwell_seconds
        BOOLEAN is_suspicious
        JSONB client_metadata
        TIMESTAMPTZ started_at
        TIMESTAMPTZ completed_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    POINT_TRANSACTION {
        BIGSERIAL id PK
        BIGINT user_id FK
        SMALLINT amount
        TEXT type
        BIGINT reading_session_id FK
        BIGINT watering_id FK
        BIGINT quest_participation_id FK
        INTEGER balance_after
        TIMESTAMPTZ created_at
    }

    TREE {
        BIGSERIAL id PK
        BIGINT user_id FK_UK
        SMALLINT stage_id FK
        INTEGER total_points
        TIMESTAMPTZ last_grown_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    TREE_GROWTH_STAGE {
        SMALLSERIAL id PK
        TEXT code UK
        TEXT display_name
        INTEGER min_points
        SMALLINT sort_order
    }

    TREE_GROWTH_HISTORY {
        BIGSERIAL id PK
        BIGINT tree_id FK
        SMALLINT from_stage_id FK
        SMALLINT to_stage_id FK
        INTEGER points_at_change
        TIMESTAMPTZ changed_at
    }

    WATERING_INTERACTION {
        BIGSERIAL id PK
        BIGINT actor_user_id FK
        BIGINT target_user_id FK
        DATE interaction_date_kst
        TIMESTAMPTZ created_at
    }

    RECOMMENDATION_LOG {
        BIGSERIAL id PK
        BIGINT user_id FK
        BIGINT article_id FK
        TEXT section
        NUMERIC score
        TIMESTAMPTZ shown_at
        TIMESTAMPTZ clicked_at
    }

    QUEST {
        BIGSERIAL id PK
        TEXT code UK
        TEXT title
        TEXT description
        TEXT quest_type
        TEXT target_action
        INTEGER target_count
        SMALLINT reward_points
        TIMESTAMPTZ active_from
        TIMESTAMPTZ active_to
        TIMESTAMPTZ created_at
    }

    QUEST_PARTICIPATION {
        BIGSERIAL id PK
        BIGINT user_id FK
        BIGINT quest_id FK
        INTEGER progress_count
        TIMESTAMPTZ completed_at
        BOOLEAN reward_granted
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

---

## 2. Entity 그룹 분류

| 그룹 | Entity | 비고 |
|------|--------|------|
| **Core 운영** | AnonymousUser, Article, ArticleCategory, ReadingSession, Tree, WateringInteraction | MVP 핵심 |
| **Lookup** | TreeGrowthStage | 정적 데이터 (seed) |
| **Audit / 이력** | PointTransaction, TreeGrowthHistory | hard delete 금지 |
| **이벤트 / 로그** | RecommendationLog | 90일 TTL cleanup |
| **확장 (Phase 2)** | Quest, QuestParticipation | MVP 미사용, 스키마만 정의 |

---

## 3. Entity 상세 명세

### 3.1 `anonymous_user`

| 컬럼 | 타입 | Null | Key | 설명 | 검증 |
|------|------|------|-----|------|------|
| `id` | `BIGSERIAL` | NO | PK | 내부 PK | — |
| `public_id` | `UUID` | NO | UK | 외부 노출 식별자 (URL, API 응답) | UUID v4 |
| `anonymous_hash` | `TEXT` | NO | UK | SHA-256(fingerprint + server_salt) (64자 hex) | LENGTH=64, regex `^[a-f0-9]{64}$` |
| `nickname` | `TEXT` | NO | — | 랜덤 생성 닉네임 (예: "푸른잎사귀-1234") | 1≤len≤30 |
| `preferred_categories` | `TEXT[]` | YES | — | 카테고리 코드 배열 (`{politics,it,...}`) | 각 원소는 `article_category.code` 와 매칭 |
| `onboarding_completed_at` | `TIMESTAMPTZ` | YES | — | 온보딩 완료 시각 (NULL = 미완료) | — |
| `last_active_at` | `TIMESTAMPTZ` | NO | — | 마지막 active 시각 | — |
| `created_at` | `TIMESTAMPTZ` | NO | — | 생성 시각 | DEFAULT NOW() |
| `updated_at` | `TIMESTAMPTZ` | NO | — | 수정 시각 | DEFAULT NOW(), trigger 갱신 |
| `deleted_at` | `TIMESTAMPTZ` | YES | — | 사용자 삭제 요청 시 (PIPA) | NULL = 활성 |

> **Note:** `anonymous_hash` 의 server_salt는 환경변수 `APP_HASH_SALT` 로 관리, 절대 코드 commit 금지.

#### Indexes
```sql
CREATE UNIQUE INDEX uq_anonymous_user_public_id ON anonymous_user (public_id);
CREATE UNIQUE INDEX uq_anonymous_user_hash ON anonymous_user (anonymous_hash);
CREATE INDEX idx_anonymous_user_last_active_at ON anonymous_user (last_active_at DESC);
CREATE INDEX idx_anonymous_user_deleted_at ON anonymous_user (deleted_at) WHERE deleted_at IS NOT NULL;
```

#### Constraints
- `CHECK (LENGTH(anonymous_hash) = 64)`
- `CHECK (LENGTH(nickname) BETWEEN 1 AND 30)`

---

### 3.2 `article_category`

| 컬럼 | 타입 | Null | Key | 설명 | 검증 |
|------|------|------|-----|------|------|
| `id` | `SMALLSERIAL` | NO | PK | 내부 PK | — |
| `code` | `TEXT` | NO | UK | 카테고리 코드 | `politics`, `economy`, `society`, `it`, `culture`, `sports` |
| `display_name` | `TEXT` | NO | — | UI 표시명 | "정치", "경제" 등 |
| `sort_order` | `SMALLINT` | NO | — | 정렬 순서 | 1, 2, 3, ... |
| `created_at` | `TIMESTAMPTZ` | NO | — | — | DEFAULT NOW() |

#### Indexes
```sql
CREATE UNIQUE INDEX uq_article_category_code ON article_category (code);
```

#### Seed Data
```sql
INSERT INTO article_category (code, display_name, sort_order) VALUES
  ('politics', '정치', 1),
  ('economy', '경제', 2),
  ('society', '사회', 3),
  ('it', 'IT', 4),
  ('culture', '문화', 5),
  ('sports', '스포츠', 6);
```

---

### 3.3 `article`

| 컬럼 | 타입 | Null | Key | 설명 | 검증 |
|------|------|------|-----|------|------|
| `id` | `BIGSERIAL` | NO | PK | — | — |
| `source` | `TEXT` | NO | — | 외부 출처 코드 | `segye`, `yonhap` 등 |
| `external_article_id` | `TEXT` | NO | — | 외부 API article ID | source 별 고유 |
| `slug` | `TEXT` | NO | UK | URL slug (kebab-case) | regex `^[a-z0-9-]+$` |
| `category_id` | `SMALLINT` | NO | FK→`article_category.id` | 카테고리 | — |
| `title` | `TEXT` | NO | — | 제목 | 1≤len≤200 |
| `summary` | `TEXT` | YES | — | 요약 | ≤500 |
| `body` | `TEXT` | NO | — | 본문 (HTML or Markdown) | 길이 제한 X |
| `body_length` | `INTEGER` | NO | — | 본문 글자수 (한글 기준) | ≥0 |
| `thumbnail_url` | `TEXT` | YES | — | 썸네일 URL | https로 시작 |
| `published_at` | `TIMESTAMPTZ` | NO | — | 외부 발행 시각 (UTC) | — |
| `external_metadata` | `JSONB` | YES | — | 외부 API의 부가 정보 (저자, 태그, 원본 카테고리 등) | — |
| `created_at` | `TIMESTAMPTZ` | NO | — | — | DEFAULT NOW() |
| `updated_at` | `TIMESTAMPTZ` | NO | — | — | trigger 갱신 |
| `deleted_at` | `TIMESTAMPTZ` | YES | — | 외부에서 article이 제거된 경우 | — |

#### Indexes
```sql
CREATE UNIQUE INDEX uq_article_source_external ON article (source, external_article_id);
CREATE UNIQUE INDEX uq_article_slug ON article (slug);
CREATE INDEX idx_article_category_published ON article (category_id, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_article_published_at ON article (published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_article_metadata_gin ON article USING GIN (external_metadata);
```

#### Constraints
- `UNIQUE (source, external_article_id)` ← 중복 캐싱 방지
- `CHECK (body_length >= 0)`
- `CHECK (slug ~ '^[a-z0-9-]+$')`

---

### 3.4 `reading_session`

| 컬럼 | 타입 | Null | Key | 설명 | 검증 |
|------|------|------|-----|------|------|
| `id` | `BIGSERIAL` | NO | PK | — | — |
| `user_id` | `BIGINT` | NO | FK→`anonymous_user.id` | 사용자 | — |
| `article_id` | `BIGINT` | NO | FK→`article.id` | 기사 | — |
| `status` | `TEXT` | NO | — | 세션 상태 | `reading` / `completed` / `failed` |
| `max_scroll_pct` | `NUMERIC(5,4)` | NO | — | 최대 스크롤 진행률 (0.0000~1.0000) | CHECK 0~1 |
| `dwell_seconds` | `INTEGER` | NO | — | 누적 dwell 초 (visible 시간만) | ≥0 |
| `is_suspicious` | `BOOLEAN` | NO | — | 어뷰징 의심 플래그 | DEFAULT FALSE |
| `client_metadata` | `JSONB` | YES | — | UA, viewport, device type 등 | — |
| `started_at` | `TIMESTAMPTZ` | NO | — | 세션 시작 (UTC) | — |
| `completed_at` | `TIMESTAMPTZ` | YES | — | 완독 시각 (UTC) | status='completed'시 NOT NULL |
| `created_at` | `TIMESTAMPTZ` | NO | — | — | DEFAULT NOW() |
| `updated_at` | `TIMESTAMPTZ` | NO | — | — | trigger |

#### Indexes
```sql
CREATE INDEX idx_reading_session_user_article ON reading_session (user_id, article_id, started_at DESC);
CREATE INDEX idx_reading_session_user_status ON reading_session (user_id, status, started_at DESC);
CREATE INDEX idx_reading_session_completed ON reading_session (user_id, completed_at DESC) WHERE status = 'completed';
CREATE INDEX idx_reading_session_suspicious ON reading_session (is_suspicious, created_at DESC) WHERE is_suspicious = TRUE;
```

#### Constraints
- `CHECK (status IN ('reading', 'completed', 'failed'))`
- `CHECK (max_scroll_pct >= 0 AND max_scroll_pct <= 1)`
- `CHECK (dwell_seconds >= 0)`
- `CHECK ((status = 'completed') = (completed_at IS NOT NULL))` ← status와 timestamp 일관성

#### 중복 완독 방지 (UC-05 BR-05)
> **Note:** 동일 article 24h 내 중복 +10P 방지는 `point_transaction` UNIQUE 제약으로 처리 (§3.5 참고). 이 테이블에는 여러 reading_session row가 생길 수 있음 (재진입 케이스).

---

### 3.5 `point_transaction` ⚠️ **hard delete 금지**

| 컬럼 | 타입 | Null | Key | 설명 | 검증 |
|------|------|------|-----|------|------|
| `id` | `BIGSERIAL` | NO | PK | — | — |
| `user_id` | `BIGINT` | NO | FK→`anonymous_user.id` | 포인트 받는 사용자 | — |
| `amount` | `SMALLINT` | NO | — | 포인트 (+10, +2 등) | `≠ 0` |
| `type` | `TEXT` | NO | — | 트랜잭션 종류 | enum (§Constraints) |
| `reading_session_id` | `BIGINT` | YES | FK→`reading_session.id` | type='ARTICLE_COMPLETE' 일 때 | — |
| `watering_id` | `BIGINT` | YES | FK→`watering_interaction.id` | type='WATERING' 일 때 | — |
| `quest_participation_id` | `BIGINT` | YES | FK→`quest_participation.id` | Phase 2 | — |
| `balance_after` | `INTEGER` | NO | — | 트랜잭션 후 잔액 (denormalized) | ≥0 |
| `created_at` | `TIMESTAMPTZ` | NO | — | — | DEFAULT NOW() |

> **Note:** `updated_at`, `deleted_at` 컬럼 없음 → audit-friendly. UPDATE / DELETE 권한 application user에 부여하지 않음.

#### Indexes
```sql
CREATE INDEX idx_point_transaction_user_created ON point_transaction (user_id, created_at DESC);
CREATE INDEX idx_point_transaction_type ON point_transaction (type, created_at DESC);
CREATE UNIQUE INDEX uq_point_transaction_reading ON point_transaction (reading_session_id) WHERE reading_session_id IS NOT NULL;
CREATE UNIQUE INDEX uq_point_transaction_watering ON point_transaction (watering_id) WHERE watering_id IS NOT NULL;
```

#### Constraints
- `CHECK (amount <> 0)`
- `CHECK (type IN ('ARTICLE_COMPLETE', 'WATERING', 'QUEST', 'ADJUSTMENT'))`
- `CHECK (balance_after >= 0)`
- 정확히 하나의 source FK만 NOT NULL: `CHECK ((reading_session_id IS NOT NULL)::int + (watering_id IS NOT NULL)::int + (quest_participation_id IS NOT NULL)::int <= 1)`
- UNIQUE constraint로 동일 reading_session/watering 에 의한 중복 포인트 방지

---

### 3.6 `tree`

| 컬럼 | 타입 | Null | Key | 설명 | 검증 |
|------|------|------|-----|------|------|
| `id` | `BIGSERIAL` | NO | PK | — | — |
| `user_id` | `BIGINT` | NO | FK→`anonymous_user.id` UK | 1:1 관계 | UNIQUE |
| `stage_id` | `SMALLINT` | NO | FK→`tree_growth_stage.id` | 현재 단계 | — |
| `total_points` | `INTEGER` | NO | — | 누적 포인트 (denormalized sum) | ≥0 |
| `last_grown_at` | `TIMESTAMPTZ` | YES | — | 마지막 stage 변경 시각 | — |
| `created_at` | `TIMESTAMPTZ` | NO | — | — | DEFAULT NOW() |
| `updated_at` | `TIMESTAMPTZ` | NO | — | — | trigger |

#### Indexes
```sql
CREATE UNIQUE INDEX uq_tree_user ON tree (user_id);
CREATE INDEX idx_tree_stage ON tree (stage_id, total_points DESC);
```

#### Constraints
- `UNIQUE (user_id)` ← 1:1 enforcement
- `CHECK (total_points >= 0)`

> **Note:** `total_points` 는 `point_transaction` 의 SUM(amount) 와 일치해야 함. 일관성 검증 cron job 권장 (Phase 2).

---

### 3.7 `tree_growth_stage` (lookup)

| 컬럼 | 타입 | Null | Key | 설명 |
|------|------|------|-----|------|
| `id` | `SMALLSERIAL` | NO | PK | — |
| `code` | `TEXT` | NO | UK | `SEED` / `SPROUT` / `TREE` / `FOREST` |
| `display_name` | `TEXT` | NO | — | "씨앗" / "새싹" / "나무" / "숲" |
| `min_points` | `INTEGER` | NO | — | 이 단계 진입 최소 포인트 |
| `sort_order` | `SMALLINT` | NO | — | 정렬 |

#### Seed Data
```sql
INSERT INTO tree_growth_stage (code, display_name, min_points, sort_order) VALUES
  ('SEED',   '씨앗',   0,   1),
  ('SPROUT', '새싹',   50,  2),
  ('TREE',   '나무',   200, 3),
  ('FOREST', '숲',     500, 4);
```

> **Note:** Thresholds (50/200/500)는 MVP 가정. 첫 4주 실측 후 조정.

---

### 3.8 `tree_growth_history` ⚠️ **hard delete 금지**

| 컬럼 | 타입 | Null | Key | 설명 |
|------|------|------|-----|------|
| `id` | `BIGSERIAL` | NO | PK | — |
| `tree_id` | `BIGINT` | NO | FK→`tree.id` | — |
| `from_stage_id` | `SMALLINT` | YES | FK→`tree_growth_stage.id` | 첫 SEED 진입 시 NULL |
| `to_stage_id` | `SMALLINT` | NO | FK→`tree_growth_stage.id` | — |
| `points_at_change` | `INTEGER` | NO | — | 변경 시점 누적 포인트 |
| `changed_at` | `TIMESTAMPTZ` | NO | — | DEFAULT NOW() |

#### Indexes
```sql
CREATE INDEX idx_tree_growth_history_tree ON tree_growth_history (tree_id, changed_at DESC);
```

#### Constraints
- `CHECK (from_stage_id IS NULL OR from_stage_id <> to_stage_id)`
- 단조 증가는 application 레벨에서 보장 (downgrade 시도 reject)

---

### 3.9 `watering_interaction`

| 컬럼 | 타입 | Null | Key | 설명 | 검증 |
|------|------|------|-----|------|------|
| `id` | `BIGSERIAL` | NO | PK | — | — |
| `actor_user_id` | `BIGINT` | NO | FK→`anonymous_user.id` | 행위자 | — |
| `target_user_id` | `BIGINT` | NO | FK→`anonymous_user.id` | 대상자 | — |
| `interaction_date_kst` | `DATE` | NO | — | 인터랙션 날짜 (KST 기준 캘린더 일자) | — |
| `created_at` | `TIMESTAMPTZ` | NO | — | UTC timestamp | DEFAULT NOW() |

> **Note:** `interaction_date_kst` 는 server에서 `(NOW() AT TIME ZONE 'Asia/Seoul')::DATE` 로 계산. UNIQUE 제약을 KST 기준으로 적용.

#### Indexes
```sql
CREATE UNIQUE INDEX uq_watering_actor_target_day ON watering_interaction (actor_user_id, target_user_id, interaction_date_kst);
CREATE INDEX idx_watering_target_created ON watering_interaction (target_user_id, created_at DESC);
CREATE INDEX idx_watering_actor_created ON watering_interaction (actor_user_id, created_at DESC);
```

#### Constraints
- `CHECK (actor_user_id <> target_user_id)` ← 자기 자신에게 watering 불가
- `UNIQUE (actor_user_id, target_user_id, interaction_date_kst)` ← BR-04 (24h 1회 정책의 KST 일자 단위 구현)

---

### 3.10 `recommendation_log`

| 컬럼 | 타입 | Null | Key | 설명 |
|------|------|------|-----|------|
| `id` | `BIGSERIAL` | NO | PK | — |
| `user_id` | `BIGINT` | NO | FK→`anonymous_user.id` | — |
| `article_id` | `BIGINT` | NO | FK→`article.id` | — |
| `section` | `TEXT` | NO | — | `for-you` / `trending` / `recent` / `categories` |
| `score` | `NUMERIC(8,4)` | YES | — | 룰 기반 점수 (NULL 가능) |
| `shown_at` | `TIMESTAMPTZ` | NO | — | DEFAULT NOW() |
| `clicked_at` | `TIMESTAMPTZ` | YES | — | 클릭한 경우 |

#### Indexes
```sql
CREATE INDEX idx_recommendation_user_shown ON recommendation_log (user_id, shown_at DESC);
CREATE INDEX idx_recommendation_article ON recommendation_log (article_id, shown_at DESC);
CREATE INDEX idx_recommendation_section ON recommendation_log (section, shown_at DESC);
```

#### Constraints
- `CHECK (section IN ('for-you', 'trending', 'recent', 'categories'))`

> **Performance:** 고볼륨 테이블 — Phase 2에서 월별 partition 검토 (`shown_at` 기준 RANGE partition).

---

### 3.11 `quest` (Phase 2 — 스키마만 정의)

| 컬럼 | 타입 | Null | Key | 설명 |
|------|------|------|-----|------|
| `id` | `BIGSERIAL` | NO | PK | — |
| `code` | `TEXT` | NO | UK | 퀘스트 코드 (e.g., `daily-read-3`) |
| `title` | `TEXT` | NO | — | 표시 타이틀 |
| `description` | `TEXT` | YES | — | 설명 |
| `quest_type` | `TEXT` | NO | — | `DAILY` / `WEEKLY` |
| `target_action` | `TEXT` | NO | — | `read_articles` / `watering` 등 |
| `target_count` | `INTEGER` | NO | — | 목표 횟수 (≥1) |
| `reward_points` | `SMALLINT` | NO | — | 완료 시 보상 포인트 |
| `active_from` | `TIMESTAMPTZ` | NO | — | 활성 시작 (UTC) |
| `active_to` | `TIMESTAMPTZ` | NO | — | 활성 종료 (UTC) |
| `created_at` | `TIMESTAMPTZ` | NO | — | DEFAULT NOW() |

#### Indexes
```sql
CREATE UNIQUE INDEX uq_quest_code ON quest (code);
CREATE INDEX idx_quest_active ON quest (active_from, active_to);
```

---

### 3.12 `quest_participation` (Phase 2)

| 컬럼 | 타입 | Null | Key | 설명 |
|------|------|------|-----|------|
| `id` | `BIGSERIAL` | NO | PK | — |
| `user_id` | `BIGINT` | NO | FK→`anonymous_user.id` | — |
| `quest_id` | `BIGINT` | NO | FK→`quest.id` | — |
| `progress_count` | `INTEGER` | NO | — | 현재 진행 (DEFAULT 0) |
| `completed_at` | `TIMESTAMPTZ` | YES | — | 완료 시각 |
| `reward_granted` | `BOOLEAN` | NO | — | 보상 지급 여부 (DEFAULT FALSE) |
| `created_at` | `TIMESTAMPTZ` | NO | — | — |
| `updated_at` | `TIMESTAMPTZ` | NO | — | trigger |

#### Indexes
```sql
CREATE UNIQUE INDEX uq_quest_participation ON quest_participation (user_id, quest_id);
CREATE INDEX idx_quest_participation_completed ON quest_participation (completed_at DESC) WHERE completed_at IS NOT NULL;
```

#### Constraints
- `CHECK (progress_count >= 0)`
- `CHECK ((completed_at IS NOT NULL) = reward_granted OR reward_granted = FALSE)` (완료 후 보상 지급 일관성)

---

## 4. 관계 매핑 (Relationship Cardinality)

| From | To | Cardinality | 설명 |
|------|----|-----------:|------|
| `anonymous_user` | `tree` | 1 : 1 | 한 user는 하나의 tree만 보유 |
| `anonymous_user` | `reading_session` | 1 : N | user는 여러 session |
| `anonymous_user` | `point_transaction` | 1 : N | user는 여러 트랜잭션 |
| `anonymous_user` | `watering_interaction` (actor) | 1 : N | 행위자 |
| `anonymous_user` | `watering_interaction` (target) | 1 : N | 대상자 |
| `anonymous_user` | `recommendation_log` | 1 : N | — |
| `anonymous_user` | `quest_participation` | 1 : N | — |
| `article_category` | `article` | 1 : N | — |
| `article` | `reading_session` | 1 : N | — |
| `article` | `recommendation_log` | 1 : N | — |
| `reading_session` | `point_transaction` | 1 : 0..1 | 완독 시 1건 |
| `watering_interaction` | `point_transaction` | 1 : 0..1 | 수행 시 1건 |
| `tree` | `tree_growth_history` | 1 : N | — |
| `tree_growth_stage` | `tree` | 1 : N | 현재 단계 |
| `tree_growth_stage` | `tree_growth_history` | 1 : N | from/to 양쪽 참조 |
| `quest` | `quest_participation` | 1 : N | — |

---

## 5. PK / FK 구조 요약

```sql
-- BIGSERIAL PK는 다음 테이블에서 사용:
-- anonymous_user, article, reading_session, point_transaction, tree,
-- tree_growth_history, watering_interaction, recommendation_log, quest, quest_participation

-- SMALLSERIAL PK:
-- article_category, tree_growth_stage

-- FK는 모두 ON DELETE RESTRICT 가 기본 (audit 보호)
-- 예외: anonymous_user 삭제(soft) 시 cascade되지 않음 — soft delete만
```

---

## 6. Index Strategy 종합

| 케이스 | 인덱스 |
|--------|--------|
| Anonymous user 조회 (해시 → row) | `uq_anonymous_user_hash` |
| Public ID로 조회 (URL → user) | `uq_anonymous_user_public_id` |
| Article 카테고리 + 최신순 | `idx_article_category_published` |
| 외부 article 중복 방지 | `uq_article_source_external` |
| Article slug | `uq_article_slug` |
| 사용자별 reading 이력 | `idx_reading_session_user_article` |
| 사용자별 완독 history | `idx_reading_session_completed` (partial) |
| 어뷰징 의심 검색 | `idx_reading_session_suspicious` (partial) |
| 사용자 포인트 history | `idx_point_transaction_user_created` |
| 완독→포인트 1:1 | `uq_point_transaction_reading` (partial) |
| Watering 24h 중복 차단 | `uq_watering_actor_target_day` |
| Tree 단계별 (랭킹) | `idx_tree_stage` |
| 추천 기록 (사용자별) | `idx_recommendation_user_shown` |
| 추천 → 클릭률 분석 | `idx_recommendation_article` |
| Quest 활성기간 조회 | `idx_quest_active` |

> **Note:** Partial index를 적극 활용하여 인덱스 크기 최소화.

---

## 7. Constraints & Business Rules 매핑

| BR ID (UC §17) | 구현 위치 |
|---|---|
| BR-01 (90% + 30s) | `reading_session.max_scroll_pct` + `dwell_seconds` (application 레벨 검증) |
| BR-02 (+10P 완독) | `point_transaction.amount=10, type='ARTICLE_COMPLETE'` |
| BR-03 (+2P watering) | `point_transaction.amount=2, type='WATERING'` |
| BR-04 (24h 1회 / 동일 페어) | `uq_watering_actor_target_day` UNIQUE |
| BR-05 (24h 1회 / 동일 article) | `uq_point_transaction_reading` (1 reading_session = 1 point) + application 레벨 24h 체크 |
| BR-06 (visible 시 dwell만) | application 레벨 (Page Visibility API) |
| BR-07 (다중 탭 1탭만) | application 레벨 (BroadcastChannel) |
| BR-08 (Tree 단조 증가) | application 레벨 + `tree_growth_history` 검증 |
| BR-09 (PointTransaction hard delete 금지) | DB GRANT 권한 분리 + UPDATE/DELETE 권한 미부여 |
| BR-10 (News API fallback) | application 레벨 + `article` 캐시 |
| BR-11 (public_id 불변) | application 레벨 (UPDATE 금지) |

---

## 8. Data Types & Validation

| 타입 패턴 | 사용처 |
|-----------|--------|
| `BIGSERIAL` | high-volume PK |
| `SMALLSERIAL` | lookup PK (적은 row) |
| `UUID` | public-safe identifier |
| `TIMESTAMPTZ` | **모든** 시간 컬럼 (CLAUDE.md §2 강제) |
| `DATE` | KST 일자 단위 unique 키 (`watering_interaction.interaction_date_kst`) |
| `TEXT` | 가변 문자열 (NOT VARCHAR(N)) |
| `NUMERIC(p,s)` | 정밀 진행률 / 점수 |
| `JSONB` | 외부 API 메타데이터, client_metadata |
| `TEXT[]` | 카테고리 코드 배열 |
| `SMALLINT` | -32768~32767 충분한 정수 (포인트 amount, sort_order 등) |

---

## 9. 정규화 분석

- 기본 3NF 준수
- **선택적 비정규화**:
  - `tree.total_points` ← `point_transaction.amount` 합계 (성능)
  - `point_transaction.balance_after` ← 트랜잭션 시점 잔액 snapshot (audit + 빠른 history 조회)
  - `article.body_length` ← 본문에서 계산 가능하지만 검색용 인덱스 위해 저장
- **검증 cron**: `tree.total_points = SUM(point_transaction.amount WHERE user_id=...)` 일치 검증 (Phase 2)

---

## 10. Performance Optimization

### 10.1 고볼륨 예상 테이블

| 테이블 | 볼륨 (3개월) | 최적화 |
|--------|-------------|--------|
| `reading_session` | ~ 5,000 user × 4 article/week × 12주 = **240K rows** | Partial index, 1년 후 archive |
| `point_transaction` | ~ 240K + watering ~ 50K = **290K rows** | (보존 — audit) |
| `recommendation_log` | DAU 5K × 16 카드/일 × 90일 = **7.2M rows** | 월별 partition (Phase 2) + 90일 TTL |
| `article` | 외부 API 일 200건 × 90일 = **18K rows** | GIN index on JSONB |

### 10.2 주요 쿼리 예시

```sql
-- 사용자 home 추천 (UC-03)
SELECT a.*
FROM article a
WHERE a.deleted_at IS NULL
  AND a.category_id = ANY($category_ids)
  AND NOT EXISTS (
    SELECT 1 FROM reading_session rs
    WHERE rs.user_id = $user_id AND rs.article_id = a.id AND rs.status = 'completed'
  )
ORDER BY a.published_at DESC
LIMIT 5;

-- 완독 시 포인트 트랜잭션 (UC-05 → UC-06, ATOMIC)
BEGIN;
  UPDATE reading_session SET status='completed', completed_at=NOW() WHERE id=$rs_id AND status='reading';
  INSERT INTO point_transaction (user_id, amount, type, reading_session_id, balance_after)
    VALUES ($user_id, 10, 'ARTICLE_COMPLETE', $rs_id, (SELECT total_points FROM tree WHERE user_id=$user_id) + 10);
  UPDATE tree SET total_points = total_points + 10, updated_at=NOW() WHERE user_id=$user_id;
  -- stage 변경 검사는 application에서
COMMIT;

-- Watering 24h 체크 (UC-07)
INSERT INTO watering_interaction (actor_user_id, target_user_id, interaction_date_kst)
VALUES ($actor, $target, (NOW() AT TIME ZONE 'Asia/Seoul')::DATE)
ON CONFLICT (actor_user_id, target_user_id, interaction_date_kst) DO NOTHING
RETURNING id;
```

### 10.3 JSONB 사용 가이드

| 컬럼 | 사유 | 인덱스 |
|------|------|--------|
| `article.external_metadata` | 외부 API 별로 schema 다름 | GIN |
| `reading_session.client_metadata` | UA 등 분석용, schema 자유로움 | (필요 시 expression index) |

---

## 11. Migration & Versioning

### 11.1 도구
- **node-pg-migrate** 또는 **knex** (어느 쪽이든 SQL-first 방식 권장)
- 디렉토리: `/migrations/NNN-description.sql` (`NNN` = 3자리 sequence)

### 11.2 첫 migration 순서 (의존성 기준)
```
001_create_anonymous_user.sql
002_create_article_category.sql
003_create_article.sql
004_create_tree_growth_stage.sql       (seed 포함)
005_create_tree.sql
006_create_tree_growth_history.sql
007_create_reading_session.sql
008_create_watering_interaction.sql
009_create_point_transaction.sql        (FK 다수)
010_create_recommendation_log.sql
011_create_quest.sql                    (Phase 2 비활성)
012_create_quest_participation.sql      (Phase 2 비활성)
013_seed_article_category.sql
014_create_updated_at_triggers.sql
015_grant_permissions.sql               (point_transaction UPDATE/DELETE 권한 분리)
```

### 11.3 트리거 (updated_at 자동 갱신)
```sql
CREATE OR REPLACE FUNCTION trg_set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- 적용 대상: anonymous_user, article, reading_session, tree, quest_participation
```

### 11.4 schema migration 규칙
- 모든 migration은 **transaction wrapped** (단, `CREATE INDEX CONCURRENTLY` 등 예외)
- 운영 적용 전 staging에서 dry-run
- breaking change(예: 컬럼 drop)는 **2-step deploy** (1. add new + dual-write, 2. drop old)

---

## 12. Data Retention & Deletion Policy

| Entity | 정책 | 사유 |
|--------|------|------|
| `anonymous_user` | **Soft delete (deleted_at)** → 30일 후 hard purge | PIPA 사용자 권리 (Right to Erasure) |
| `article` | Soft delete (외부 제거 시) | SEO·history |
| `article_category` | 하드 delete 사실상 X (lookup) | — |
| `reading_session` | 보존 1년 → archive (cold storage) | 분석 가치 vs 비용 |
| `point_transaction` | **🚫 hard delete 금지, 영구 보존** | audit (CLAUDE.md §9) |
| `tree` | user 삭제 시 cascade soft delete | — |
| `tree_growth_stage` | 영구 (lookup) | — |
| `tree_growth_history` | 영구 보존 | audit |
| `watering_interaction` | 보존 1년 → archive | — |
| `recommendation_log` | **TTL 90일** (cron job daily cleanup) | 고볼륨, 단기 분석 가치만 |
| `quest`, `quest_participation` | Phase 2 정의 후 확정 | — |

### 12.1 사용자 삭제 요청 흐름 (PIPA)
```
1. /settings → "데이터 초기화"
2. application: anonymous_user.deleted_at = NOW() (소프트)
3. 30일 후 cron: 
   - tree, tree_growth_history, reading_session, recommendation_log, watering_interaction → 익명화 (user_id NULL은 불가하므로 'tombstone' 사용자로 reassign 또는 row 자체 삭제)
   - point_transaction → user_id 익명화 (row 보존, audit)
   - anonymous_user row 자체 삭제 또는 PII 모두 NULL
```

> **Note:** PointTransaction의 user_id 익명화 패턴: 별도 `tombstone_user` row(id=0 등)로 reassign하여 referential integrity 유지.

---

## 13. Security 강화 사항

| 항목 | 정책 |
|------|------|
| `anonymous_hash` salt | env `APP_HASH_SALT`, 운영 secret manager |
| `point_transaction` UPDATE/DELETE | DB role 분리 — application user에는 INSERT/SELECT만 부여 |
| public_id (UUID v4) | URL 노출 가능. 단조 증가하는 BIGSERIAL id는 절대 URL 미노출 |
| `client_metadata` | UA, viewport만 저장 — IP는 저장 X |
| Row-level security (RLS) | MVP는 application-side enforcement. Phase 2에서 RLS 검토 |

---

## 14. 정합성 검증

### 14.1 vs `01-PRD.md`

| 항목 | PRD | ERD | 일치 |
|------|-----|-----|------|
| 익명 ID 해시 저장 | §4.5 | `anonymous_user.anonymous_hash` (SHA-256, salted) | ✅ |
| 완독 +10P / Watering +2P | §4.2 | `point_transaction.amount`, type별 정의 | ✅ |
| 4단계 Tree | §4.3 | `tree_growth_stage` 4 row seed | ✅ |
| 외부 article 캐싱 unique | §9 | `uq_article_source_external` | ✅ |
| 카테고리 6종 | (IA에서 명시) | `article_category` 6 row seed | ✅ |

### 14.2 vs `02-IA.md`

| 항목 | IA | ERD | 일치 |
|------|----|----|------|
| Public-safe UUID 노출 | §2.3 | `anonymous_user.public_id` UUID v4 UK | ✅ |
| Article slug URL | §2.1 | `article.slug` UNIQUE, kebab-case CHECK | ✅ |
| 카테고리 6종 코드 | §6.1 | seed data | ✅ |
| 추천 4섹션 | §6.2 | `recommendation_log.section` enum | ✅ |

### 14.3 vs `03-UseCase.md`

| 항목 | UseCase | ERD | 일치 |
|------|---------|-----|------|
| Article state (reading/completed/failed) | §2.1 | `reading_session.status` CHECK | ✅ |
| Tree state (Seed/Sprout/Tree/Forest) | §2.2 | `tree_growth_stage.code` 4종 | ✅ |
| BR-01 ~ BR-11 | §17 | §7 매핑 표 | ✅ |
| Watering self 차단 | UC-07 A1 | `CHECK (actor_user_id <> target_user_id)` | ✅ |
| Watering 24h 1회 | UC-07 BR-04 | `uq_watering_actor_target_day` | ✅ |
| 완독 → 포인트 1:1 | UC-05/UC-06 | `uq_point_transaction_reading` | ✅ |

### 14.4 vs `CLAUDE.md`

| 항목 | CLAUDE.md | ERD | 일치 |
|------|-----------|-----|------|
| 모든 시간은 TIMESTAMPTZ + UTC | §2 | 모든 시간 컬럼 TIMESTAMPTZ, KST는 `interaction_date_kst` 만 DATE (UTC NOW에서 변환) | ✅ |
| Raw device ID 저장/노출 금지 | §9 | 해시만 저장, 어디에도 raw 컬럼 없음 | ✅ |
| PointTransaction hard delete 금지 | §9 | `point_transaction` 에 `updated_at`/`deleted_at` 없음 + GRANT 권한 분리 | ✅ |
| MVP-friendly, over-engineering 금지 | §6.4 | partition은 Phase 2로 미룸, RLS도 Phase 2 | ✅ |

---

## 끝맺음

이 ERD는 News Forest MVP의 **PostgreSQL 데이터 모델 + 인덱스 전략 + 보존 정책** 을 정의합니다.
다음 단계인 **05-DesignGuide** 는 본 ERD 기반의 데이터 가시성과 IA의 화면 설계를 시각 디자인 시스템으로 통합합니다.
