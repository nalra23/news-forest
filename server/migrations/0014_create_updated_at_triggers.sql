-- Up Migration
-- ERD §11.3 — updated_at 자동 갱신 trigger function
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_anonymous_user
  BEFORE UPDATE ON anonymous_user
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_article
  BEFORE UPDATE ON article
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_reading_session
  BEFORE UPDATE ON reading_session
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_tree
  BEFORE UPDATE ON tree
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER set_updated_at_quest_participation
  BEFORE UPDATE ON quest_participation
  FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Down Migration
DROP TRIGGER IF EXISTS set_updated_at_anonymous_user ON anonymous_user;
DROP TRIGGER IF EXISTS set_updated_at_article ON article;
DROP TRIGGER IF EXISTS set_updated_at_reading_session ON reading_session;
DROP TRIGGER IF EXISTS set_updated_at_tree ON tree;
DROP TRIGGER IF EXISTS set_updated_at_quest_participation ON quest_participation;
DROP FUNCTION IF EXISTS trg_set_updated_at();
