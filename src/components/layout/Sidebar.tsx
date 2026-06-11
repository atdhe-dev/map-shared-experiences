import { Navigation, Camera, User, Star, X, Plus } from 'lucide-react'
import type { ExperienceFilters } from '../../types'
import { CATEGORIES } from '../../lib/categories'
import { getCategoryTint } from '../../lib/categoryTints'
import { CategoryIcon } from '../ui/CategoryIcon'
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
    if (key === 'category') {
      onChange({ ...filters, category: filters.category === value ? null : (value as string) })
    } else if (key === 'sort') {
      onChange({ ...filters, sort: value as ExperienceFilters['sort'] })
    } else if (key === 'withPhotos') {
      onChange({ ...filters, withPhotos: !filters.withPhotos })
    } else if (key === 'anonymousOnly') {
      onChange({ ...filters, anonymousOnly: !filters.anonymousOnly })
    } else if (key === 'recommendationsOnly') {
      onChange({ ...filters, recommendationsOnly: !filters.recommendationsOnly })
    } else if (key === 'nearMe') {
      if (!nearMeActive) onNearMe()
      else onChange({ ...filters, nearMe: false })
    }
  }

  const hasActive =
    filters.category ||
    filters.withPhotos ||
    filters.anonymousOnly ||
    filters.recommendationsOnly ||
    nearMeActive

  return (
    <aside className="app-sidebar hidden md:flex">
      <div className="flex flex-col h-full px-6 py-7">
        <div className="flex items-center gap-3 mb-2">
          <LogoMark size={40} />
          <div>
            <h1 className="font-display text-lg font-medium text-charcoal leading-tight">
              Shared Experiences
            </h1>
            <p className="text-[11px] text-stone tracking-wide">MK</p>
          </div>
        </div>
        <p className="text-xs text-stone leading-relaxed mb-7 pr-2">
          Real stories from real places in North Macedonia.
        </p>

        <SearchBar
          value={filters.searchQuery}
          onChange={(q) => onChange({ ...filters, searchQuery: q })}
          variant="sidebar"
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
          <ExploreItem
            active={filters.recommendationsOnly}
            onClick={() => toggle('recommendationsOnly')}
            icon={Star}
            label="Recommendations"
          />
        </nav>
        {geoDenied && (
          <p className="text-[11px] text-stone mt-2 px-3 leading-relaxed">
            Enable location to explore stories near you.
          </p>
        )}

        <div className="mt-6 mb-3">
          <SegmentedControl
            options={[
              { value: 'newest' as const, label: 'Newest' },
              { value: 'most_loved' as const, label: 'Most loved' },
            ]}
            value={filters.sort}
            onChange={(sort) => toggle('sort', sort)}
          />
        </div>

        <p className="label-caps mt-6 mb-3">Categories</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => {
            const tint = getCategoryTint(cat.id)
            const selected = filters.category === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle('category', cat.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                  selected
                    ? 'ring-2 ring-offset-1 shadow-md text-white'
                    : 'hover:shadow-md hover:-translate-y-px'
                }`}
                style={
                  selected
                    ? { background: `linear-gradient(135deg, ${tint.marker} 0%, ${tint.icon} 100%)`, boxShadow: `0 4px 12px ${tint.markerGlow}` }
                    : { backgroundColor: tint.bg, color: tint.icon, border: `1px solid ${tint.bgDeep}` }
                }
              >
                <CategoryIcon
                  categoryId={cat.id}
                  size={13}
                  className={selected ? 'text-gold-light' : ''}
                  strokeWidth={1.5}
                />
                <span className="truncate">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {hasActive && (
          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                category: null,
                withPhotos: false,
                anonymousOnly: false,
                recommendationsOnly: false,
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
              Share your experience
            </button>
          )}
          <p className="text-[11px] text-stone mb-3">
            {storyCount} {storyCount === 1 ? 'story' : 'stories'} on the map
          </p>
          <MountainIllustration />
        </div>
      </div>
    </aside>
  )
}
