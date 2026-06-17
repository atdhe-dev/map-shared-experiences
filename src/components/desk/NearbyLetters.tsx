import type { Experience } from '../../types'
import { PlaceCard } from './PlaceCard'

interface NearbyLettersProps {
  experiences: Experience[]
  onRead: (experience: Experience) => void
}

export function NearbyLetters({ experiences, onRead }: NearbyLettersProps) {
  if (experiences.length === 0) return null

  return (
    <section className="nearby-letters">
      <p className="nearby-letters__heading">Near this place</p>
      <div className="nearby-letters__scroll" role="list">
        {experiences.map((exp) => (
          <div key={exp.id} className="nearby-letters__item" role="listitem">
            <PlaceCard experience={exp} onClick={onRead} compact />
          </div>
        ))}
      </div>
    </section>
  )
}

export function getNearby(
  all: Experience[],
  center: Experience,
  maxCount = 4,
  radiusKm = 30,
): Experience[] {
  return all
    .filter((e) => e.id !== center.id)
    .map((e) => ({
      exp: e,
      dist: haversineKm(center.lat, center.lng, e.lat, e.lng),
    }))
    .filter(({ dist }) => dist <= radiusKm)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, maxCount)
    .map(({ exp }) => exp)
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
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
