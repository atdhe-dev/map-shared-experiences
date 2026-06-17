import type { CSSProperties } from 'react'
import { MapPin, Heart } from 'lucide-react'
import type { Experience } from '../../types'
import { getMessageTo, getResolvedEmotionColor } from '../../lib/messageHelpers'
import { truncateText } from '../../lib/format'

const SUBDOMAINS = ['a', 'b', 'c', 'd'] as const
const TILE_BASE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager'

function tileUrl(x: number, y: number, zoom: number): string {
  const sub = SUBDOMAINS[Math.abs(x + y) % SUBDOMAINS.length]
  return TILE_BASE.replace('{s}', sub) + `/${zoom}/${x}/${y}.png`
}

function getMapTiles(lat: number, lng: number, zoom = 12) {
  const n = Math.pow(2, zoom)
  const xtileF = ((lng + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const ytileF =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  const xCenter = Math.floor(xtileF)
  const yCenter = Math.floor(ytileF)
  const x0 = xCenter - 1
  const y0 = yCenter - 1

  const tiles: string[] = []
  for (let dy = 0; dy < 2; dy++) {
    for (let dx = 0; dx < 2; dx++) {
      tiles.push(tileUrl(x0 + dx, y0 + dy, zoom))
    }
  }

  return {
    tiles,
    pinX: ((xtileF - x0) / 2) * 100,
    pinY: ((ytileF - y0) / 2) * 100,
  }
}

function getRotation(id: string): number {
  let h = 0
  for (let i = 0; i < Math.min(id.length, 8); i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return ((h % 500) - 250) / 100 // –2.5° to +2.5°
}

function getYOffset(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) | 0
  }
  return (h % 7) - 3 // –3px to +3px
}

function getExcerptConfig(story: string, compact: boolean) {
  if (compact) return { maxLen: 55, lines: 2 }
  const len = story.length
  if (len > 140) return { maxLen: 130, lines: 4 }
  if (len > 70) return { maxLen: 95, lines: 3 }
  return { maxLen: 60, lines: 2 }
}

interface PlaceCardProps {
  experience: Experience
  onClick: (experience: Experience) => void
  compact?: boolean
}

export function PlaceCard({ experience, onClick, compact = false }: PlaceCardProps) {
  const messageTo = getMessageTo(experience)
  const emotion = getResolvedEmotionColor(experience)
  const { tiles, pinX, pinY } = getMapTiles(experience.lat, experience.lng)
  const rotation = getRotation(experience.id)
  const yOffset = getYOffset(experience.id)
  const locationLabel = experience.location_name
    ? experience.location_name.split(',')[0].trim()
    : null
  const { maxLen, lines } = getExcerptConfig(experience.story, compact)
  const excerpt = truncateText(experience.story, maxLen)

  return (
    <button
      type="button"
      className={`place-card${compact ? ' place-card--compact' : ''}`}
      onClick={() => onClick(experience)}
      aria-label={`Message to ${messageTo}`}
      style={
        {
          '--place-rotation': `${rotation}deg`,
          '--place-y-offset': `${yOffset}px`,
          '--place-strip-bg': emotion.soft,
          '--place-excerpt-lines': lines,
        } as CSSProperties
      }
    >
      <div className="place-card__photo">
        <div className="place-card__tile-grid" aria-hidden>
          {tiles.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="place-card__tile-cell"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
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

export function getPlaceLabel(experience: Experience): string | null {
  const name = experience.location_name?.trim()
  if (!name) return null
  return name.split(',')[0].trim()
}
