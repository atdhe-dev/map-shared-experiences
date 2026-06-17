import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { Marker, useMap, useMapEvents } from 'react-leaflet'
import type { Experience } from '../../types'
import { NORTH_MACEDONIA_BOUNDS } from '../../lib/constants'
import { createExperienceIcon } from './markers'
import { AnchoredPinPopup } from './AnchoredPinPopup'

interface ExperienceMarkersProps {
  experiences: Experience[]
  onSelect: (experience: Experience) => void
  previewExperience?: Experience | null
  onPreviewClose?: () => void
  onPreviewReadMore?: (experience: Experience) => void
}

function MapInvalidator() {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100)
    const handleResize = () => map.invalidateSize()
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [map])
  return null
}

function BoundsEnforcer() {
  const map = useMap()
  const mkBounds = useMemo(() => L.latLngBounds(NORTH_MACEDONIA_BOUNDS), [])

  useMapEvents({
    dragend: () => {
      map.panInsideBounds(mkBounds, { animate: true })
    },
    zoomend: () => {
      map.invalidateSize({ pan: false })
    },
  })

  useEffect(() => {
    map.panInsideBounds(mkBounds, { animate: false })
  }, [map, mkBounds])

  return null
}

export function ExperienceMarkers({
  experiences,
  onSelect,
  previewExperience = null,
  onPreviewClose,
  onPreviewReadMore,
}: ExperienceMarkersProps) {
  const showPreview = previewExperience != null && onPreviewClose && onPreviewReadMore

  return (
    <>
      <MapInvalidator />
      <BoundsEnforcer />
      {showPreview && (
        <AnchoredPinPopup
          experience={previewExperience}
          onClose={onPreviewClose}
          onReadMore={onPreviewReadMore}
        />
      )}
      {experiences.map((exp) => {
        const isActive = previewExperience?.id === exp.id
        return (
          <Marker
            key={exp.id}
            position={[exp.lat, exp.lng]}
            icon={createExperienceIcon(
              exp.category,
              exp.image_url,
              exp.id,
              isActive,
              exp.message_type,
              exp.emotion_color,
            )}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e.originalEvent)
                onSelect(exp)
              },
            }}
          />
        )
      })}
    </>
  )
}

export { MapInvalidator, BoundsEnforcer }
