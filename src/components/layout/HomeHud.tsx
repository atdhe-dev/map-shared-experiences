import { Search, PenLine, Map as MapIcon } from 'lucide-react'

export type AppViewMode = 'desk' | 'map'

interface HomeHudProps {
  viewMode: AppViewMode
  onExplore: () => void
  onWrite: () => void
  onToggleView: () => void
  exploreOpen?: boolean
  hidden?: boolean
}

export function HomeHud({
  viewMode,
  onExplore,
  onWrite,
  onToggleView,
  exploreOpen,
  hidden,
}: HomeHudProps) {
  if (hidden) return null

  const isDesk = viewMode === 'desk'

  return (
    <nav className="wall-hud" aria-label="Navigation">
      <button
        type="button"
        className={`wall-hud__icon-btn${exploreOpen ? ' wall-hud__icon-btn--active' : ''}`}
        onClick={onExplore}
        aria-label="Search"
      >
        <Search size={18} strokeWidth={2} aria-hidden />
      </button>

      <button type="button" className="wall-hud__write-btn" onClick={onWrite}>
        <PenLine size={16} strokeWidth={2} aria-hidden />
        <span>Write</span>
      </button>

      <button
        type="button"
        className="wall-hud__icon-btn"
        onClick={onToggleView}
        aria-label={isDesk ? 'Map' : 'Wall'}
      >
        <MapIcon size={18} strokeWidth={2} aria-hidden />
      </button>
    </nav>
  )
}
