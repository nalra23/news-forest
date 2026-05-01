-- Up Migration
-- Quest 가 daily/weekly 로 반복되도록 period_key 컬럼 추가.
-- daily: 'YYYY-MM-DD' (KST 일자), weekly: 'YYYY-Www' (KST 주차).

ALTER TABLE quest_participation ADD COLUMN period_key TEXT;

-- 기존 UNIQUE(user_id, quest_id) 를 (user_id, quest_id, period_key) 로 교체.
DROP INDEX IF EXISTS uq_quest_participation;

CREATE UNIQUE INDEX uq_quest_participation_period
  ON quest_participation (user_id, quest_id, period_key);

CREATE INDEX idx_quest_participation_period_active
  ON quest_participation (user_id, period_key, completed_at);

-- Down Migration
DROP INDEX IF EXISTS uq_quest_participation_period;
DROP INDEX IF EXISTS idx_quest_participation_period_active;
CREATE UNIQUE INDEX uq_quest_participation
  ON quest_participation (user_id, quest_id);
ALTER TABLE quest_participation DROP COLUMN IF EXISTS period_key;
