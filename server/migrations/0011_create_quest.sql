-- Up Migration
CREATE TABLE IF NOT EXISTS quest (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL,
  target_action TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  reward_points SMALLINT NOT NULL,
  active_from TIMESTAMPTZ NOT NULL,
  active_to TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_quest_type CHECK (quest_type IN ('DAILY', 'WEEKLY')),
  CONSTRAINT chk_target_count CHECK (target_count >= 1),
  CONSTRAINT chk_reward_points CHECK (reward_points > 0),
  CONSTRAINT chk_active_window CHECK (active_to > active_from)
);

CREATE UNIQUE INDEX uq_quest_code ON quest (code);
CREATE INDEX idx_quest_active ON quest (active_from, active_to);

-- Down Migration
DROP TABLE IF EXISTS quest CASCADE;
