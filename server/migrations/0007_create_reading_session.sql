-- Up Migration
CREATE TABLE IF NOT EXISTS reading_session (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES anonymous_user(id) ON DELETE RESTRICT,
  article_id BIGINT NOT NULL REFERENCES article(id) ON DELETE RESTRICT,
  status TEXT NOT NULL,
  max_scroll_pct NUMERIC(5, 4) NOT NULL DEFAULT 0,
  dwell_seconds INTEGER NOT NULL DEFAULT 0,
  is_suspicious BOOLEAN NOT NULL DEFAULT FALSE,
  client_metadata JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_status CHECK (status IN ('reading', 'completed', 'failed')),
  CONSTRAINT chk_scroll CHECK (max_scroll_pct >= 0 AND max_scroll_pct <= 1),
  CONSTRAINT chk_dwell CHECK (dwell_seconds >= 0),
  CONSTRAINT chk_completed_consistency CHECK (
    (status = 'completed') = (completed_at IS NOT NULL)
  )
);

CREATE INDEX idx_reading_session_user_article ON reading_session (user_id, article_id, started_at DESC);
CREATE INDEX idx_reading_session_user_status ON reading_session (user_id, status, started_at DESC);
CREATE INDEX idx_reading_session_completed ON reading_session (user_id, completed_at DESC) WHERE status = 'completed';
CREATE INDEX idx_reading_session_suspicious ON reading_session (is_suspicious, created_at DESC) WHERE is_suspicious = TRUE;

-- Down Migration
DROP TABLE IF EXISTS reading_session CASCADE;
