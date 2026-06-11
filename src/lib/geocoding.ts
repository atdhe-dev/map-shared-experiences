import type { GeocodingResult } from '../types'
import { NORTH_MACEDONIA_BOUNDS } from './constants'

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
}

function isWithinNorthMacedonia(lat: number, lng: number): boolean {
  const [[minLat, minLng], [maxLat, maxLng]] = NORTH_MACEDONIA_BOUNDS
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
}

export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    countrycodes: 'mk',
    limit: '8',
    addressdetails: '0',
  })

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
        'User-Agent': 'SharedExperiencesMK/1.0 (map-shared-experiences)',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Location search failed. Please try again.')
  }

  const data = (await response.json()) as NominatimResult[]

  return data
    .map((item) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }))
    .filter((item) => isWithinNorthMacedonia(item.lat, item.lng))
}

export function shortenPlaceName(name: string): string {
  const parts = name.split(',').map((p) => p.trim())
  return parts.slice(0, 3).join(', ')
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
