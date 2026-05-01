-- Up Migration
CREATE TABLE IF NOT EXISTS tree_growth_history (
  id BIGSERIAL PRIMARY KEY,
  tree_id BIGINT NOT NULL REFERENCES tree(id) ON DELETE RESTRICT,
  from_stage_id SMALLINT REFERENCES tree_growth_stage(id) ON DELETE RESTRICT,
  to_stage_id SMALLINT NOT NULL REFERENCES tree_growth_stage(id) ON DELETE RESTRICT,
  points_at_change INTEGER NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_stage_change CHECK (from_stage_id IS NULL OR from_stage_id <> to_stage_id)
);

CREATE INDEX idx_tree_growth_history_tree ON tree_growth_history (tree_id, changed_at DESC);

-- Down Migration
DROP TABLE IF EXISTS tree_growth_history CASCADE;
