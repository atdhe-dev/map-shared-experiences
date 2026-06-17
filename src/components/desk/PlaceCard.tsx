import type { CSSProperties } from 'react'
import { MapPin, Heart } from 'lucide-react'
import type { Experience } from '../../types'
import { getMessageTo } from '../../lib/messageHelpers'
import { truncateText } from '../../lib/format'

const SUBDOMAINS = ['a', 'b', 'c', 'd'] as const

function getMapTile(lat: number, lng: number, zoom = 13) {
  const n = Math.pow(2, zoom)
  const xtileF = ((lng + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const ytileF = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  const xtile = Math.floor(xtileF)
  const ytile = Math.floor(ytileF)
  const sub = SUBDOMAINS[Math.abs(xtile + ytile) % SUBDOMAINS.length]
  return {
    url: `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/${zoom}/${xtile}/${ytile}.png`,
    pinX: (xtileF - xtile) * 100,
    pinY: (ytileF - ytile) * 100,
  }
}

function getRotation(id: string): number {
  let h = 0
  for (let i = 0; i < Math.min(id.length, 8); i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return ((h % 280) - 140) / 100 // –1.4° to +1.4°
}

interface PlaceCardProps {
  experience: Experience
  onClick: (experience: Experience) => void
  compact?: boolean
}

export function PlaceCard({ experience, onClick, compact = false }: PlaceCardProps) {
  const messageTo = getMessageTo(experience)
  const { url, pinX, pinY } = getMapTile(experience.lat, experience.lng)
  const rotation = getRotation(experience.id)
  const locationLabel = experience.location_name
    ? experience.location_name.split(',')[0].trim()
    : null
  const excerpt = truncateText(experience.story, compact ? 55 : 90)

  return (
    <button
      type="button"
      className={`place-card${compact ? ' place-card--compact' : ''}`}
      onClick={() => onClick(experience)}
      aria-label={`Message to ${messageTo}`}
      style={{ '--place-rotation': `${rotation}deg` } as CSSProperties}
    >
      {/* Photo area — OSM tile + pin */}
      <div className="place-card__photo">
        <img
          src={url}
          alt=""
          className="place-card__tile"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
        {/* Accurately positioned pin */}
        <div
          className="place-card__pin-dot"
          style={{ left: `${pinX}%`, top: `${pinY}%` }}
          aria-hidden
        />
        {locationLabel && (
          <div className="place-card__location-badge" aria-hidden>
            <MapPin size={8} strokeWidth={2.5} />
            <span>{locationLabel}</span>
          </div>
        )}
      </div>

      {/* Polaroid strip */}
      <div className="place-card__strip">
        <span className="place-card__to-label">to</span>
        <span className="place-card__name">{messageTo}</span>
        <p className="place-card__excerpt">{excerpt}</p>
        {experience.reactions_count > 0 && (
          <div className="place-card__reactions" aria-label={`${experience.reactions_count} reactions`}>
            <Heart size={9} strokeWidth={2} aria-hidden />
            <span>{experience.reactions_count}</span>
          </div>
        )}
      </div>
    </button>
  )
}
