import { useCallback, useEffect, useState } from 'react'
import type { LatLng } from '../types'

type GeoStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error'

export function useGeolocation() {
  const [location, setLocation] = useState<LatLng | null>(null)
  const [status, setStatus] = useState<GeoStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error')
      setError('Geolocation is not supported by your browser.')
      return
    }

    setStatus('loading')
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('granted')
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied')
          setError('Location permission denied. You can still explore the map.')
        } else {
          setStatus('error')
          setError('Could not get your location. Please try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  return { location, status, error, requestLocation }
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    setMatches(mq.matches)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

export function useLocalStorageBoolean(key: string): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) === 'true'
    } catch {
      return false
    }
  })

  const setStored = useCallback(
    (v: boolean) => {
      setValue(v)
      try {
        localStorage.setItem(key, String(v))
      } catch {
        /* ignore */
      }
    },
    [key],
  )

  return [value, setStored]
}
