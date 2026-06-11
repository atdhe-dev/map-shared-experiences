import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-leaflet'
import { MapPin, Heart, ChevronRight, X } from 'lucide-react'
import type { Experience } from '../../types'
import { getCategory } from '../../lib/categories'
import { getCategoryTint } from '../../lib/categoryTints'
import { getAuthorDisplay, truncateText, timeAgo } from '../../lib/format'
import { CategoryIcon } from '../ui/CategoryIcon'
import { centerPinForPreview } from './popupInView'

interface AnchoredPinPopupProps {
  experience: Experience | null
  onClose: () => void
  onReadMore: (experience: Experience) => void
}

export function AnchoredPinPopup({
  experience,
  onClose,
  onReadMore,
}: AnchoredPinPopupProps) {
  const map = useMap()
  const cardRef = useRef<HTMLElement>(null)
  const centeredRef = useRef<string | null>(null)

  useEffect(() => {
    if (!experience) {
      centeredRef.current = null
      return
    }

    const key = `${experience.id}:${experience.lat}:${experience.lng}`
    if (centeredRef.current === key) return
    centeredRef.current = key

    const run = () => {
      centerPinForPreview(map, experience.lat, experience.lng)
    }

    run()
    const t = window.setTimeout(run, 120)

    return () => window.clearTimeout(t)
  }, [map, experience])

  if (!experience) return null

  const cat = getCategory(experience.category)
  const tint = getCategoryTint(experience.category)

  return createPortal(
    <div className="pin-preview-overlay" role="presentation">
      <button
        type="button"
        className="pin-preview-overlay__backdrop"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClose()
        }}
        aria-label="Close story preview"
      />
      <div
        className="pin-preview-overlay__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={experience.title}
      >
        <article ref={cardRef} className="memory-popup pin-preview-card">
          <button
            type="button"
            className={`memory-popup-close${experience.image_url ? ' memory-popup-close--on-image' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} />
          </button>

          {experience.image_url ? (
            <div className="memory-popup-hero pin-preview-card__hero">
              <img src={experience.image_url} alt="" loading="eager" />
              <div className="memory-popup-hero-overlay pin-preview-card__hero-overlay" />
              <span
                className="memory-popup-badge pin-preview-card__badge"
                style={{ backgroundColor: tint.bgDeep, color: tint.icon, borderColor: tint.accent }}
              >
                <CategoryIcon categoryId={experience.category} size={14} strokeWidth={1.75} />
                {cat.label}
              </span>
            </div>
          ) : (
            <div
              className="memory-popup-header-band pin-preview-card__header-band"
              style={{ background: `linear-gradient(135deg, ${tint.bgDeep} 0%, ${tint.bg} 100%)` }}
            >
              <span className="pin-preview-card__placeholder-icon" style={{ color: tint.icon }}>
                <CategoryIcon categoryId={experience.category} size={72} strokeWidth={1.25} />
              </span>
              <span
                className="memory-popup-badge memory-popup-badge--inline pin-preview-card__badge"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: tint.icon }}
              >
                <CategoryIcon categoryId={experience.category} size={14} strokeWidth={1.75} />
                {cat.label}
              </span>
            </div>
          )}

          <div className="memory-popup-body pin-preview-card__body">
            {experience.location_name && (
              <p className="memory-popup-location pin-preview-card__location">
                <MapPin size={14} strokeWidth={1.75} style={{ color: tint.accent }} />
                {experience.location_name}
              </p>
            )}

            <h3 className="memory-popup-title font-display pin-preview-card__title">{experience.title}</h3>
            <p className="memory-popup-excerpt pin-preview-card__excerpt">{truncateText(experience.story, 220)}</p>

            <div className="memory-popup-meta pin-preview-card__meta">
              <span>{getAuthorDisplay(experience)}</span>
              <span className="memory-popup-dot">·</span>
              <span>{timeAgo(experience.created_at)}</span>
            </div>

            {experience.reactions_count > 0 && (
              <p className="memory-popup-touched pin-preview-card__touched">
                <Heart size={13} strokeWidth={1.75} className="fill-current" />
                {experience.reactions_count} touched
              </p>
            )}

            <button
              type="button"
              className="memory-popup-cta pin-preview-card__cta"
              onClick={(e) => {
                e.stopPropagation()
                onReadMore(experience)
              }}
            >
              Read full story
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </div>
        </article>
      </div>
    </div>,
    document.body,
  )
}
