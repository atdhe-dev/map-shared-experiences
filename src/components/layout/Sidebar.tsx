import { Navigation, Camera, User, X, Plus } from 'lucide-react'
import type { ExperienceFilters } from '../../types'
import { MESSAGE_TYPES } from '../../lib/messageTypes'
import { EMOTION_COLORS } from '../../lib/emotionColors'
import { SegmentedControl } from '../ui/CategoryChip'
import { SearchBar } from '../SearchBar'
import { LogoMark, MountainIllustration } from './Logo'

interface SidebarProps {
  filters: ExperienceFilters
  onChange: (filters: ExperienceFilters) => void
  onNearMe: () => void
  nearMeActive: boolean
  geoDenied: boolean
  storyCount: number
  onShare?: () => void
}

function ExploreItem({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Navigation
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
        active
          ? 'bg-white text-charcoal shadow-md ring-1 ring-stone-light/80'
          : 'text-charcoal-soft hover:bg-white/70 hover:shadow-sm'
      }`}
    >
      <Icon size={16} strokeWidth={1.75} className={active ? 'text-terracotta' : 'text-terracotta/70'} />
      <span className="font-medium">{label}</span>
    </button>
  )
}

export function Sidebar({
  filters,
  onChange,
  onNearMe,
  nearMeActive,
  geoDenied,
  storyCount,
  onShare,
}: SidebarProps) {
  const toggle = (key: keyof ExperienceFilters, value?: unknown) => {
    if (key === 'messageType') {
      onChange({
        ...filters,
        messageType: filters.messageType === value ? null : (value as string),
      })
    } else if (key === 'emotionColor') {
      onChange({
        ...filters,
        emotionColor: filters.emotionColor === value ? null : (value as string),
      })
    } else if (key === 'sort') {
      onChange({ ...filters, sort: value as ExperienceFilters['sort'] })
    } else if (key === 'withPhotos') {
      onChange({ ...filters, withPhotos: !filters.withPhotos })
    } else if (key === 'anonymousOnly') {
      onChange({ ...filters, anonymousOnly: !filters.anonymousOnly })
    } else if (key === 'nearMe') {
      if (!nearMeActive) onNearMe()
      else onChange({ ...filters, nearMe: false })
    }
  }

  const hasActive =
    filters.messageType ||
    filters.emotionColor ||
    filters.withPhotos ||
    filters.anonymousOnly ||
    nearMeActive

  return (
    <aside className="app-sidebar hidden md:flex">
      <div className="flex flex-col h-full px-6 py-7">
        <div className="flex items-center gap-3 mb-2">
          <LogoMark size={40} />
          <div>
            <h1 className="font-display text-lg font-medium text-charcoal leading-tight">
              The Unsent Diary
            </h1>
            <p className="text-[11px] text-stone tracking-wide">North Macedonia</p>
          </div>
        </div>
        <p className="text-xs text-stone leading-relaxed mb-7 pr-2 italic">
          A map of letters never sent — each pin a note left behind, waiting to be read.
        </p>

        <SearchBar
          value={filters.searchQuery}
          onChange={(q) => onChange({ ...filters, searchQuery: q })}
          variant="sidebar"
          placeholder="Search places, names, or messages…"
        />

        <p className="label-caps mt-8 mb-3">Explore</p>
        <nav className="space-y-1">
          <ExploreItem
            active={nearMeActive}
            onClick={() => toggle('nearMe')}
            icon={Navigation}
            label="Near me"
          />
          <ExploreItem
            active={filters.withPhotos}
            onClick={() => toggle('withPhotos')}
            icon={Camera}
            label="With photos"
          />
          <ExploreItem
            active={filters.anonymousOnly}
            onClick={() => toggle('anonymousOnly')}
            icon={User}
            label="Anonymous"
          />
        </nav>
        {geoDenied && (
          <p className="text-[11px] text-stone mt-2 px-3 leading-relaxed">
            Enable location to find messages left near you.
          </p>
        )}

        <div className="mt-6 mb-3">
          <SegmentedControl
            options={[
              { value: 'newest' as const, label: 'Newest' },
              { value: 'most_loved' as const, label: 'Most felt' },
            ]}
            value={filters.sort}
            onChange={(sort) => toggle('sort', sort)}
          />
        </div>

        <p className="label-caps mt-6 mb-3">Message type</p>
        <div className="flex flex-wrap gap-1.5">
          {MESSAGE_TYPES.slice(0, 8).map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => toggle('messageType', type.id)}
              className={`message-type-chip message-type-chip--compact${filters.messageType === type.id ? ' message-type-chip--active' : ''}`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <p className="label-caps mt-5 mb-3">Emotion</p>
        <div className="emotion-color-picker emotion-color-picker--sidebar">
          {EMOTION_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              aria-label={color.label}
              onClick={() => toggle('emotionColor', color.id)}
              className={`emotion-color-dot${filters.emotionColor === color.id ? ' emotion-color-dot--active' : ''}`}
              style={{ '--emotion-accent': color.accent } as React.CSSProperties}
            >
              <span className="emotion-color-dot__ring" />
            </button>
          ))}
        </div>

        {hasActive && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                messageType: null,
                emotionColor: null,
                withPhotos: false,
                anonymousOnly: false,
                nearMe: false,
              })
            }
            className="flex items-center gap-2 text-xs text-stone hover:text-charcoal mt-4 px-1 transition-colors"
          >
            <X size={13} strokeWidth={1.5} />
            Clear filters
          </button>
        )}

        <div className="mt-auto pt-6">
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="app-nav-share app-nav-share--sidebar w-full mb-5"
            >
              <span className="app-nav-share__icon">
                <Plus size={18} strokeWidth={2.5} />
              </span>
              Leave a letter
            </button>
          )}
          <p className="text-[11px] text-stone mb-3">
            {storyCount} {storyCount === 1 ? 'message' : 'messages'} on the map
          </p>
          <MountainIllustration />
        </div>
      </div>
    </aside>
  )
}
