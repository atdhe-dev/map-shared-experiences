import type { Experience } from '../../types'
import { EMOTION_COLORS } from '../../lib/emotionColors'
import { DeskLetterCard } from './DeskLetterCard'

interface DeskRoomProps {
  experiences: Experience[]
  onRead: (experience: Experience) => void
  loading?: boolean
  error?: string | null
  emptyFiltered?: boolean
  emptyDesk?: boolean
  activeColor?: string | null
  onColorFilter?: (color: string | null) => void
}

export function DeskRoom({
  experiences,
  onRead,
  loading,
  error,
  emptyFiltered,
  emptyDesk,
  activeColor,
  onColorFilter,
}: DeskRoomProps) {
  return (
    <div className="wall" aria-label="Wall of unsent messages">
      <header className="wall__header">
        <div className="wall__header-text">
          <p className="wall__title">unsent</p>
          <p className="wall__tagline">Words people never got to say</p>
        </div>
      </header>

      {onColorFilter && (
        <div className="wall__color-filter" role="group" aria-label="Filter by feeling">
          {EMOTION_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              className={`wall__color-btn${activeColor === color.id ? ' wall__color-btn--active' : ''}`}
              aria-pressed={activeColor === color.id}
              onClick={() => onColorFilter(activeColor === color.id ? null : color.id)}
              title={color.label}
            >
              <span
                className="wall__color-swatch"
                style={{ background: color.accent }}
                aria-hidden
              />
              <span className="wall__color-label">{color.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="wall__board-wrap">
        {loading && <p className="wall__empty">Loading…</p>}
        {error && !loading && <p className="wall__empty">{error}</p>}
        {!loading && !error && emptyDesk && (
          <p className="wall__empty">No notes yet. Tap Write to add the first one.</p>
        )}
        {!loading && !error && emptyFiltered && (
          <p className="wall__empty">No notes for that name{activeColor ? ' and feeling' : ''}.</p>
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
