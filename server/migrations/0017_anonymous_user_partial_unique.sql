-- Up Migration
DROP INDEX IF EXISTS uq_anonymous_user_hash;
CREATE UNIQUE INDEX uq_anonymous_user_hash
  ON anonymous_user (anonymous_hash)
  WHERE deleted_at IS NULL;

-- Down Migration
DROP INDEX IF EXISTS uq_anonymous_user_hash;
CREATE UNIQUE INDEX uq_anonymous_user_hash
  ON anonymous_user (anonymous_hash);
