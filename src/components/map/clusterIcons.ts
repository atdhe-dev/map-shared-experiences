import L from 'leaflet'
import { THEME_COLORS } from '../../lib/themeColors'

export function createClusterIcon(cluster: { getChildCount(): number } & L.Layer): L.DivIcon {
  const count = cluster.getChildCount()
  const size = count < 10 ? 40 : count < 25 ? 46 : 52
  const fontSize = count < 10 ? 13 : count < 25 ? 14 : 15
  const gradId = `cg-${String((cluster as L.Layer & { _leaflet_id?: number })._leaflet_id ?? count)}`
  const { pinStroke, pinShadow, clusterLight, clusterDark } = THEME_COLORS

  return L.divIcon({
    html: `
      <div class="memory-cluster" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="${gradId}" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop stop-color="${clusterLight}"/>
              <stop offset="1" stop-color="${clusterDark}"/>
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="21" fill="url(#${gradId})" stroke="${pinStroke}" stroke-width="2.5"/>
          <circle cx="24" cy="24" r="17" fill="${pinShadow}" fill-opacity="0.12"/>
        </svg>
        <span class="memory-cluster-count" style="font-size:${fontSize}px">${count}</span>
      </div>
    `,
    className: 'memory-cluster-wrap',
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2),
  })
}
