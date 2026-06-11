import { useCallback, useState } from 'react'
import type { AuthorMode, LatLng } from '../types'
import { CATEGORIES } from '../lib/categories'
import { searchPlaces, shortenPlaceName } from '../lib/geocoding'
import { submitExperience, uploadExperienceImage } from '../lib/experiences'
import { isSupabaseConfigured } from '../lib/supabase'
import { MapPin, Map, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'
import { CategoryChip } from './ui/CategoryChip'
import { PhotoPicker } from './ui/PhotoPicker'
import { PlaceSearch } from './SearchBar'

const inputClass = 'share-flow-input'

type AddStep = 'method' | 'pick_map' | 'form' | 'success'

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
  const [step, setStep] = useState<AddStep>('method')
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [category, setCategory] = useState('life_moment')
  const [locationName, setLocationName] = useState('')
  const [authorMode, setAuthorMode] = useState<AuthorMode>('anonymous')
  const [authorName, setAuthorName] = useState('')
  const [showAuthor, setShowAuthor] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayStep: AddStep = (() => {
    if (step === 'success') return 'success'
    if (confirmedLocation) return 'form'
    if (selectMode || step === 'pick_map') return 'pick_map'
    return step
  })()

  const resolvedLocationName = locationName || initialLocationName

  const reset = useCallback(() => {
    setStep('method')
    setTitle('')
    setStory('')
    setCategory('life_moment')
    setLocationName('')
    setAuthorMode('anonymous')
    setAuthorName('')
    setShowAuthor(false)
    setImageFile(null)
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
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
  }

  const handleChangePlace = () => {
    onCancelLocation()
    setStep('method')
  }

  const handlePhotoSelect = (file: File, previewUrl: string) => {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return previewUrl
    })
    setImageFile(file)
    setError(null)
  }

  const handlePhotoClear = () => {
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setImageFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmedLocation) return
    if (!title.trim() || !story.trim()) {
      setError('Please add a title and your story.')
      return
    }
    if (showAuthor && authorMode !== 'anonymous' && !authorName.trim()) {
      setError('Please enter your name or nickname.')
      return
    }
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Check your .env file.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      let imageUrl: string | null = null
      if (imageFile) {
        setUploadingPhoto(true)
        imageUrl = await uploadExperienceImage(imageFile)
        setUploadingPhoto(false)
      }

      const mode = showAuthor ? authorMode : 'anonymous'

      await submitExperience({
        title: title.trim(),
        story: story.trim(),
        category,
        lat: confirmedLocation.lat,
        lng: confirmedLocation.lng,
        location_name: resolvedLocationName.trim() || null,
        image_url: imageUrl,
        author_mode: mode,
        author_name: mode === 'anonymous' ? null : authorName.trim(),
        memory_date: null,
        status: 'pending',
      })

      setStep('success')
    } catch (err) {
      setUploadingPhoto(false)
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open || selectMode) return null

  if (displayStep === 'pick_map') {
    return null
  }

  if (displayStep === 'method') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-charcoal-soft text-center leading-relaxed">
          Search a place or drop a pin on the map.
        </p>
        <PlaceSearch onSelect={handlePlaceSelect} onSearch={searchPlaces} />
        <div className="share-flow-divider">
          <span>or</span>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => {
            onStartMapPick()
            setStep('pick_map')
          }}
        >
          <Map size={18} strokeWidth={1.75} />
          Drop pin on map
        </Button>
      </div>
    )
  }

  if (displayStep === 'success') {
    return (
      <div className="share-flow-success animate-gentle-rise">
        <div className="share-flow-success__icon">
          <Sparkles size={26} strokeWidth={1.75} />
        </div>
        <h3 className="font-display text-2xl font-semibold text-charcoal tracking-tight">
          Thanks for sharing
        </h3>
        <p className="text-charcoal-soft text-sm leading-relaxed max-w-xs mx-auto mt-3 mb-6">
          Your story will appear on the map after a quick review.
        </p>
        <Button variant="warm" className="w-full" onClick={handleClose}>
          Back to map
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between gap-3 pb-1">
        <span className="share-flow-location-chip min-w-0">
          <MapPin size={14} strokeWidth={1.75} className="text-terracotta shrink-0" />
          <span className="truncate">
            {resolvedLocationName ||
              (confirmedLocation
                ? `${confirmedLocation.lat.toFixed(4)}, ${confirmedLocation.lng.toFixed(4)}`
                : 'Location set')}
          </span>
        </span>
        <button
          type="button"
          className="text-xs font-semibold text-terracotta shrink-0 hover:underline"
          onClick={handleChangePlace}
        >
          Change
        </button>
      </div>

      <div>
        <label className="share-flow-label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder="Give this moment a name"
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className="share-flow-label">Story</label>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="What happened here?"
          className={`${inputClass} resize-none leading-relaxed`}
          required
        />
      </div>

      <div>
        <label className="share-flow-label">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.id}
              categoryId={cat.id}
              label={cat.label}
              selected={category === cat.id}
              onClick={() => setCategory(cat.id)}
              size="sm"
            />
          ))}
        </div>
      </div>

      <div>
        <label className="share-flow-label">Photo (optional)</label>
        <PhotoPicker
          preview={imagePreview}
          fileName={imageFile?.name ?? null}
          uploading={uploadingPhoto || submitting}
          onSelect={handlePhotoSelect}
          onClear={handlePhotoClear}
          onError={setError}
        />
      </div>

      {!showAuthor ? (
        <button
          type="button"
          className="text-xs font-semibold text-stone hover:text-charcoal transition-colors"
          onClick={() => setShowAuthor(true)}
        >
          Add your name (optional)
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {(['anonymous', 'nickname', 'real_name'] as AuthorMode[]).map((mode) => (
              <Button
                key={mode}
                type="button"
                size="sm"
                variant={authorMode === mode ? 'warm' : 'secondary'}
                onClick={() => setAuthorMode(mode)}
              >
                {mode === 'anonymous' ? 'Anonymous' : mode === 'nickname' ? 'Nickname' : 'Real name'}
              </Button>
            ))}
          </div>
          {authorMode !== 'anonymous' && (
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={authorMode === 'nickname' ? 'Your nickname' : 'Your name'}
              className={inputClass}
            />
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-charcoal-soft bg-stone-light/50 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="pt-2 pb-1 sticky bottom-0 bg-gradient-to-t from-[#f4f2ee] via-[#f4f2ee]/98 to-transparent -mx-1 px-1">
        <Button type="submit" variant="warm" className="w-full" disabled={submitting || uploadingPhoto}>
          {uploadingPhoto ? 'Uploading photo…' : submitting ? 'Sharing…' : 'Share on map'}
        </Button>
      </div>
    </form>
  )
}
