import type { TreeStage } from '@/lib/tree'

export interface MockForestUser {
  publicId: string
  nickname: string
  treeStage: TreeStage
  totalPoints: number
  /** 사용자 현재 위치를 기준으로 한 상대 좌표 오프셋 (도 단위). map 표시용. */
  locationOffset: { dLat: number; dLng: number }
}

const NICKNAMES = [
  '푸른잎사귀-3142',
  '맑은새싹-1023',
  '따뜻한오솔길-7421',
  '차분한이슬-5577',
  '고요한숲바람-2810',
  '싱그러운나무-9201',
  '잔잔한들꽃-4452',
  '햇살같은나무그늘-6321',
  '이슬맺힌솔방울-1928',
  '바람부는잎사귀-8810',
  '푸른햇살-3030',
  '맑은나무-7766',
  '따뜻한새싹-1188',
  '차분한오솔길-2245',
  '고요한이슬-9090',
  '싱그러운숲바람-4321',
]

const STAGES: TreeStage[] = ['SEED', 'SPROUT', 'TREE', 'FOREST']
const POINTS_BY_STAGE: Record<TreeStage, number> = {
  SEED: 20,
  SPROUT: 110,
  TREE: 320,
  FOREST: 760,
}

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 사용자 publicId 기반 stable seeded random 으로 위치 offset 생성.
 * 각 사용자별로 고정 offset (재로드 시 동일 위치).
 * 반경 maxKm 내 균등 분포 (sqrt 보정).
 *
 * 1° lat ≈ 111 km / 1° lng ≈ 111 * cos(lat) km (Seoul 기준 약 88 km)
 */
function generateLocationOffset(seed: string, maxKm: number) {
  const rng = mulberry32(hashCode(seed))
  const r = Math.sqrt(rng()) * maxKm
  const angle = rng() * 2 * Math.PI
  const dLat = (r * Math.cos(angle)) / 111
  const dLng = (r * Math.sin(angle)) / (111 * Math.cos((37.5 * Math.PI) / 180))
  return { dLat, dLng }
}

export const MOCK_FOREST_USERS: MockForestUser[] = NICKNAMES.map((nickname, i) => {
  const stage = STAGES[i % STAGES.length]
  const publicId = `mock-${String(i + 1).padStart(3, '0')}-${stage.toLowerCase()}`
  return {
    publicId,
    nickname,
    treeStage: stage,
    totalPoints: POINTS_BY_STAGE[stage],
    // 1~4km 사이 분포 — 너무 가깝지도 멀지도 않게
    locationOffset: generateLocationOffset(publicId, 4),
  }
})

export function findForestUserByPublicId(
  publicId: string,
): MockForestUser | undefined {
  return MOCK_FOREST_USERS.find((u) => u.publicId === publicId)
}
