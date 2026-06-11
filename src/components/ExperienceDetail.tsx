import { MapPin, Heart, ChevronRight } from 'lucide-react'
import type { Experience } from '../types'
import { getCategory } from '../lib/categories'
import { getCategoryTint } from '../lib/categoryTints'
import { formatDate, getAuthorDisplay, timeAgo } from '../lib/format'
import { hasReactedToExperience } from '../lib/fingerprint'
import { CategoryIcon } from './ui/CategoryIcon'

interface ExperienceDetailProps {
  experience: Experience
  onClose: () => void
  onReact: (id: string) => void
  reacting: boolean
  reactionCount: number
  hasReacted: boolean
  reactionError?: string | null
}

export function ExperienceDetail({
  experience,
  onClose,
  onReact,
  reacting,
  reactionCount,
  hasReacted,
  reactionError,
}: ExperienceDetailProps) {
  const cat = getCategory(experience.category)
  const tint = getCategoryTint(experience.category)

  return (
    <div className="animate-gentle-rise">
      {experience.image_url && (
        <div className="relative mb-6 mx-1">
          <img
            src={experience.image_url}
            alt=""
            className="w-full h-52 object-cover rounded-[22px] border-[3px] border-white shadow-[0_8px_24px_rgba(45,122,138,0.12)]"
          />
          <span
            className="absolute top-4 left-4 bubble-pill backdrop-blur-sm"
            style={{ backgroundColor: `${tint.bg}ee`, color: tint.icon, borderColor: `${tint.accent}55` }}
          >
            <CategoryIcon categoryId={experience.category} size={11} strokeWidth={1.75} />
            {cat.label}
          </span>
        </div>
      )}

      {!experience.image_url && (
        <span
          className="bubble-pill mb-4"
          style={{ backgroundColor: tint.bg, color: tint.icon, borderColor: `${tint.accent}55` }}
        >
          <CategoryIcon categoryId={experience.category} size={11} strokeWidth={1.75} />
          {cat.label}
        </span>
      )}

      <h2 className="font-display text-[1.65rem] font-semibold text-charcoal leading-tight mb-4">
        {experience.title}
      </h2>

      <div className="flex flex-wrap gap-2 mb-5">
        {experience.location_name && (
          <span className="bubble-pill">
            <MapPin size={12} strokeWidth={1.75} className="text-terracotta shrink-0" />
            {experience.location_name}
          </span>
        )}
        <span className="bubble-pill">{timeAgo(experience.created_at)}</span>
        <span className="bubble-pill">{getAuthorDisplay(experience)}</span>
      </div>

      <p className="text-[0.9375rem] text-charcoal-soft leading-[1.75] whitespace-pre-wrap">
        {experience.story}
      </p>

      {experience.memory_date && (
        <p className="bubble-pill mt-5 text-[10px]">
          Memory of {formatDate(experience.memory_date)}
        </p>
      )}

      <hr className="bubble-divider" />

      <div className="flex items-center justify-between">
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
            className={hasReacted ? 'fill-terracotta text-terracotta' : ''}
          />
          {hasReacted ? 'Touched' : reacting ? 'Saving…' : 'This touched me'}
        </button>
        {reactionCount > 0 && (
          <span className="bubble-pill text-[10px]">
            {reactionCount} touched
          </span>
        )}
      </div>

      {reactionError && (
        <p className="text-sm text-charcoal-soft mt-3 bubble-pill w-full justify-center">
          {reactionError}
        </p>
      )}

      <button
        type="button"
        onClick={onClose}
        className="bubble-btn bubble-btn--soft mt-6"
      >
        Return to map
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  )
}

export function ExperienceDetailWrapper(props: ExperienceDetailProps) {
  const reacted = props.hasReacted || hasReactedToExperience(props.experience.id)
  return <ExperienceDetail {...props} hasReacted={reacted} />
}
