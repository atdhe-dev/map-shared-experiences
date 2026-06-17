import { Search, PenLine, Map as MapIcon, X } from 'lucide-react'
import type { Experience } from '../../types'
import { PlaceCard } from './PlaceCard'

interface DeskRoomProps {
  experiences: Experience[]
  onRead: (experience: Experience) => void
  loading?: boolean
  error?: string | null
  emptyFiltered?: boolean
  emptyDesk?: boolean
  searchQuery?: string
  onSearchChange?: (q: string) => void
  onWrite?: () => void
  onToggleView?: () => void
}

export function DeskRoom({
  experiences,
  onRead,
  loading,
  error,
  emptyFiltered,
  emptyDesk,
  searchQuery = '',
  onSearchChange,
  onWrite,
  onToggleView,
}: DeskRoomProps) {
  return (
    <div className="wall" aria-label="Wall of unsent messages">
      <header className="wall__header">
        <div className="wall__header-text">
          <p className="wall__title">What If</p>
          <p className="wall__tagline">Words people never got to say</p>
        </div>

        <div className="wall__header-actions">
          {onWrite && (
            <button type="button" className="wall__hdr-write" onClick={onWrite}>
              <PenLine size={13} strokeWidth={2} aria-hidden />
              Write
            </button>
          )}
          {onToggleView && (
            <button
              type="button"
              className="wall__hdr-icon"
              onClick={onToggleView}
              aria-label="Map"
            >
              <MapIcon size={17} strokeWidth={2} aria-hidden />
            </button>
          )}
        </div>
      </header>

      {onSearchChange !== undefined && (
        <div className="wall__search-wrap">
          <div className="wall__search-field">
            <Search size={15} strokeWidth={2} className="wall__search-icon" aria-hidden />
            <input
              type="search"
              className="wall__search-input"
              placeholder="Search a name…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search by name"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {searchQuery && (
              <button
                type="button"
                className="wall__search-clear"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
              >
                <X size={13} strokeWidth={2.5} aria-hidden />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="wall__board-wrap">
        {loading && <p className="wall__empty">Loading…</p>}
        {error && !loading && <p className="wall__empty">{error}</p>}
        {!loading && !error && emptyDesk && (
          <p className="wall__empty">No notes yet. Tap Write to add the first one.</p>
        )}
        {!loading && !error && emptyFiltered && (
          <p className="wall__empty">
            {searchQuery
              ? `No notes for "${searchQuery}" yet.`
              : 'Nothing here yet.'}
          </p>
        )}

        {!loading && !error && experiences.length > 0 && (
          <div className="wall__board" role="list">
            {experiences.map((exp) => (
              <div key={exp.id} className="wall__slot" role="listitem">
                <PlaceCard experience={exp} onClick={onRead} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
