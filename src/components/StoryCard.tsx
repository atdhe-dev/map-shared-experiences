import { useState } from 'react'
import { MapPin, Heart, X, Flag } from 'lucide-react'
import type { Experience } from '../types'
import { formatDate, getAuthorDisplay, truncateText, timeAgo } from '../lib/format'
import { LetterNote } from './LetterNote'

interface StoryCardProps {
  experience: Experience
  onClose: () => void
  onReact: (id: string) => void
  onReport?: (id: string) => void
  reacting: boolean
  reporting?: boolean
  reactionCount: number
  hasReacted: boolean
  reactionError?: string | null
}

export function StoryCard({
  experience,
  onClose,
  onReact,
  onReport,
  reacting,
  reporting,
  reactionCount,
  hasReacted,
  reactionError,
}: StoryCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="story-card animate-gentle-rise">
      <LetterNote experience={experience} className="diary-note--in-card diary-note--flat" showPin={false}>
        <button
          type="button"
          onClick={onClose}
          className="explore-float__close !absolute top-3 right-3 z-10"
          aria-label="Close message"
        >
          <X size={15} strokeWidth={2} />
        </button>

        {experience.image_url && (
          <div className="story-card-image -mx-1 mb-3">
            <img src={experience.image_url} alt="" />
          </div>
        )}

        <div className="diary-note__scroll">
          <h2 className="diary-note__title">{experience.title}</h2>
          {experience.location_name && (
            <p className="diary-note__where flex items-center gap-1">
              <MapPin size={11} strokeWidth={1.75} />
              {experience.location_name}
            </p>
          )}

          <p className="diary-note__body whitespace-pre-wrap">
            {expanded ? experience.story : truncateText(experience.story, 180)}
          </p>

          {!expanded && experience.story.length > 180 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-3 text-xs text-diary-ink-faded hover:text-diary-ink transition-colors font-semibold underline underline-offset-2"
              style={{ color: 'var(--diary-ink-faded)' }}
            >
              Continue reading…
            </button>
          )}

          <div className="flex flex-wrap gap-2 mt-4 text-[11px]" style={{ color: 'var(--diary-ink-faded)' }}>
            <span>{timeAgo(experience.created_at)}</span>
            <span>·</span>
            <span>{getAuthorDisplay(experience)}</span>
          </div>

          {experience.memory_date && (
            <p className="text-[10px] mt-3 italic" style={{ color: 'var(--diary-ink-faded)' }}>
              Written for {formatDate(experience.memory_date)}
            </p>
          )}
        </div>

        <footer className="diary-note__footer">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              disabled={hasReacted || reacting}
              onClick={() => onReact(experience.id)}
              className={`bubble-pill bubble-pill--accent transition-all duration-300 ${
                hasReacted ? 'opacity-90' : 'hover:scale-[1.02]'
              }`}
            >
              <Heart
                size={14}
                strokeWidth={1.75}
                className={hasReacted ? 'fill-current' : ''}
              />
              {hasReacted ? 'Stayed with me' : 'This stayed with me'}
            </button>
            {reactionCount > 0 && (
              <span className="bubble-pill text-[10px]">{reactionCount} felt</span>
            )}
            {onReport && (
              <button
                type="button"
                disabled={reporting}
                onClick={() => onReport(experience.id)}
                className="bubble-pill text-[10px] ml-auto"
              >
                <Flag size={12} strokeWidth={1.75} />
                Report
              </button>
            )}
          </div>
          {reactionError && (
            <p className="text-xs mt-3 bubble-pill w-full justify-center">{reactionError}</p>
          )}
        </footer>
      </LetterNote>
    </article>
  )
}
