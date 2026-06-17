import type { Experience } from '../../types'
import { DeskLetterCard } from './DeskLetterCard'

interface DeskRoomProps {
  experiences: Experience[]
  onRead: (experience: Experience) => void
  onOpenMap: () => void
  loading?: boolean
  error?: string | null
  emptyFiltered?: boolean
  emptyDesk?: boolean
}

export function DeskRoom({
  experiences,
  onRead,
  onOpenMap,
  loading,
  error,
  emptyFiltered,
  emptyDesk,
}: DeskRoomProps) {
  return (
    <div className="wall" aria-label="Wall of unsent messages">
      <header className="wall__header">
        <div className="wall__header-text">
          <h1 className="wall__title">unsent</h1>
          <p className="wall__tagline">Words people never got to say</p>
        </div>
        <button type="button" className="wall__map-btn" onClick={onOpenMap}>
          Map
        </button>
      </header>

      <div className="wall__board-wrap">
        {loading && <p className="wall__empty">Loading…</p>}
        {error && !loading && <p className="wall__empty">{error}</p>}
        {!loading && !error && emptyDesk && (
          <p className="wall__empty">No notes yet. Tap Write to add the first one.</p>
        )}
        {!loading && !error && emptyFiltered && (
          <p className="wall__empty">No notes for that name.</p>
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
