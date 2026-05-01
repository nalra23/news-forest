-- Up Migration
CREATE TABLE IF NOT EXISTS article (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  external_article_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  category_id SMALLINT NOT NULL REFERENCES article_category(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL,
  body_length INTEGER NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  external_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT chk_body_length CHECK (body_length >= 0),
  CONSTRAINT chk_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE UNIQUE INDEX uq_article_source_external ON article (source, external_article_id);
CREATE UNIQUE INDEX uq_article_slug ON article (slug);
CREATE INDEX idx_article_category_published ON article (category_id, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_article_published_at ON article (published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_article_metadata_gin ON article USING GIN (external_metadata);

-- Down Migration
DROP TABLE IF EXISTS article CASCADE;
