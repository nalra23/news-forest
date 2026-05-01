-- Up Migration
-- ERD §3.2 — 카테고리 6종 (CLAUDE.md / IA §6.1 일관)
INSERT INTO article_category (code, display_name, sort_order) VALUES
  ('politics', '정치', 1),
  ('economy', '경제', 2),
  ('society', '사회', 3),
  ('it', 'IT', 4),
  ('culture', '문화', 5),
  ('sports', '스포츠', 6)
ON CONFLICT (code) DO NOTHING;

-- ERD §3.7 — Tree 4단계 thresholds (CLAUDE.md §2 절대 룰)
INSERT INTO tree_growth_stage (code, display_name, min_points, sort_order) VALUES
  ('SEED',   '씨앗', 0,   1),
  ('SPROUT', '새싹', 50,  2),
  ('TREE',   '나무', 200, 3),
  ('FOREST', '숲',   500, 4)
ON CONFLICT (code) DO NOTHING;

-- Down Migration
DELETE FROM tree_growth_stage WHERE code IN ('SEED', 'SPROUT', 'TREE', 'FOREST');
DELETE FROM article_category WHERE code IN ('politics', 'economy', 'society', 'it', 'culture', 'sports');
