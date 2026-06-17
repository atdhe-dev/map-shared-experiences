import { useCallback, useEffect, useState } from 'react'
import type { LatLng } from '../types'
import { MAP_CENTER } from '../lib/constants'
import { EMOTION_COLORS } from '../lib/emotionColors'
import { MESSAGE_TYPES } from '../lib/messageTypes'
import { searchPlaces, shortenPlaceName } from '../lib/geocoding'
import { submitExperience } from '../lib/experiences'
import { isSupabaseConfigured } from '../lib/supabase'
import { MapPin, Map, Mail, ChevronDown } from 'lucide-react'
import { Button } from './ui/Button'
import { PlaceSearch } from './SearchBar'

const inputClass = 'share-flow-input'

type AddStep = 'write' | 'success'

interface AddExperienceFlowProps {
  open: boolean
  onClose: () => void
  selectMode: boolean
  onStartMapPick: () => void
  onPlaceSelect: (place: { display_name: string; lat: number; lng: number }) => void
  onConfirmLocation: () => void
  onCancelLocation: () => void
  confirmedLocation: LatLng | null
  locationName: string
}

export function AddExperienceFlow({
  open,
  onClose,
  selectMode,
  onStartMapPick,
  onPlaceSelect,
  onCancelLocation,
  confirmedLocation,
  locationName: initialLocationName,
}: AddExperienceFlowProps) {
  const [step, setStep] = useState<AddStep>('write')
  const [messageTo, setMessageTo] = useState('')
  const [story, setStory] = useState('')
  const [messageType, setMessageType] = useState('memory')
  const [emotionColor, setEmotionColor] = useState('gray')
  const [memoryDate, setMemoryDate] = useState('')
  const [locationName, setLocationName] = useState('')
  const [placeOpen, setPlaceOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolvedLocationName = locationName || initialLocationName
  const hasPlace = Boolean(confirmedLocation)
  const charsLeft = Math.max(0, 100 - story.length)
  const selectedColor = EMOTION_COLORS.find((c) => c.id === emotionColor)

  useEffect(() => {
    if (!selectMode && confirmedLocation) {
      setPlaceOpen(true)
    }
  }, [selectMode, confirmedLocation])

  const reset = useCallback(() => {
    setStep('write')
    setMessageTo('')
    setStory('')
    setMessageType('memory')
    setEmotionColor('gray')
    setMemoryDate('')
    setLocationName('')
    setPlaceOpen(false)
    setError(null)
    onCancelLocation()
  }, [onCancelLocation])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handlePlaceSelect = (place: { display_name: string; lat: number; lng: number }) => {
    onPlaceSelect(place)
    setLocationName(shortenPlaceName(place.display_name))
    setPlaceOpen(true)
    setStep('write')
  }

  const clearPlace = () => {
    onCancelLocation()
    setLocationName('')
  }

  const validate = () => {
    if (!messageTo.trim()) {
      setError('Who is this for?')
      return false
    }
    if (!story.trim()) {
      setError('Write what you never got to say.')
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Check your .env file.')
      return
    }

    setSubmitting(true)
    setError(null)

    const lat = confirmedLocation?.lat ?? MAP_CENTER[0]
    const lng = confirmedLocation?.lng ?? MAP_CENTER[1]
    const placeName = confirmedLocation
      ? resolvedLocationName.trim() ||
        `${confirmedLocation.lat.toFixed(4)}, ${confirmedLocation.lng.toFixed(4)}`
      : null

    const autoTitle = story.trim().slice(0, 80)

    try {
      await submitExperience({
        title: autoTitle,
        story: story.trim().slice(0, 100),
        category: messageType,
        message_to: messageTo.trim(),
        message_type: messageType,
        emotion_color: emotionColor,
        lat,
        lng,
        location_name: placeName,
        image_url: null,
        author_mode: 'anonymous',
        author_name: null,
        memory_date: memoryDate || null,
        status: 'pending',
      })

      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || selectMode) return null

  if (step === 'success') {
    return (
      <div className="share-flow-success">
        <div className="share-flow-success__icon">
          <Mail size={26} strokeWidth={1.75} />
        </div>
        <h3 className="share-flow-success__title">Your words are safe</h3>
        <p className="share-flow-success__text">
          Your note is on the wall. It will appear after a quiet review.
        </p>
        <Button variant="warm" className="w-full" onClick={handleClose}>
          Back to wall
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="write-letter-form space-y-4">
      <p className="write-flow-lead">
        Words for someone who never got them.
      </p>

      <div className="write-prompt-group">
        <label className="write-prompt-label" htmlFor="write-to">This is for</label>
        <input
          id="write-to"
          type="text"
          value={messageTo}
          onChange={(e) => setMessageTo(e.target.value)}
          maxLength={80}
          placeholder="Mom, A., my younger self…"
          className={inputClass}
          required
          autoFocus
        />
      </div>

      <div className="write-prompt-group">
        <label className="write-prompt-label" htmlFor="write-body">You never got to hear this:</label>
        <textarea
          id="write-body"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          maxLength={100}
          placeholder="Write what you never got to say…"
          className={`${inputClass} resize-none leading-relaxed`}
          required
        />
        <p className="write-char-hint">{charsLeft} left</p>
      </div>

      <div className="write-feeling-row">
        <p className="write-feeling-label">
          How does it feel?
          {selectedColor && (
            <span className="write-feeling-selected"> · {selectedColor.label}</span>
          )}
        </p>
        <div className="emotion-color-picker">
          {EMOTION_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              title={color.label}
              aria-label={color.label}
              onClick={() => setEmotionColor(color.id)}
              className={`emotion-color-dot${emotionColor === color.id ? ' emotion-color-dot--active' : ''}`}
              style={{ '--emotion-accent': color.accent } as React.CSSProperties}
            >
              <span className="emotion-color-dot__ring" />
            </button>
          ))}
        </div>
      </div>

      <div className="write-place-optional">
        <button
          type="button"
          className="write-place-optional__toggle"
          onClick={() => setPlaceOpen((o) => !o)}
          aria-expanded={placeOpen}
        >
          <MapPin size={15} strokeWidth={2} aria-hidden />
          <span>Where it happened</span>
          <span className="write-place-optional__badge">Optional</span>
          <ChevronDown
            size={16}
            className={`write-place-optional__chevron${placeOpen ? ' write-place-optional__chevron--open' : ''}`}
            aria-hidden
          />
        </button>

        {placeOpen && (
          <div className="write-place-optional__panel">
            {hasPlace ? (
              <div className="write-place-optional__set">
                <span className="share-flow-location-chip min-w-0">
                  <MapPin size={14} strokeWidth={1.75} className="shrink-0" style={{ color: 'var(--app-accent)' }} />
                  <span className="truncate">{resolvedLocationName}</span>
                </span>
                <button type="button" className="write-flow-link" onClick={clearPlace}>
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="write-flow-micro m-0 mb-3">
                  Attach a place if it matters — your note lives on the wall either way.
                </p>
                <button
                  type="button"
                  className="write-method-btn write-method-btn--subtle"
                  onClick={() => {
                    setPlaceOpen(true)
                    onStartMapPick()
                  }}
                >
                  <span className="write-method-btn__icon">
                    <Map size={18} strokeWidth={1.75} />
                  </span>
                  <span>
                    <p className="write-method-btn__label">Pick on map</p>
                    <p className="write-method-btn__hint">Only if you want to</p>
                  </span>
                </button>
                <div className="share-flow-divider">
                  <span>or search</span>
                </div>
                <PlaceSearch onSelect={handlePlaceSelect} onSearch={searchPlaces} />
              </>
            )}
          </div>
        )}
      </div>

      <details className="write-more-options">
        <summary className="write-more-options__summary">
          <span>More options</span>
          <ChevronDown size={16} aria-hidden />
        </summary>
        <div className="write-more-options__body space-y-4">
          <div>
            <label className="share-flow-label">Message type</label>
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setMessageType(type.id)}
                  className={`message-type-chip${messageType === type.id ? ' message-type-chip--active' : ''}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="share-flow-label">When (optional)</label>
            <input
              type="date"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </details>

      <p className="write-flow-safety">
        Please do not include private phone numbers, addresses, or information that can harm someone.
      </p>

      {error && <p className="write-flow-error">{error}</p>}

      <div className="write-letter-form__submit">
        <Button type="submit" variant="warm" className="w-full" disabled={submitting}>
          {submitting ? 'Saving…' : 'Leave it'}
        </Button>
      </div>
    </form>
  )
}
