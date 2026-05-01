-- Up Migration
CREATE TABLE IF NOT EXISTS point_transaction (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES anonymous_user(id) ON DELETE RESTRICT,
  amount SMALLINT NOT NULL,
  type TEXT NOT NULL,
  reading_session_id BIGINT REFERENCES reading_session(id) ON DELETE RESTRICT,
  watering_id BIGINT REFERENCES watering_interaction(id) ON DELETE RESTRICT,
  quest_participation_id BIGINT,
  -- ERD §3.5 — quest_participation FK는 0012 마이그레이션에서 추가됨 (테이블 생성 후)
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_amount_nonzero CHECK (amount <> 0),
  CONSTRAINT chk_type CHECK (type IN ('ARTICLE_COMPLETE', 'WATERING', 'QUEST', 'ADJUSTMENT')),
  CONSTRAINT chk_balance CHECK (balance_after >= 0),
  CONSTRAINT chk_single_source CHECK (
    (reading_session_id IS NOT NULL)::int +
    (watering_id IS NOT NULL)::int +
    (quest_participation_id IS NOT NULL)::int <= 1
  )
);

CREATE INDEX idx_point_transaction_user_created ON point_transaction (user_id, created_at DESC);
CREATE INDEX idx_point_transaction_type ON point_transaction (type, created_at DESC);
CREATE UNIQUE INDEX uq_point_transaction_reading ON point_transaction (reading_session_id) WHERE reading_session_id IS NOT NULL;
CREATE UNIQUE INDEX uq_point_transaction_watering ON point_transaction (watering_id) WHERE watering_id IS NOT NULL;

-- Down Migration
DROP TABLE IF EXISTS point_transaction CASCADE;
