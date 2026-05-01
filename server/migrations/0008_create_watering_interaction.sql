-- Up Migration
CREATE TABLE IF NOT EXISTS watering_interaction (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT NOT NULL REFERENCES anonymous_user(id) ON DELETE RESTRICT,
  target_user_id BIGINT NOT NULL REFERENCES anonymous_user(id) ON DELETE RESTRICT,
  interaction_date_kst DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_no_self_watering CHECK (actor_user_id <> target_user_id)
);

CREATE UNIQUE INDEX uq_watering_actor_target_day ON watering_interaction (actor_user_id, target_user_id, interaction_date_kst);
CREATE INDEX idx_watering_target_created ON watering_interaction (target_user_id, created_at DESC);
CREATE INDEX idx_watering_actor_created ON watering_interaction (actor_user_id, created_at DESC);

-- Down Migration
DROP TABLE IF EXISTS watering_interaction CASCADE;
