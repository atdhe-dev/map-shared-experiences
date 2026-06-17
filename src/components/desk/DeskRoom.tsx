import { Search, PenLine, Map as MapIcon } from 'lucide-react'
import type { Experience } from '../../types'
import { DeskLetterCard } from './DeskLetterCard'

interface DeskRoomProps {
  experiences: Experience[]
  onRead: (experience: Experience) => void
  loading?: boolean
  error?: string | null
  emptyFiltered?: boolean
  emptyDesk?: boolean
  onWrite?: () => void
  onSearch?: () => void
  onToggleView?: () => void
}

export function DeskRoom({
  experiences,
  onRead,
  loading,
  error,
  emptyFiltered,
  emptyDesk,
  onWrite,
  onSearch,
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
          {onSearch && (
            <button
              type="button"
              className="wall__hdr-icon"
              onClick={onSearch}
              aria-label="Search"
            >
              <Search size={17} strokeWidth={2} aria-hidden />
            </button>
          )}
          {onWrite && (
            <button
              type="button"
              className="wall__hdr-write"
              onClick={onWrite}
            >
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

      <div className="wall__board-wrap">
        {loading && <p className="wall__empty">Loading…</p>}
        {error && !loading && <p className="wall__empty">{error}</p>}
        {!loading && !error && emptyDesk && (
          <p className="wall__empty">No notes yet. Tap Write to add the first one.</p>
        )}
        {!loading && !error && emptyFiltered && (
          <p className="wall__empty">Nothing here yet.</p>
        )}

        {!loading && !error && experiences.length > 0 && (
          <div className="wall__board" role="list">
            {experiences.map((exp, i) => (
              <div key={exp.id} className="wall__slot" role="listitem">
                <DeskLetterCard experience={exp} index={i} onClick={onRead} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
