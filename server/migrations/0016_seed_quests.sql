-- Up Migration
-- 기본 quest template 4종 seed.
-- target_action: 'READ_ARTICLE' / 'WATERING'
-- active_from/to 는 먼 미래까지 — 매일/주마다 반복 발급되며 quest_participation.period_key 로 구분.

INSERT INTO quest (code, title, description, quest_type, target_action, target_count, reward_points, active_from, active_to)
VALUES
  ('daily-read-1', '오늘 기사 1편 읽기', '하루 한 번의 작은 시작.', 'DAILY', 'READ_ARTICLE', 1, 5, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 years'),
  ('daily-read-3', '오늘 기사 3편 읽기', '꾸준한 독서로 하루를 채워요.', 'DAILY', 'READ_ARTICLE', 3, 15, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 years'),
  ('daily-watering-1', '오늘 누군가에게 물 주기', '다른 사용자의 나무에 응원을.', 'DAILY', 'WATERING', 1, 3, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 years'),
  ('weekly-read-10', '이번 주 기사 10편 읽기', '한 주 동안 꾸준히 읽어요.', 'WEEKLY', 'READ_ARTICLE', 10, 30, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 years'),
  ('weekly-watering-5', '이번 주 5명에게 물 주기', '서로 응원하는 한 주.', 'WEEKLY', 'WATERING', 5, 15, NOW() - INTERVAL '1 day', NOW() + INTERVAL '5 years')
ON CONFLICT (code) DO NOTHING;

-- Down Migration
DELETE FROM quest WHERE code IN ('daily-read-1', 'daily-read-3', 'daily-watering-1', 'weekly-read-10', 'weekly-watering-5');
