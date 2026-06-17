import { PenLine, LayoutGrid } from 'lucide-react'

export type AppViewMode = 'desk' | 'map'

interface HomeHudProps {
  viewMode: AppViewMode
  onExplore: () => void
  onWrite: () => void
  onToggleView: () => void
  exploreOpen?: boolean
  hidden?: boolean
}

export function HomeHud({ onWrite, onToggleView, hidden }: HomeHudProps) {
  if (hidden) return null

  return (
    <nav className="map-hud" aria-label="Map navigation">
      <button type="button" className="map-hud__wall-btn" onClick={onToggleView} aria-label="Back to wall">
        <LayoutGrid size={16} strokeWidth={2} aria-hidden />
        Wall
      </button>
      <button type="button" className="map-hud__write-btn" onClick={onWrite} aria-label="Write a note">
        <PenLine size={16} strokeWidth={2} aria-hidden />
        Write
      </button>
    </nav>
  )
}
