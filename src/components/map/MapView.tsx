import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import type { Experience, LatLng } from '../../types'
import {
  MAP_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MAX_ZOOM,
  MAP_MIN_ZOOM,
  NORTH_MACEDONIA_BOUNDS,
} from '../../lib/constants'
import { ExperienceMarkers } from './ExperienceMarkers'
import { MapControlsBubble } from './MapControlsBubble'
import { createTempMarkerIcon, createUserLocationIcon } from './markers'

interface MapViewProps {
  experiences: Experience[]
  onSelect: (experience: Experience) => void
  previewExperience?: Experience | null
  onPreviewClose?: () => void
  onPreviewReadMore?: (experience: Experience) => void
  selectMode?: boolean
  tempLocation?: LatLng | null
  onMapClick?: (latlng: LatLng) => void
  userLocation?: LatLng | null
  flyTo?: LatLng | null
  insetControls?: boolean
}

function FlyToLocation({ location }: { location: LatLng | null | undefined }) {
  const map = useMap()
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13, { duration: 1.2 })
    }
  }, [location, map])
  return null
}

function MapClickHandler({
  enabled,
  onMapClick,
  onBackgroundClick,
}: {
  enabled: boolean
  onMapClick?: (latlng: LatLng) => void
  onBackgroundClick?: () => void
}) {
  useMapEvents({
    click(e) {
      const target = e.originalEvent.target
      if (target instanceof Element) {
        if (
          target.closest(
            '.leaflet-marker-icon, .custom-marker, .memory-cluster, .pin-preview-overlay, .pin-popup-backdrop',
          )
        ) {
          return
        }
      }

      if (enabled && onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
        return
      }
      onBackgroundClick?.()
    },
  })
  return null
}

function CursorStyle({ selectMode }: { selectMode: boolean }) {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    container.style.cursor = selectMode ? 'crosshair' : ''
    return () => {
      container.style.cursor = ''
    }
  }, [selectMode, map])
  return null
}

function MapControls() {
  const map = useMap()

  useEffect(() => {
    const control = new L.Control({ position: 'bottomright' })

    control.onAdd = () => {
      const wrap = L.DomUtil.create('div', 'map-controls-bubble')
      const inner = L.DomUtil.create('div', 'map-controls-bubble__inner', wrap)

      const zoomIn = L.DomUtil.create('button', 'map-control-btn', inner)
      zoomIn.type = 'button'
      zoomIn.setAttribute('aria-label', 'Zoom in')
      zoomIn.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>'
      zoomIn.onclick = () => map.zoomIn()

      const zoomOut = L.DomUtil.create('button', 'map-control-btn', inner)
      zoomOut.type = 'button'
      zoomOut.setAttribute('aria-label', 'Zoom out')
      zoomOut.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>'
      zoomOut.onclick = () => map.zoomOut()

      L.DomUtil.create('span', 'map-controls-bubble__divider', inner)

      const locate = L.DomUtil.create('button', 'map-control-btn map-control-btn--locate', inner)
      locate.type = 'button'
      locate.setAttribute('aria-label', 'My location')
      locate.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>'
      locate.onclick = () => map.locate({ setView: true, maxZoom: 13 })

      L.DomEvent.disableClickPropagation(wrap)
      return wrap
    }

    control.addTo(map)
    return () => {
      control.remove()
    }
  }, [map])

  return null
}

export function MapView({
  experiences,
  onSelect,
  previewExperience = null,
  onPreviewClose,
  onPreviewReadMore,
  selectMode = false,
  tempLocation,
  onMapClick,
  userLocation,
  flyTo,
  insetControls = false,
}: MapViewProps) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      minZoom={MAP_MIN_ZOOM}
      maxZoom={MAP_MAX_ZOOM}
      maxBounds={NORTH_MACEDONIA_BOUNDS}
      maxBoundsViscosity={0.8}
      className="h-full w-full warm-map comfortable-map"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
      />
      <ExperienceMarkers
        experiences={experiences}
        onSelect={onSelect}
        previewExperience={previewExperience}
        onPreviewClose={onPreviewClose}
        onPreviewReadMore={onPreviewReadMore}
      />
      {tempLocation && (
        <Marker
          position={[tempLocation.lat, tempLocation.lng]}
          icon={createTempMarkerIcon()}
        />
      )}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={createUserLocationIcon()}
        />
      )}
      <FlyToLocation location={flyTo} />
      <MapClickHandler
        enabled={selectMode}
        onMapClick={onMapClick}
        onBackgroundClick={previewExperience ? onPreviewClose : undefined}
      />
      <CursorStyle selectMode={selectMode} />
      {insetControls ? <MapControlsBubble /> : <MapControls />}
    </MapContainer>
  )
}
