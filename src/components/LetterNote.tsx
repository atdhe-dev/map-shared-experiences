import type { ReactNode } from 'react'
import type { Experience } from '../types'
import {
  getMessageTo,
  getResolvedEmotionColor,
  getResolvedMessageType,
} from '../lib/messageHelpers'

interface LetterNoteProps {
  experience: Experience
  children?: ReactNode
  footer?: ReactNode
  className?: string
  tilt?: number
  compact?: boolean
  showPin?: boolean
}

export function LetterNote({
  experience,
  children,
  footer,
  className = '',
  tilt,
  compact = false,
  showPin = true,
}: LetterNoteProps) {
  const emotion = getResolvedEmotionColor(experience)
  const msgType = getResolvedMessageType(experience)
  const messageTo = getMessageTo(experience)
  const noteTilt = tilt ?? (experience.id.charCodeAt(0) % 5) * 0.35 - 0.7

  return (
    <article
      className={`diary-note${compact ? ' diary-note--compact' : ''} ${className}`.trim()}
      style={
        {
          '--note-bg': emotion.soft,
          '--note-accent': emotion.accent,
          '--note-ink': emotion.deep,
          '--note-tilt': `${noteTilt}deg`,
        } as React.CSSProperties
      }
    >
      {showPin && <span className="diary-note__pin" aria-hidden />}
      <span className="diary-note__tape" aria-hidden />
      <header className="diary-note__header">
        <p className="diary-note__to">
          <span className="diary-note__to-label">To:</span> {messageTo}
        </p>
        <span className="diary-note__type">{msgType.label}</span>
      </header>
      {children ?? (
        <>
          <h2 className="diary-note__title">{experience.title}</h2>
          {experience.location_name && (
            <p className="diary-note__where">{experience.location_name}</p>
          )}
        </>
      )}
      {footer && <footer className="diary-note__footer">{footer}</footer>}
    </article>
  )
}
