import type { Experience } from '../../types'
import { truncateText } from '../../lib/format'
import { getMessageTo } from '../../lib/messageHelpers'
import { getStickyNoteStyle } from '../../lib/stickyNoteVariants'

interface DeskLetterCardProps {
  experience: Experience
  index: number
  onClick: (experience: Experience) => void
}

export function DeskLetterCard({ experience, index, onClick }: DeskLetterCardProps) {
  const messageTo = getMessageTo(experience)

  return (
    <button
      type="button"
      className="sticky-note"
      onClick={() => onClick(experience)}
      aria-label={`Message to ${messageTo}`}
      style={getStickyNoteStyle(experience, index)}
    >
      <span className="sticky-note__pin" aria-hidden />
      <span className="sticky-note__to">To:</span>
      <span className="sticky-note__name">{messageTo}</span>
      <span className="sticky-note__text">&ldquo;{truncateText(experience.title, 72)}&rdquo;</span>
    </button>
  )
}
