import { Search, SquarePen, Map as MapIcon } from 'lucide-react'

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
    <nav className="apple-tab-bar" aria-label="Navigation">
      <button
        type="button"
        className={`apple-tab-bar__item${exploreOpen ? ' apple-tab-bar__item--active' : ''}`}
        onClick={onExplore}
      >
        <Search size={20} strokeWidth={2} aria-hidden />
        <span className="apple-tab-bar__label">Search</span>
      </button>
      <button type="button" className="apple-tab-bar__item apple-tab-bar__item--primary" onClick={onWrite}>
        <SquarePen size={20} strokeWidth={2} aria-hidden />
        <span className="apple-tab-bar__label">Write</span>
      </button>
      <button type="button" className="apple-tab-bar__item" onClick={onToggleView}>
        <MapIcon size={20} strokeWidth={2} aria-hidden />
        <span className="apple-tab-bar__label">{isDesk ? 'Map' : 'Wall'}</span>
      </button>
    </nav>
  )
}
