import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'

interface NoteLocationMapProps {
  lat: number
  lng: number
  locationName?: string | null
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 14, { animate: false })
  }, [lat, lng, map])
  return null
}

const pinIcon = L.divIcon({
  className: 'note-map-pin',
  html: '<span class="note-map-pin__dot" aria-hidden="true"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

export function NoteLocationMap({ lat, lng, locationName }: NoteLocationMapProps) {
  return (
    <section className="note-location-map" aria-label="Where this was written">
      <p className="note-location-map__label">
        {locationName?.trim() || 'Where it happened'}
      </p>
      <div className="note-location-map__frame">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          minZoom={10}
          maxZoom={16}
          scrollWheelZoom={false}
          dragging
          zoomControl={false}
          attributionControl={false}
          className="note-location-map__map"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png" />
          <Marker position={[lat, lng]} icon={pinIcon} />
          <Recenter lat={lat} lng={lng} />
        </MapContainer>
      </div>
    </section>
  )
}
