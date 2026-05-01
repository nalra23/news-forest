-- Up Migration
CREATE TABLE IF NOT EXISTS anonymous_user (
  id BIGSERIAL PRIMARY KEY,
  public_id UUID NOT NULL,
  anonymous_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  preferred_categories TEXT[] DEFAULT NULL,
  onboarding_completed_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT chk_anon_hash_length CHECK (LENGTH(anonymous_hash) = 64),
  CONSTRAINT chk_nickname_length CHECK (LENGTH(nickname) BETWEEN 1 AND 30)
);

CREATE UNIQUE INDEX uq_anonymous_user_public_id ON anonymous_user (public_id);
CREATE UNIQUE INDEX uq_anonymous_user_hash ON anonymous_user (anonymous_hash);
CREATE INDEX idx_anonymous_user_last_active_at ON anonymous_user (last_active_at DESC);
CREATE INDEX idx_anonymous_user_deleted_at ON anonymous_user (deleted_at) WHERE deleted_at IS NOT NULL;

-- Down Migration
DROP TABLE IF EXISTS anonymous_user CASCADE;
