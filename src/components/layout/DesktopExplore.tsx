import { PenLine } from 'lucide-react'
import type { ExperienceFilters } from '../../types'
import { SearchBar } from '../SearchBar'
import { FilterPanel } from '../FilterPanel'

interface DesktopExploreProps {
  filters: ExperienceFilters
  onChange: (filters: ExperienceFilters) => void
  onNearMe: () => void
  nearMeActive: boolean
  geoDenied: boolean
  messageCount: number
  onWrite: () => void
}

export function DesktopExplore({
  filters,
  onChange,
  onNearMe,
  nearMeActive,
  geoDenied,
  messageCount,
  onWrite,
}: DesktopExploreProps) {
  return (
    <aside className="app-shell-drawer" aria-label="Explore messages">
      <div className="app-shell-drawer__panel">
        <div className="mb-4">
          <p className="map-chrome-top__title text-lg mb-0.5">unsent</p>
          <p className="map-chrome-top__count">{messageCount} letters on the map</p>
        </div>

        <SearchBar
          value={filters.searchQuery}
          onChange={(q) => onChange({ ...filters, searchQuery: q })}
          variant="sidebar"
          placeholder="Search names, places…"
        />

        <div className="app-shell-drawer__scroll mt-5">
          <FilterPanel
            filters={filters}
            onChange={onChange}
            onNearMe={onNearMe}
            nearMeActive={nearMeActive}
            geoDenied={geoDenied}
          />
        </div>

        <button type="button" className="map-chrome-write !relative !left-auto !bottom-auto !transform-none w-full mt-4 shrink-0" onClick={onWrite}>
          <PenLine size={18} strokeWidth={2} aria-hidden />
          <span>Leave a letter</span>
        </button>
      </div>
    </aside>
  )
}
