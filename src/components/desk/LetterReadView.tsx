import { useLayoutEffect, useRef } from 'react'
import type { Experience } from '../../types'
import { getAuthorDisplay } from '../../lib/format'
import { hasExperienceLocation } from '../../lib/experienceLocation'
import { getMessageTo } from '../../lib/messageHelpers'
import { getStickyNoteStyle } from '../../lib/stickyNoteVariants'
import { NoteLocationMap } from './NoteLocationMap'

function pageMeta(experience: Experience): string {
  const when = experience.memory_date || experience.created_at
  const date = new Date(when)
  const year = date.getFullYear()
  const month = date.toLocaleDateString('en-GB', { month: 'long' }).toUpperCase()
  return `${month} ${year}`
}

interface LetterReadViewProps {
  experience: Experience
  pageIndex?: number
  pageTotal?: number
  nextExperience?: Experience | null
  previousExperience?: Experience | null
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  onReact: (id: string) => void
  onReport?: (id: string) => void
  reacting: boolean
  reporting?: boolean
  reactionCount: number
  hasReacted: boolean
  reactionError?: string | null
}

export function LetterReadView({
  experience,
  pageIndex,
  pageTotal,
  nextExperience,
  previousExperience,
  onClose,
  onNext,
  onPrevious,
  onReact,
  onReport,
  reacting,
  reporting,
  reactionCount,
  hasReacted,
  reactionError,
}: LetterReadViewProps) {
  const messageTo = getMessageTo(experience)
  const messageFrom = getAuthorDisplay(experience)
  const showPlace = hasExperienceLocation(experience)
  const pageRef = useRef<HTMLDivElement>(null)
  const noteIndex = pageIndex != null ? pageIndex - 1 : 0

  useLayoutEffect(() => {
    pageRef.current?.scrollTo(0, 0)
  }, [experience.id])

  return (
    <div ref={pageRef} className="note-read" role="article" aria-labelledby="note-read-name">
      <header className="note-read__top">
        <button type="button" className="note-read__back" onClick={onClose}>
          Done
        </button>
        {pageIndex != null && pageTotal != null && pageTotal > 0 && (
          <span className="note-read__index">{pageIndex} of {pageTotal}</span>
        )}
      </header>

      <div className="note-read__stage">
        <article
          className="letter-sheet"
          style={getStickyNoteStyle(experience, noteIndex)}
        >
          <span className="letter-sheet__pin" aria-hidden />

          <header className="letter-sheet__head">
            <p className="letter-sheet__label">To:</p>
            <h1 id="note-read-name" className="letter-sheet__name">
              {messageTo}
            </h1>
            <p className="letter-sheet__from">
              <span className="letter-sheet__label">From:</span>
              <span className="letter-sheet__from-name">{messageFrom}</span>
            </p>
          </header>

          <p className="letter-sheet__hook">&ldquo;{experience.title}&rdquo;</p>

          <div className="letter-sheet__body">
            {experience.story.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {showPlace && (
            <NoteLocationMap
              lat={experience.lat}
              lng={experience.lng}
              locationName={experience.location_name}
            />
          )}

          <footer className="letter-sheet__foot">
            <p className="letter-sheet__meta">{pageMeta(experience)}</p>

            <div className="letter-sheet__actions">
              <button
                type="button"
                disabled={hasReacted || reacting}
                onClick={() => onReact(experience.id)}
                className="letter-sheet__action letter-sheet__action--primary"
              >
                {hasReacted ? 'Stayed with me' : reacting ? '…' : 'This stayed with me'}
              </button>

              <div className="letter-sheet__actions-row">
                {reactionCount > 0 && (
                  <span className="letter-sheet__meta">{reactionCount} felt this</span>
                )}
                {onReport && (
                  <button
                    type="button"
                    disabled={reporting}
                    onClick={() => onReport(experience.id)}
                    className="letter-sheet__action letter-sheet__action--muted"
                  >
                    Report
                  </button>
                )}
              </div>
            </div>

            {reactionError && <p className="letter-sheet__error">{reactionError}</p>}
          </footer>
        </article>

        {(nextExperience || previousExperience) && (
          <nav className="note-read__nav" aria-label="More notes">
            {nextExperience && onNext && (
              <button type="button" className="note-read__nav-btn" onClick={onNext}>
                Next · To {getMessageTo(nextExperience)}
              </button>
            )}
            {previousExperience && onPrevious && (
              <button type="button" className="note-read__nav-btn" onClick={onPrevious}>
                Previous · To {getMessageTo(previousExperience)}
              </button>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}

export function LetterReadViewWrapper(props: LetterReadViewProps) {
  return <LetterReadView {...props} />
}
