import { PenLine, Search, SlidersHorizontal } from 'lucide-react'

interface MapChromeProps {
  onSearch: () => void
  onExplore: () => void
  onWrite: () => void
  exploreOpen?: boolean
  messageCount?: number
  hidden?: boolean
}

export function MapChrome({
  onSearch,
  onExplore,
  onWrite,
  exploreOpen,
  messageCount,
  hidden,
}: MapChromeProps) {
  if (hidden) return null

  return (
    <>
      <header className="map-chrome-top" aria-label="Map navigation">
        <div className="map-chrome-top__brand">
          <span className="map-chrome-top__mark" aria-hidden />
          <div>
            <p className="map-chrome-top__title">unsent</p>
            {messageCount != null && (
              <p className="map-chrome-top__count">{messageCount} on the map</p>
            )}
          </div>
        </div>
        <div className="map-chrome-top__actions">
          <button type="button" className="map-chrome-icon" onClick={onSearch} aria-label="Search">
            <Search size={18} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={`map-chrome-icon${exploreOpen ? ' map-chrome-icon--active' : ''}`}
            onClick={onExplore}
            aria-label="Explore and filter"
          >
            <SlidersHorizontal size={18} strokeWidth={2} />
          </button>
        </div>
      </header>

      <button type="button" className="map-chrome-write" onClick={onWrite}>
        <PenLine size={18} strokeWidth={2} aria-hidden />
        <span>Leave a letter</span>
      </button>
    </>
  )
}
