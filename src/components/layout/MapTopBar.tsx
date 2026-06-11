import { Search, SlidersHorizontal } from 'lucide-react'

interface MapTopBarProps {
  onSearch: () => void
  onFilter: () => void
  searchActive?: boolean
  filterActive?: boolean
  showSearch?: boolean
  compact?: boolean
}

export function MapTopBar({
  onSearch,
  onFilter,
  searchActive,
  filterActive,
  showSearch = true,
  compact = false,
}: MapTopBarProps) {
  if (compact) {
    return (
      <div className="map-mobile-chrome map-mobile-chrome--top pointer-events-none">
        <div className="mobile-toolbar pointer-events-auto" role="toolbar" aria-label="Map tools">
          {showSearch && (
            <button
              type="button"
              onClick={onSearch}
              className={`mobile-toolbar__btn${searchActive ? ' mobile-toolbar__btn--active' : ''}`}
            >
              <Search size={17} strokeWidth={2} aria-hidden />
              <span>Search</span>
            </button>
          )}
          {showSearch && <span className="mobile-toolbar__divider" aria-hidden />}
          <button
            type="button"
            onClick={onFilter}
            className={`mobile-toolbar__btn${filterActive ? ' mobile-toolbar__btn--active' : ''}`}
          >
            <SlidersHorizontal size={17} strokeWidth={2} aria-hidden />
            <span>Filter</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="map-top-bar pointer-events-none">
      <div className="top-bar-bubble top-bar-bubble--tools-only pointer-events-auto">
        {showSearch && (
          <>
            <button
              type="button"
              onClick={onSearch}
              className={`top-bar-bubble__item ${searchActive ? 'top-bar-bubble__item--active' : ''}`}
            >
              <span className="top-bar-bubble__icon">
                <Search size={16} strokeWidth={2} />
              </span>
              <span className="top-bar-bubble__label">Search</span>
            </button>
            <span className="top-bar-bubble__divider" aria-hidden />
          </>
        )}
        <button
          type="button"
          onClick={onFilter}
          className={`top-bar-bubble__item ${filterActive ? 'top-bar-bubble__item--active' : ''}`}
        >
          <span className="top-bar-bubble__icon">
            <SlidersHorizontal size={16} strokeWidth={2} />
          </span>
          <span className="top-bar-bubble__label">Filter</span>
        </button>
      </div>
    </div>
  )
}
