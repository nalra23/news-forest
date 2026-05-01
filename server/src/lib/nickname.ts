const ADJECTIVES = [
  '푸른',
  '맑은',
  '따뜻한',
  '차분한',
  '고요한',
  '싱그러운',
  '잔잔한',
  '햇살같은',
  '이슬맺힌',
  '바람부는',
] as const

const NOUNS = [
  '잎사귀',
  '새싹',
  '나무',
  '오솔길',
  '햇살',
  '이슬',
  '숲바람',
  '나무그늘',
  '들꽃',
  '솔방울',
] as const

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${adj}${noun}-${num}`
}
