export interface Category {
  code: string
  displayName: string
  emoji: string
}

export const CATEGORIES: Category[] = [
  { code: 'politics', displayName: '정치', emoji: '🏛️' },
  { code: 'economy', displayName: '경제', emoji: '📈' },
  { code: 'society', displayName: '사회', emoji: '👥' },
  { code: 'it', displayName: 'IT', emoji: '💻' },
  { code: 'culture', displayName: '문화', emoji: '🎨' },
  { code: 'sports', displayName: '스포츠', emoji: '⚽' },
]

export function findCategory(code: string): Category | undefined {
  return CATEGORIES.find((c) => c.code === code)
}

export const CATEGORY_NAMES_BY_CODE: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.code, c.displayName]),
)
