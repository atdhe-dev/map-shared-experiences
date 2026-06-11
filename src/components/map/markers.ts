import L from 'leaflet'
import { MARKER_SYMBOL_PATHS } from '../ui/CategoryIcon'
import { getCategoryTint } from '../../lib/categoryTints'
import { THEME_COLORS } from '../../lib/themeColors'

const WHITE = THEME_COLORS.pinStroke
const SHADOW = THEME_COLORS.pinShadow

/** Bloom pin layout constants */
const PIN_W = 52
const PIN_H = 60
const CX = 26
const CY = 22
const BUBBLE_R = 20
const INNER_R = 15.5
const ANCHOR_Y = 53

export const PIN_ICON_SIZE: [number, number] = [PIN_W, PIN_H]
export const PIN_ICON_ANCHOR: [number, number] = [CX, ANCHOR_Y + 2]

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, '')
}

function pinDefs(id: string, tint: ReturnType<typeof getCategoryTint>, extraDefs = '') {
  return `
    <defs>
      ${extraDefs}
      <linearGradient id="bubble-${id}" x1="${CX}" y1="${CY - BUBBLE_R}" x2="${CX}" y2="${CY + BUBBLE_R}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${tint.markerLight}"/>
        <stop offset="48%" stop-color="${tint.marker}"/>
        <stop offset="100%" stop-color="${tint.icon}"/>
      </linearGradient>
      <linearGradient id="anchor-${id}" x1="${CX}" y1="${ANCHOR_Y - 5}" x2="${CX}" y2="${ANCHOR_Y + 5}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${tint.markerLight}"/>
        <stop offset="100%" stop-color="${tint.marker}"/>
      </linearGradient>
      <radialGradient id="shine-${id}" cx="${CX - 4}" cy="${CY - 6}" r="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="white" stop-opacity="0.72"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
      <filter id="shadow-${id}" x="-50%" y="-40%" width="200%" height="200%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${SHADOW}" flood-opacity="0.22"/>
      </filter>
      <filter id="glow-${id}" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="${tint.accent}" flood-opacity="0.55"/>
      </filter>
    </defs>
  `
}

function iconMarkup(categoryId: string, iconColor: string): string {
  const symbol = MARKER_SYMBOL_PATHS[categoryId] ?? MARKER_SYMBOL_PATHS.other
  const paths = symbol
    .replace(/#F7F3ED/g, iconColor)
    .replace(/stroke="#F7F3ED"/g, `stroke="${iconColor}"`)
    .replace(/stroke-width="1.5"/g, 'stroke-width="2.1"')
    .replace(/stroke-width="2"/g, 'stroke-width="2.3"')

  return `
    <g transform="translate(${CX}, ${CY - 1})">
      <g transform="translate(-12, -12) scale(0.68)">
        ${paths}
      </g>
    </g>
  `
}

function buildBloomPinHtml(
  categoryId: string,
  id: string,
  active: boolean,
  innerContent: string,
  extraDefs = '',
): string {
  const tint = getCategoryTint(categoryId)
  const activeClass = active ? ' memory-pin--active' : ''

  return `
    <div class="memory-pin${activeClass}" aria-hidden="true">
      <svg width="${PIN_W}" height="${PIN_H}" viewBox="0 0 ${PIN_W} ${PIN_H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
        ${pinDefs(id, tint, extraDefs)}
        <g filter="url(#shadow-${id})" class="memory-pin__body">
          <ellipse cx="${CX}" cy="57" rx="9" ry="2.8" fill="${SHADOW}" opacity="0.12"/>
          ${active ? `<circle cx="${CX}" cy="${CY}" r="23.5" fill="none" stroke="${tint.accent}" stroke-width="2.5" stroke-opacity="0.55" class="memory-pin__halo"/>` : ''}
          <line x1="${CX}" y1="${CY + BUBBLE_R - 1}" x2="${CX}" y2="${ANCHOR_Y - 5}" stroke="${WHITE}" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="${CX}" cy="${ANCHOR_Y}" r="5" fill="url(#anchor-${id})" stroke="${WHITE}" stroke-width="2.5"/>
          <circle cx="${CX}" cy="${CY}" r="${BUBBLE_R + 1.5}" fill="${tint.markerGlow}" opacity="0.35"/>
          <circle cx="${CX}" cy="${CY}" r="${BUBBLE_R}" fill="url(#bubble-${id})" stroke="${WHITE}" stroke-width="3"/>
          <circle cx="${CX}" cy="${CY - 1}" r="${INNER_R}" fill="#fafaf8" stroke="${WHITE}" stroke-width="2"/>
          <circle cx="${CX}" cy="${CY - 1}" r="${INNER_R - 1}" fill="url(#shine-${id})" opacity="0.55"/>
          ${innerContent}
        </g>
      </svg>
    </div>
  `
}

function buildIconPinHtml(categoryId: string, id: string, active: boolean): string {
  const tint = getCategoryTint(categoryId)
  const inner = iconMarkup(categoryId, tint.icon)
  return buildBloomPinHtml(categoryId, id, active, inner)
}

function buildPhotoPinHtml(
  categoryId: string,
  imageUrl: string,
  id: string,
  active: boolean,
): string {
  const clipDef = `<clipPath id="photo-${id}"><circle cx="${CX}" cy="${CY - 1}" r="${INNER_R - 1.5}"/></clipPath>`
  const inner = `
    <image href="${escapeAttr(imageUrl)}" x="${CX - INNER_R + 1.5}" y="${CY - INNER_R - 0.5}"
      width="${(INNER_R - 1.5) * 2}" height="${(INNER_R - 1.5) * 2}"
      clip-path="url(#photo-${id})" preserveAspectRatio="xMidYMid slice"/>
    <circle cx="${CX}" cy="${CY - 1}" r="${INNER_R - 1.5}" fill="none" stroke="${WHITE}" stroke-width="1.5" opacity="0.9"/>
  `
  return buildBloomPinHtml(categoryId, id, active, inner, clipDef)
}

export function createExperienceIcon(
  categoryId: string,
  imageUrl?: string | null,
  markerId?: string,
  active = false,
): L.DivIcon {
  const id = sanitizeId(markerId ?? categoryId)
  const html = imageUrl
    ? buildPhotoPinHtml(categoryId, imageUrl, id, active)
    : buildIconPinHtml(categoryId, id, active)

  return L.divIcon({
    className: `custom-marker${active ? ' pin-active' : ''}`,
    html,
    iconSize: PIN_ICON_SIZE,
    iconAnchor: PIN_ICON_ANCHOR,
    popupAnchor: [0, -(PIN_ICON_ANCHOR[1] + 4)],
  })
}

export function createCategoryIcon(categoryId: string): L.DivIcon {
  return createExperienceIcon(categoryId)
}

export function createTempMarkerIcon(): L.DivIcon {
  return createExperienceIcon('life_moment', null, 'temp', true)
}

export function createUserLocationIcon(): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker custom-marker--user',
    html: `
      <div class="user-location-pin" aria-hidden="true">
        <span class="user-location-pin__pulse"></span>
        <span class="user-location-pin__ring"></span>
        <span class="user-location-pin__core"></span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}
