import { useCallback, useEffect, useState } from 'react'

export const SEOUL_CITY_HALL = { lat: 37.5665, lng: 126.978 }

export interface GeoPosition {
  lat: number
  lng: number
  accuracy?: number
  source: 'gps' | 'fallback'
}

export type PermissionState = 'unknown' | 'prompt' | 'granted' | 'denied'

interface State {
  position: GeoPosition | null
  loading: boolean
  permission: PermissionState
  error: string | null
}

export interface UseGeolocationReturn extends State {
  request: () => Promise<void>
  useFallback: () => void
}

/**
 * Browser Geolocation API wrapper. opt-in.
 * 거부/실패 시 useFallback() 으로 서울 시청 좌표 사용 가능.
 * Note: 실제 좌표는 메모리에서만 사용 — 서버에 전송하거나 localStorage에 저장하지 않음.
 */
export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<State>({
    position: null,
    loading: false,
    permission: 'unknown',
    error: null,
  })

  // Detect existing permission state on mount
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      setState((s) => ({ ...s, permission: 'prompt' }))
      return
    }
    navigator.permissions
      .query({ name: 'geolocation' as PermissionName })
      .then((status) => {
        setState((s) => ({
          ...s,
          permission: status.state as PermissionState,
        }))
      })
      .catch(() => {
        setState((s) => ({ ...s, permission: 'prompt' }))
      })
  }, [])

  const request = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: '브라우저가 위치 정보를 지원하지 않아요',
        permission: 'denied',
      }))
      return
    }
    setState((s) => ({ ...s, loading: true, error: null }))

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setState({
            position: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              source: 'gps',
            },
            loading: false,
            permission: 'granted',
            error: null,
          })
          resolve()
        },
        (err) => {
          setState({
            position: null,
            loading: false,
            permission: err.code === 1 ? 'denied' : 'prompt',
            error: err.message,
          })
          resolve()
        },
        {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 5 * 60 * 1000,
        },
      )
    })
  }, [])

  const useFallback = useCallback(() => {
    setState({
      position: { ...SEOUL_CITY_HALL, source: 'fallback' },
      loading: false,
      permission: 'denied',
      error: null,
    })
  }, [])

  return { ...state, request, useFallback }
}
