-- Up Migration
CREATE TABLE IF NOT EXISTS article_category (
  id SMALLSERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  sort_order SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_article_category_code ON article_category (code);

-- Down Migration
DROP TABLE IF EXISTS article_category CASCADE;
