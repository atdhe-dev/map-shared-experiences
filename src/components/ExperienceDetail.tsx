import { MapPin, Heart, Flag } from 'lucide-react'
import type { Experience } from '../types'
import { formatDate, getAuthorDisplay, timeAgo } from '../lib/format'
import { hasReactedToExperience } from '../lib/fingerprint'
import { LetterNote } from './LetterNote'

interface ExperienceDetailProps {
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

export function ExperienceDetail({
  experience,
  onClose: _onClose,
  onReact,
  onReport,
  reacting,
  reporting,
  reactionCount,
  hasReacted,
  reactionError,
}: ExperienceDetailProps) {
  return (
    <div className="message-detail animate-gentle-rise">
      <LetterNote experience={experience} className="diary-note--flat" showPin={false}>
        {experience.image_url && (
          <div className="story-card-image -mx-1 mb-4">
            <img src={experience.image_url} alt="" />
          </div>
        )}

        <h2 className="diary-note__title text-[1.5rem]">{experience.title}</h2>

        {experience.location_name && (
          <p className="diary-note__where flex items-center gap-1 mb-4">
            <MapPin size={12} strokeWidth={1.75} />
            {experience.location_name}
          </p>
        )}

        <p className="diary-note__body whitespace-pre-wrap mb-4">{experience.story}</p>

        <div className="flex flex-wrap gap-2 text-[11px] mb-4" style={{ color: 'var(--diary-ink-faded)' }}>
          <span>{timeAgo(experience.created_at)}</span>
          <span>·</span>
          <span>{getAuthorDisplay(experience)}</span>
        </div>

        {experience.memory_date && (
          <p className="text-[10px] italic mb-4" style={{ color: 'var(--diary-ink-faded)' }}>
            Written for {formatDate(experience.memory_date)}
          </p>
        )}

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
                size={15}
                strokeWidth={1.75}
                className={hasReacted ? 'fill-current' : ''}
              />
              {hasReacted ? 'Stayed with me' : reacting ? 'Saving…' : 'This stayed with me'}
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
            <p className="text-sm mt-3 bubble-pill w-full justify-center">{reactionError}</p>
          )}
        </footer>
      </LetterNote>
    </div>
  )
}

export function ExperienceDetailWrapper(props: ExperienceDetailProps) {
  const reacted = props.hasReacted || hasReactedToExperience(props.experience.id)
  return <ExperienceDetail {...props} hasReacted={reacted} />
}
