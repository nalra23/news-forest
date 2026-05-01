-- Up Migration
CREATE TABLE IF NOT EXISTS recommendation_log (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES anonymous_user(id) ON DELETE RESTRICT,
  article_id BIGINT NOT NULL REFERENCES article(id) ON DELETE RESTRICT,
  section TEXT NOT NULL,
  score NUMERIC(8, 4),
  shown_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  clicked_at TIMESTAMPTZ,

  CONSTRAINT chk_section CHECK (section IN ('for-you', 'trending', 'recent', 'categories'))
);

CREATE INDEX idx_recommendation_user_shown ON recommendation_log (user_id, shown_at DESC);
CREATE INDEX idx_recommendation_article ON recommendation_log (article_id, shown_at DESC);
CREATE INDEX idx_recommendation_section ON recommendation_log (section, shown_at DESC);

-- Down Migration
DROP TABLE IF EXISTS recommendation_log CASCADE;
