import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import L from 'leaflet'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import { Link } from 'react-router-dom'
import { TREE_STAGE_DISPLAY } from '@/lib/tree'
import type { MockForestUser } from '@/mocks'

export interface NearbyMapUser extends MockForestUser {
  lat: number
  lng: number
}

export interface NearbyMapProps {
  center: [number, number]
  users: NearbyMapUser[]
  isFallback?: boolean
}

const myLocationIcon = L.divIcon({
  html: `<div class="relative flex h-4 w-4 items-center justify-center">
    <span class="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"></span>
    <span class="relative h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-md"></span>
  </div>`,
  className: 'nf-marker-self',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const treeMarkerIcon = L.divIcon({
  html: `<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-base shadow-lift ring-2 ring-primary">
    <span aria-hidden>🌳</span>
  </div>`,
  className: 'nf-marker-tree',
  iconSize: [40, 40],
  iconAnchor: [20, 38],
  popupAnchor: [0, -36],
})

function RecenterOnChange({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export function NearbyMap({ center, users }: NearbyMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={center} icon={myLocationIcon}>
        <Popup>
          <div className="text-sm font-semibold">나의 위치</div>
        </Popup>
      </Marker>
      {users.map((u) => (
        <Marker
          key={u.publicId}
          position={[u.lat, u.lng]}
          icon={treeMarkerIcon}
        >
          <Popup>
            <div className="min-w-[170px] space-y-2">
              <div>
                <p className="text-sm font-bold leading-tight">
                  {u.nickname}
                </p>
                <p className="text-xs text-fg-muted">
                  {TREE_STAGE_DISPLAY[u.treeStage]}
                  <span className="mx-1">·</span>
                  <span className="numeric">{u.totalPoints}P</span>
                </p>
              </div>
              <Link to={`/forest/u/${u.publicId}`} className="block">
                <button
                  type="button"
                  className="w-full rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition-colors hover:bg-primary-700"
                >
                  💧 물 주러 가기
                </button>
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
      <RecenterOnChange center={center} />
    </MapContainer>
  )
}
