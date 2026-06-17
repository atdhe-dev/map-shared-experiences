import type { Experience } from '../../types'
import { getMessageTo } from '../../lib/messageHelpers'

function previewMeta(experience: Experience): string {
  const when = experience.memory_date || experience.created_at
  const date = new Date(when)
  const year = date.getFullYear()
  const month = date.toLocaleDateString('en-GB', { month: 'long' })
  const place = experience.location_name?.trim()
  if (place) return `${place} · ${month} ${year}`
  return `${month} ${year}`
}

interface LetterPreviewProps {
  experience: Experience
  onClose: () => void
  onOpen: () => void
}

export function LetterPreview({ experience, onClose, onOpen }: LetterPreviewProps) {
  const messageTo = getMessageTo(experience)

  return (
    <div className="msg-preview" role="dialog" aria-modal="true" aria-labelledby="msg-preview-name">
      <button type="button" className="msg-preview__backdrop" onClick={onClose} aria-label="Close" />
      <div className="msg-preview__content">
        <button type="button" className="msg-preview__close" onClick={onClose}>
          Close
        </button>
        <p className="msg-preview__to">To:</p>
        <h2 id="msg-preview-name" className="msg-preview__name">
          {messageTo}
        </h2>
        <p className="msg-preview__hook">&ldquo;{experience.title}&rdquo;</p>
        <p className="msg-preview__meta">{previewMeta(experience)}</p>
        <button type="button" className="msg-preview__open" onClick={onOpen}>
          Read
        </button>
      </div>
    </div>
  )
}
