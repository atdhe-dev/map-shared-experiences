import type { ExperienceFilters } from '../../types'
import { SearchBar } from '../SearchBar'

interface ExploreFloatProps {
  open: boolean
  onClose: () => void
  filters: ExperienceFilters
  onChange: (filters: ExperienceFilters) => void
}

export function ExploreFloat({ open, onClose, filters, onChange }: ExploreFloatProps) {
  if (!open) return null

  return (
    <div className="apple-sheet-root" role="presentation">
      <button type="button" className="apple-sheet-backdrop" onClick={onClose} aria-label="Close" />
      <aside
        className="apple-sheet apple-sheet--search"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-sheet-title"
      >
        <div className="apple-sheet__handle" aria-hidden />
        <header className="apple-sheet__header apple-sheet__header--search">
          <h2 id="search-sheet-title" className="apple-sheet__title">Search by name</h2>
          <button type="button" className="apple-sheet__done" onClick={onClose}>
            Done
          </button>
        </header>
        <div className="apple-sheet__body apple-sheet__body--search">
          <SearchBar
            value={filters.searchQuery}
            onChange={(q) => onChange({ ...filters, searchQuery: q })}
            variant="mobile"
            placeholder="Mom, Dad, You…"
          />
          <p className="apple-sheet__hint">Find notes by who they&apos;re addressed to.</p>
          {filters.searchQuery.trim() && (
            <button
              type="button"
              className="apple-sheet__clear"
              onClick={() => onChange({ ...filters, searchQuery: '' })}
            >
              Clear
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}
