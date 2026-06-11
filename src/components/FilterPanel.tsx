import { MapPin, Camera, User, Star, Navigation, X } from 'lucide-react'
import type { ExperienceFilters } from '../types'
import { CATEGORIES } from '../lib/categories'
import { CategoryChip, SegmentedControl } from './ui/CategoryChip'

interface FilterPanelProps {
  filters: ExperienceFilters
  onChange: (filters: ExperienceFilters) => void
  onNearMe: () => void
  nearMeActive: boolean
  geoDenied: boolean
}

function FilterToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof MapPin
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
        active
          ? 'bg-charcoal text-ivory'
          : 'bg-ivory/60 text-charcoal-soft border border-stone-light hover:border-gold-muted'
      }`}
    >
      <Icon size={13} strokeWidth={1.5} className={active ? 'text-gold-light' : 'text-stone'} />
      {label}
    </button>
  )
}

export function FilterPanel({
  filters,
  onChange,
  onNearMe,
  nearMeActive,
  geoDenied,
}: FilterPanelProps) {
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
    <div className="space-y-6">
      <div>
        <p className="label-caps mb-3">Sort</p>
        <SegmentedControl
          options={[
            { value: 'newest' as const, label: 'Newest' },
            { value: 'most_loved' as const, label: 'Most loved' },
          ]}
          value={filters.sort}
          onChange={(sort) => toggle('sort', sort)}
        />
      </div>

      <div>
        <p className="label-caps mb-3">Discover</p>
        <div className="flex flex-wrap gap-2">
          <FilterToggle
            active={nearMeActive}
            onClick={() => toggle('nearMe')}
            icon={Navigation}
            label="Near me"
          />
          <FilterToggle
            active={filters.withPhotos}
            onClick={() => toggle('withPhotos')}
            icon={Camera}
            label="With photos"
          />
          <FilterToggle
            active={filters.anonymousOnly}
            onClick={() => toggle('anonymousOnly')}
            icon={User}
            label="Anonymous"
          />
          <FilterToggle
            active={filters.recommendationsOnly}
            onClick={() => toggle('recommendationsOnly')}
            icon={Star}
            label="Recommendations"
          />
        </div>
        {geoDenied && (
          <p className="text-xs text-stone mt-3 leading-relaxed">
            Location access is off. Enable it in your browser to explore stories near you.
          </p>
        )}
      </div>

      <div>
        <p className="label-caps mb-3">Theme</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              categoryId={cat.id}
              label={cat.label}
              selected={filters.category === cat.id}
              onClick={() => toggle('category', cat.id)}
              size="sm"
            />
          ))}
        </div>
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
          className="flex items-center gap-2 text-xs text-stone hover:text-charcoal transition-colors"
        >
          <X size={14} strokeWidth={1.5} />
          Clear filters
        </button>
      )}
    </div>
  )
}
