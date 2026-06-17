import { useLayoutEffect, useRef } from 'react'
import { Heart } from 'lucide-react'
import type { Experience } from '../../types'
import { getMessageTo } from '../../lib/messageHelpers'
import { getStickyNoteStyle } from '../../lib/stickyNoteVariants'
import { hasExperienceLocation } from '../../lib/experienceLocation'
import { NoteLocationMap } from './NoteLocationMap'
import { NearbyLetters } from './NearbyLetters'

function formatExactDate(experience: Experience): string {
  const when = experience.memory_date || experience.created_at
  const date = new Date(when)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface LetterReadViewProps {
  experience: Experience
  pageIndex?: number
  pageTotal?: number
  nextExperience?: Experience | null
  previousExperience?: Experience | null
  nearbyExperiences?: Experience[]
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  onRead?: (experience: Experience) => void
  onReact: (id: string) => void
  onViewOnMap?: () => void
  reacting: boolean
  reactionCount: number
  hasReacted: boolean
  reactionError?: string | null
}

export function LetterReadView({
  experience,
  nextExperience,
  previousExperience,
  nearbyExperiences,
  onClose,
  onNext,
  onPrevious,
  onRead,
  onReact,
  onViewOnMap,
  reacting,
  reactionCount,
  hasReacted,
  reactionError,
}: LetterReadViewProps) {
  const messageTo = getMessageTo(experience)
  const showPlace = hasExperienceLocation(experience)
  const pageRef = useRef<HTMLDivElement>(null)
  const noteIndex = 0

  useLayoutEffect(() => {
    pageRef.current?.scrollTo(0, 0)
  }, [experience.id])

  return (
    <div
      ref={pageRef}
      className={`note-read${showPlace ? ' note-read--with-map' : ''}`}
      role="article"
      aria-labelledby="note-read-name"
    >
      <header className="note-read__top">
        <button type="button" className="note-read__back" onClick={onClose}>
          Done
        </button>
      </header>

      {/* Hero map — full-width at the top */}
      {showPlace && (
        <div className="note-read__hero-map">
          <NoteLocationMap
            lat={experience.lat}
            lng={experience.lng}
            locationName={experience.location_name}
            onViewOnMap={onViewOnMap}
          />
        </div>
      )}

      <div className="note-read__content">
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
          </header>

          <div className="letter-sheet__body">
            {experience.story.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <footer className="letter-sheet__foot">
            <p className="letter-sheet__meta">{formatExactDate(experience)}</p>

            <div className="letter-seal-wrap">
              <button
                type="button"
                disabled={hasReacted || reacting}
                onClick={() => onReact(experience.id)}
                className={`letter-seal${hasReacted ? ' letter-seal--reacted' : ''}`}
              >
                <Heart
                  size={18}
                  strokeWidth={1.75}
                  fill={hasReacted ? 'currentColor' : 'none'}
                  aria-hidden
                />
                <span>{hasReacted ? 'Stayed with me' : 'This stayed with me'}</span>
              </button>
              {reactionCount > 0 && (
                <span className="letter-seal__count">{reactionCount} felt this</span>
              )}
            </div>

            {reactionError && <p className="letter-sheet__error">{reactionError}</p>}

            {nearbyExperiences && nearbyExperiences.length > 0 && onRead && (
              <NearbyLetters experiences={nearbyExperiences} onRead={onRead} />
            )}
          </footer>
        </article>

        {(previousExperience || nextExperience) && (
          <nav className="note-read__nav" aria-label="More notes">
            {previousExperience && onPrevious && (
              <button type="button" className="note-read__nav-btn" onClick={onPrevious}>
                Previous · To {getMessageTo(previousExperience)}
              </button>
            )}
            {nextExperience && onNext && (
              <button type="button" className="note-read__nav-btn" onClick={onNext}>
                Next · To {getMessageTo(nextExperience)}
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
