import { X, MapPin } from 'lucide-react'
import type { Experience } from '../types'
import { truncateText } from '../lib/format'
import { getMessageTo } from '../lib/messageHelpers'

interface NearMeCardProps {
  experiences: Experience[]
  onSelect: (experience: Experience) => void
  onClose: () => void
}

export function NearMeCard({ experiences, onSelect, onClose }: NearMeCardProps) {
  if (experiences.length === 0) return null

  return (
    <div className="near-me-card animate-gentle-rise overflow-hidden max-w-xs w-full">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3">
        <div>
          <p className="label-caps mb-1">Nearby</p>
          <h3 className="font-display text-lg font-semibold text-charcoal leading-tight">
            Messages left near you
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bubble-close shrink-0"
          aria-label="Close"
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>
      <ul className="max-h-44 overflow-y-auto scrollbar-thin px-3">
        {experiences.slice(0, 4).map((exp) => (
          <li key={exp.id}>
            <button
              type="button"
              onClick={() => onSelect(exp)}
              className="w-full text-left px-3 py-3 hover:bg-white/70 rounded-2xl transition-all duration-300 flex items-start gap-3 mb-1 last:mb-0"
            >
              {exp.image_url ? (
                <img
                  src={exp.image_url}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover shrink-0 border-2 border-white shadow-sm"
                />
              ) : (
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush to-honey shrink-0 flex items-center justify-center shadow-sm border-2 border-white">
                  <MapPin size={15} className="text-terracotta" strokeWidth={1.75} />
                </span>
              )}
              <span className="min-w-0 pt-0.5">
                <p className="text-[10px] uppercase tracking-wider text-stone font-semibold truncate">
                  To: {getMessageTo(exp)}
                </p>
                <p className="font-display text-sm font-semibold text-charcoal truncate">
                  {exp.title}
                </p>
                <p className="text-[11px] text-stone truncate mt-0.5">
                  {exp.location_name ?? truncateText(exp.story, 40)}
                </p>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="px-5 py-3 text-[11px] text-terracotta font-semibold border-t border-stone-light">
        {experiences.length} {experiences.length === 1 ? 'message' : 'messages'} nearby
      </p>
    </div>
  )
}
