-- Up Migration
CREATE TABLE IF NOT EXISTS tree (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES anonymous_user(id) ON DELETE RESTRICT,
  stage_id SMALLINT NOT NULL REFERENCES tree_growth_stage(id) ON DELETE RESTRICT,
  total_points INTEGER NOT NULL DEFAULT 0,
  last_grown_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_total_points CHECK (total_points >= 0)
);

CREATE UNIQUE INDEX uq_tree_user ON tree (user_id);
CREATE INDEX idx_tree_stage ON tree (stage_id, total_points DESC);

-- Down Migration
DROP TABLE IF EXISTS tree CASCADE;
