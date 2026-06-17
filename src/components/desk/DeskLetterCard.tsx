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
      className="letter-card"
      onClick={() => onClick(experience)}
      aria-label={`Message to ${messageTo}`}
      style={getStickyNoteStyle(experience, index)}
    >
      <span className="letter-card__to">to:</span>
      <span className="letter-card__name">{messageTo}</span>
      <span className="letter-card__text">{truncateText(experience.story, 90)}</span>
    </button>
  )
}
