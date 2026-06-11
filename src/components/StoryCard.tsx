import { useState } from 'react'
import { MapPin, Heart, ChevronRight, X } from 'lucide-react'
import type { Experience } from '../types'
import { getCategory } from '../lib/categories'
import { getCategoryTint } from '../lib/categoryTints'
import { formatDate, getAuthorDisplay, truncateText, timeAgo } from '../lib/format'
import { CategoryIcon } from './ui/CategoryIcon'

interface StoryCardProps {
  experience: Experience
  onClose: () => void
  onReact: (id: string) => void
  reacting: boolean
  reactionCount: number
  hasReacted: boolean
  reactionError?: string | null
}

export function StoryCard({
  experience,
  onClose,
  onReact,
  reacting,
  reactionCount,
  hasReacted,
  reactionError,
}: StoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cat = getCategory(experience.category)
  const tint = getCategoryTint(experience.category)

  return (
    <article className="story-card animate-gentle-rise">
      <button
        type="button"
        onClick={onClose}
        className="bubble-close absolute top-5 right-5 z-10"
        aria-label="Close story"
      >
        <X size={15} strokeWidth={2} />
      </button>

      {experience.image_url ? (
        <div className="story-card-image">
          <img src={experience.image_url} alt="" />
          <span
            className="story-card-badge"
            style={{ backgroundColor: tint.bg, color: tint.icon }}
          >
            <CategoryIcon categoryId={experience.category} size={11} strokeWidth={1.75} />
            {cat.label}
          </span>
        </div>
      ) : (
        <div className="px-6 pt-6">
          <span
            className="bubble-pill"
            style={{ backgroundColor: tint.bg, color: tint.icon, borderColor: `${tint.accent}55` }}
          >
            <CategoryIcon categoryId={experience.category} size={11} strokeWidth={1.75} />
            {cat.label}
          </span>
        </div>
      )}

      <div className="story-card-body">
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
          {expanded ? experience.story : truncateText(experience.story, 180)}
        </p>

        {!expanded && experience.story.length > 180 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="mt-3 text-xs text-terracotta hover:text-charcoal transition-colors font-semibold"
          >
            Continue reading…
          </button>
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
              size={14}
              strokeWidth={1.75}
              className={hasReacted ? 'fill-terracotta text-terracotta' : ''}
            />
            {hasReacted ? 'Touched' : 'This touched me'}
          </button>
          {reactionCount > 0 && (
            <span className="bubble-pill text-[10px]">
              {reactionCount} touched
            </span>
          )}
        </div>

        {reactionError && (
          <p className="text-xs text-charcoal-soft mt-3 bubble-pill w-full justify-center">
            {reactionError}
          </p>
        )}

        {experience.memory_date && (
          <p className="bubble-pill mt-4 text-[10px]">
            Memory of {formatDate(experience.memory_date)}
          </p>
        )}
      </div>

      {!expanded && experience.story.length > 180 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="story-card-cta"
        >
          Read full story
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      )}
    </article>
  )
}
