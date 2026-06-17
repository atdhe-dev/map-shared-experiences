import type { CSSProperties } from 'react'
import type { ExperienceFilters } from '../types'
import { MESSAGE_TYPES } from '../lib/messageTypes'
import { EMOTION_COLORS } from '../lib/emotionColors'

interface FilterPanelProps {
  filters: ExperienceFilters
  onChange: (filters: ExperienceFilters) => void
  onNearMe: () => void
  nearMeActive: boolean
  geoDenied: boolean
  compact?: boolean
}

function FilterLink({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button type="button" onClick={onClick} className={`filter-link${active ? ' filter-link--on' : ''}`}>
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
  const toggleNearMe = () => {
    if (!nearMeActive) onNearMe()
    else onChange({ ...filters, nearMe: false })
  }

  const hasFilters =
    filters.messageType ||
    filters.emotionColor ||
    filters.withPhotos ||
    filters.anonymousOnly ||
    nearMeActive

  const emotions = MESSAGE_TYPES.filter((t) => t.id !== 'other')

  return (
    <div className="filter-minimal">
      <div className="filter-minimal__group">
        <p className="filter-minimal__label">Feeling</p>
        <div className="filter-minimal__row">
          {emotions.map((type) => (
            <FilterLink
              key={type.id}
              active={filters.messageType === type.id}
              onClick={() =>
                onChange({
                  ...filters,
                  messageType: filters.messageType === type.id ? null : type.id,
                })
              }
              label={type.label}
            />
          ))}
        </div>
      </div>

      <div className="filter-minimal__group">
        <p className="filter-minimal__label">Sort</p>
        <div className="filter-minimal__row">
          <FilterLink
            active={filters.sort === 'newest'}
            onClick={() => onChange({ ...filters, sort: 'newest' })}
            label="Newest"
          />
          <FilterLink
            active={filters.sort === 'most_loved'}
            onClick={() => onChange({ ...filters, sort: 'most_loved' })}
            label="Most felt"
          />
        </div>
      </div>

      <div className="filter-minimal__group">
        <div className="filter-minimal__row">
          <FilterLink active={nearMeActive} onClick={toggleNearMe} label="Near me" />
          <FilterLink
            active={filters.withPhotos}
            onClick={() => onChange({ ...filters, withPhotos: !filters.withPhotos })}
            label="Photos"
          />
          <FilterLink
            active={filters.anonymousOnly}
            onClick={() => onChange({ ...filters, anonymousOnly: !filters.anonymousOnly })}
            label="Anonymous"
          />
        </div>
        {geoDenied && nearMeActive && (
          <p className="filter-minimal__hint">Enable location for near me.</p>
        )}
      </div>

      <div className="filter-minimal__group">
        <p className="filter-minimal__label">Mood</p>
        <div className="filter-minimal__row filter-minimal__row--dots">
          {EMOTION_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              aria-label={color.label}
              onClick={() =>
                onChange({
                  ...filters,
                  emotionColor: filters.emotionColor === color.id ? null : color.id,
                })
              }
              className={`filter-dot${filters.emotionColor === color.id ? ' filter-dot--on' : ''}`}
              style={{ '--dot-color': color.accent } as CSSProperties}
            />
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          className="filter-link filter-link--clear"
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
        >
          Clear
        </button>
      )}
    </div>
  )
}
