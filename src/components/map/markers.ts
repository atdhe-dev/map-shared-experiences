import L from 'leaflet'
import { getEmotionColor, resolveEmotionColor } from '../../lib/emotionColors'

const DOT = 10
const DOT_ACTIVE = 14

function buildDotHtml(accent: string, active: boolean, size: number): string {
  return `
    <div class="memory-pin memory-pin--dot${active ? ' memory-pin--active' : ''}" aria-hidden="true">
      <span class="memory-pin__dot" style="--pin-accent: ${accent}; width: ${size}px; height: ${size}px;"></span>
    </div>
  `
}

function buildIconPinHtml(emotionColorId: string, active: boolean): { html: string; size: number } {
  const tint = getEmotionColor(emotionColorId)
  const size = active ? DOT_ACTIVE : DOT
  return { html: buildDotHtml(tint.accent, active, size), size }
}

/** Text-only pins — never render photos on the map. */
export function createExperienceIcon(
  categoryId: string,
  _imageUrl?: string | null,
  _markerId?: string,
  active = false,
  _messageType?: string | null,
  emotionColor?: string | null,
): L.DivIcon {
  const colorId = resolveEmotionColor(emotionColor, categoryId)
  const { html, size } = buildIconPinHtml(colorId, active)

  return L.divIcon({
    className: `custom-marker custom-marker--dot${active ? ' pin-active' : ''}`,
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 2)],
  })
}

export function createCategoryIcon(categoryId: string): L.DivIcon {
  return createExperienceIcon(categoryId)
}

export function createTempMarkerIcon(): L.DivIcon {
  return createExperienceIcon('memory', null, 'temp', true, 'memory', 'yellow')
}

export function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker custom-marker--user',
    html: `
      <div class="user-location-pin user-location-pin--compact" aria-hidden="true">
        <span class="user-location-pin__core"></span>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export const PIN_ICON_SIZE: [number, number] = [DOT, DOT]
export const PIN_ICON_ANCHOR: [number, number] = [DOT / 2, DOT / 2]
