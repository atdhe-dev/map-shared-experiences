import type { Map as LeafletMap } from 'leaflet'

/** Pan the map so the selected pin sits below the full-screen preview card. */
export function centerPinForPreview(map: LeafletMap, lat: number, lng: number) {
  const size = map.getSize()
  const pin = map.latLngToContainerPoint([lat, lng])

  const targetX = size.x / 2
  const targetY = size.y - 72

  const dx = targetX - pin.x
  const dy = targetY - pin.y

  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    map.panBy([dx, dy], { animate: true, duration: 0.35, easeLinearity: 0.25 })
  }
}
