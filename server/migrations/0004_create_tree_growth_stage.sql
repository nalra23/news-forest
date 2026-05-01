-- Up Migration
CREATE TABLE IF NOT EXISTS tree_growth_stage (
  id SMALLSERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  min_points INTEGER NOT NULL,
  sort_order SMALLINT NOT NULL
);

CREATE UNIQUE INDEX uq_tree_growth_stage_code ON tree_growth_stage (code);

-- Down Migration
DROP TABLE IF EXISTS tree_growth_stage CASCADE;
