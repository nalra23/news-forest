-- Up Migration
CREATE TABLE IF NOT EXISTS quest_participation (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES anonymous_user(id) ON DELETE RESTRICT,
  quest_id BIGINT NOT NULL REFERENCES quest(id) ON DELETE RESTRICT,
  progress_count INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  reward_granted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_progress CHECK (progress_count >= 0)
);

CREATE UNIQUE INDEX uq_quest_participation ON quest_participation (user_id, quest_id);
CREATE INDEX idx_quest_participation_completed ON quest_participation (completed_at DESC) WHERE completed_at IS NOT NULL;

-- 0009 에서 만든 point_transaction.quest_participation_id 에 FK 연결
ALTER TABLE point_transaction
  ADD CONSTRAINT fk_point_tx_quest_participation
  FOREIGN KEY (quest_participation_id)
  REFERENCES quest_participation(id) ON DELETE RESTRICT;

-- Down Migration
ALTER TABLE point_transaction
  DROP CONSTRAINT IF EXISTS fk_point_tx_quest_participation;
DROP TABLE IF EXISTS quest_participation CASCADE;
