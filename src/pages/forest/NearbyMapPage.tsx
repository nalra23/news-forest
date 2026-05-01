import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NearbyMap } from '@/components/forest'
import { Button, Card } from '@/components/ui'
import { useGeolocation } from '@/lib/geolocation'
import { getItem, setItem } from '@/lib/storage'
import { MOCK_FOREST_USERS } from '@/mocks'

const NOTICE_KEY = 'nearby-notice-shown'

export function NearbyMapPage() {
  const geo = useGeolocation()
  const [showNotice, setShowNotice] = useState(false)

  useEffect(() => {
    const seen = getItem<boolean>(NOTICE_KEY)
    if (!seen) setShowNotice(true)
  }, [])

  const dismissNotice = () => {
    setItem(NOTICE_KEY, true)
    setShowNotice(false)
  }

  const center: [number, number] | null = geo.position
    ? [geo.position.lat, geo.position.lng]
    : null

  const users = useMemo(() => {
    if (!center) return []
    return MOCK_FOREST_USERS.map((u) => ({
      ...u,
      lat: center[0] + u.locationOffset.dLat,
      lng: center[1] + u.locationOffset.dLng,
    }))
  }, [center])

  const isFallback = geo.position?.source === 'fallback'
  const isDenied = geo.permission === 'denied' && !geo.position
  const showRequest = !geo.position && !isDenied

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6 desktop:py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight desktop:text-4xl">
          🗺️ 주변의 숲
        </h1>
        <p className="text-sm text-fg-muted">
          내 주변에서 News Forest를 사용하는 다른 사용자를 만나보세요. 위치는
          ±300m 랜덤화되어 표시돼요.
        </p>
      </header>

      {showNotice && (
        <Card variant="soft" padding="md" className="bg-primary-50/60">
          <div className="flex items-start gap-3">
            <span className="text-xl" aria-hidden>
              👋
            </span>
            <div className="flex-1 space-y-1.5">
              <p className="text-sm font-bold">개인정보 안내</p>
              <p className="text-xs leading-relaxed text-fg-muted">
                다른 사용자의 위치는 ±300m 정도로 랜덤화되어 표시돼요. 정확한
                집·회사 위치는 절대 노출되지 않습니다. 내 위치도 동일한 방식으로
                다른 사용자에게 보여져요.
              </p>
              <Button size="sm" variant="ghost" onClick={dismissNotice}>
                확인했어요
              </Button>
            </div>
          </div>
        </Card>
      )}

      {showRequest && (
        <Card variant="soft" padding="lg">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-4xl" aria-hidden>
              📍
            </span>
            <p className="text-base font-bold">위치 정보가 필요해요</p>
            <p className="max-w-sm text-sm text-fg-muted">
              주변 사용자의 나무를 보여드리려면 현재 위치가 필요해요. 데이터는
              브라우저 메모리에서만 사용되고 서버나 저장소에 저장되지 않아요.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Button
                onClick={() => void geo.request()}
                loading={geo.loading}
              >
                위치 사용 허용
              </Button>
              <Button variant="ghost" onClick={geo.useFallback}>
                서울 시청에서 시작
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isDenied && (
        <Card variant="soft" padding="md" className="bg-warn/10">
          <div className="space-y-2">
            <p className="text-sm font-bold">위치 사용이 차단됐어요</p>
            <p className="text-xs text-fg-muted">
              브라우저 설정에서 위치 권한을 허용하시거나, 데모용으로 서울 시청
              위치에서 둘러보실 수 있어요.
            </p>
            <Button size="sm" onClick={geo.useFallback}>
              서울 시청에서 시작
            </Button>
          </div>
        </Card>
      )}

      {center && (
        <div className="h-[60dvh] overflow-hidden rounded-2xl shadow-soft desktop:h-[70dvh]">
          <NearbyMap center={center} users={users} isFallback={isFallback} />
        </div>
      )}

      {isFallback && (
        <p className="text-center text-xs text-fg-muted">
          📍 데모용 — 서울 시청 위치에서 표시 중. 정확한 내 주변을 보려면 위치
          권한을 허용해주세요.
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <Link to="/forest/me">
          <Button variant="ghost" size="sm">
            ← 내 숲
          </Button>
        </Link>
        <Link to="/forest/explore">
          <Button variant="ghost" size="sm">
            카드로 둘러보기
          </Button>
        </Link>
      </div>
    </div>
  )
}
