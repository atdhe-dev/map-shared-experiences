import { MapPickBar } from '../components/layout/MapOverlays'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Experience, ExperienceFilters, LatLng } from '../types'
import {
  addReaction,
  fetchApprovedExperiences,
  filterExperiences,
  getNearbyExperiences,
} from '../lib/experiences'
import { hasReactedToExperience } from '../lib/fingerprint'
import { isSupabaseConfigured } from '../lib/supabase'
import { useGeolocation, useMediaQuery } from '../hooks'
import { MapView } from '../components/map/MapView'
import { WelcomeOverlay } from '../components/WelcomeOverlay'
import { AppFrame } from '../components/layout/AppFrame'
import { Sidebar } from '../components/layout/Sidebar'
import { MapTopBar } from '../components/layout/MapTopBar'
import { BottomNav } from '../components/layout/BottomNav'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { NearMeCard } from '../components/NearMeCard'
import { StoryCard } from '../components/StoryCard'
import { ExperienceDetailWrapper } from '../components/ExperienceDetail'
import { AddExperienceFlow } from '../components/AddExperienceFlow'
import { BottomSheet } from '../components/ui/BottomSheet'
import { Modal } from '../components/ui/Modal'
import { LoadingSpinner, EmptyState } from '../components/ui/CategoryChip'
import { shortenPlaceName } from '../lib/geocoding'

type Panel = 'none' | 'search' | 'filter' | 'add' | 'detail'

const defaultFilters: ExperienceFilters = {
  category: null,
  sort: 'newest',
  nearMe: false,
  withPhotos: false,
  anonymousOnly: false,
  recommendationsOnly: false,
  searchQuery: '',
}

export function MapPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { location: userLocation, status: geoStatus, requestLocation } = useGeolocation()

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ExperienceFilters>(defaultFilters)
  const [panel, setPanel] = useState<Panel>('none')
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({})
  const [reacting, setReacting] = useState(false)
  const [showNearMeCard, setShowNearMeCard] = useState(false)

  const [addOpen, setAddOpen] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [tempLocation, setTempLocation] = useState<LatLng | null>(null)
  const [confirmedLocation, setConfirmedLocation] = useState<LatLng | null>(null)
  const [locationName, setLocationName] = useState('')
  const [flyTo, setFlyTo] = useState<LatLng | null>(null)
  const [addFlowKey, setAddFlowKey] = useState(0)
  const [previewExperience, setPreviewExperience] = useState<Experience | null>(null)
  const [reactionError, setReactionError] = useState<string | null>(null)

  const loadExperiences = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env')
      setLoading(false)
      return
    }
    try {
      setError(null)
      const data = await fetchApprovedExperiences()
      setExperiences(data)
      const counts: Record<string, number> = {}
      data.forEach((e) => { counts[e.id] = e.reactions_count })
      setReactionCounts(counts)
    } catch {
      setError('Could not load experiences. Please refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadExperiences()
  }, [loadExperiences])

  useEffect(() => {
    const onFocus = () => loadExperiences()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadExperiences])

  useEffect(() => {
    if (geoStatus === 'denied' && filters.nearMe) {
      setFilters((f) => ({ ...f, nearMe: false }))
    }
  }, [geoStatus, filters.nearMe])

  useEffect(() => {
    if (geoStatus === 'granted' && userLocation && filters.nearMe) {
      setFlyTo(userLocation)
    }
  }, [geoStatus, userLocation, filters.nearMe])

  const filteredExperiences = useMemo(
    () => filterExperiences(experiences, filters, userLocation),
    [experiences, filters, userLocation],
  )

  const nearbyExperiences = useMemo(() => {
    if (!userLocation) return []
    return getNearbyExperiences(experiences, userLocation)
  }, [experiences, userLocation])

  useEffect(() => {
    if (userLocation && nearbyExperiences.length > 0) {
      setShowNearMeCard(true)
    }
  }, [userLocation, nearbyExperiences.length])

  const handleNearMe = () => {
    if (geoStatus === 'granted' && userLocation) {
      setFilters((f) => ({ ...f, nearMe: true }))
      setFlyTo(userLocation)
    } else {
      requestLocation()
      setFilters((f) => ({ ...f, nearMe: true }))
    }
  }

  const handleMapClick = (latlng: LatLng) => {
    if (!selectMode) return
    setTempLocation(latlng)
  }

  const handleStartAdd = () => {
    setAddFlowKey((k) => k + 1)
    setAddOpen(true)
    setPanel('add')
    setSelectMode(false)
    setTempLocation(null)
    setConfirmedLocation(null)
    setLocationName('')
  }

  const handleStartMapPick = () => {
    setSelectMode(true)
    setPanel('add')
    setAddOpen(true)
    setTempLocation(null)
    setConfirmedLocation(null)
  }

  const handlePlaceSelect = (place: { display_name: string; lat: number; lng: number }) => {
    setTempLocation({ lat: place.lat, lng: place.lng })
    setConfirmedLocation({ lat: place.lat, lng: place.lng })
    setLocationName(shortenPlaceName(place.display_name))
    setFlyTo({ lat: place.lat, lng: place.lng })
    setSelectMode(false)
    setAddOpen(true)
    setPanel('add')
  }

  const handleConfirmLocation = () => {
    if (tempLocation) {
      setConfirmedLocation(tempLocation)
      setSelectMode(false)
      setAddOpen(true)
      setPanel('add')
    }
  }

  const resetLocationState = () => {
    setSelectMode(false)
    setTempLocation(null)
    setConfirmedLocation(null)
    setLocationName('')
  }

  const closeStoryPanel = () => {
    setPanel('none')
    setSelectedExperience(null)
    setPreviewExperience(null)
    setReactionError(null)
  }

  const closeAddFlow = () => {
    setPanel('none')
    setAddOpen(false)
    resetLocationState()
  }

  const handleReadMore = (exp: Experience) => {
    setPreviewExperience(null)
    setSelectedExperience(exp)
    setPanel('detail')
    setFlyTo({ lat: exp.lat, lng: exp.lng })
  }

  const handlePinSelect = (exp: Experience) => {
    if (isMobile) {
      setPreviewExperience((current) => (current?.id === exp.id ? null : exp))
      setPanel('none')
      return
    }
    handleReadMore(exp)
  }

  const closePreview = () => setPreviewExperience(null)

  const handleReact = async (id: string) => {
    if (hasReactedToExperience(id)) return
    setReacting(true)
    setReactionError(null)
    try {
      const result = await addReaction(id)
      if (!result.success) {
        setReactionError('You already touched this story.')
        return
      }
      setReactionCounts((prev) => ({ ...prev, [id]: result.reactions_count }))
      setExperiences((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, reactions_count: result.reactions_count } : e,
        ),
      )
      if (selectedExperience?.id === id) {
        setSelectedExperience((prev) =>
          prev ? { ...prev, reactions_count: result.reactions_count } : null,
        )
      }
    } catch (err) {
      setReactionError(err instanceof Error ? err.message : 'Could not save your reaction.')
    } finally {
      setReacting(false)
    }
  }

  /** Back from map-pick to the “choose method” step inside the add flow */
  const handleCancelLocation = () => {
    resetLocationState()
    setPanel('add')
    setAddOpen(true)
  }

  const handleMapPickBack = () => {
    resetLocationState()
    setPanel('add')
    setAddOpen(true)
    setAddFlowKey((k) => k + 1)
  }

  const addFlowProps = {
    open: addOpen,
    onClose: closeAddFlow,
    selectMode,
    onStartMapPick: handleStartMapPick,
    onPlaceSelect: handlePlaceSelect,
    onConfirmLocation: handleConfirmLocation,
    onCancelLocation: handleCancelLocation,
    confirmedLocation,
    locationName,
  }

  const sidebarProps = {
    filters,
    onChange: setFilters,
    onNearMe: handleNearMe,
    nearMeActive: filters.nearMe,
    geoDenied: geoStatus === 'denied',
    storyCount: filteredExperiences.length,
    onShare: handleStartAdd,
  }

  return (
    <AppFrame
      sidebar={!isMobile ? <Sidebar {...sidebarProps} /> : undefined}
    >
      <div className={`relative h-full w-full map-shell${previewExperience ? ' map-shell--pin-preview' : ''}`}>
        <MapView
          experiences={filteredExperiences}
          onSelect={handlePinSelect}
          previewExperience={isMobile ? previewExperience : null}
          onPreviewClose={closePreview}
          onPreviewReadMore={handleReadMore}
          selectMode={selectMode}
          tempLocation={tempLocation}
          onMapClick={handleMapClick}
          userLocation={userLocation}
          flyTo={flyTo}
          insetControls={isMobile}
        />

        <WelcomeOverlay onExplore={() => {}} onShare={handleStartAdd} />

        <MapTopBar
          compact={isMobile}
          onSearch={() => setPanel(panel === 'search' ? 'none' : 'search')}
          onFilter={() => setPanel(panel === 'filter' ? 'none' : 'filter')}
          searchActive={panel === 'search'}
          filterActive={panel === 'filter'}
          showSearch={isMobile}
        />

        {showNearMeCard && nearbyExperiences.length > 0 && (
          <div className="absolute bottom-[calc(var(--mobile-bottom-clearance)+12px)] md:bottom-8 left-4 md:left-6 z-[1000] max-w-[calc(100%-2rem)]">
            <NearMeCard
              experiences={nearbyExperiences}
              onSelect={(exp) => {
                handlePinSelect(exp)
              }}
              onClose={() => setShowNearMeCard(false)}
            />
          </div>
        )}

        {!isMobile && selectedExperience && panel === 'detail' && (
          <div className="absolute top-20 right-5 bottom-24 z-[1000] w-[340px] pointer-events-none">
            <div className="pointer-events-auto h-full">
              <StoryCard
                experience={selectedExperience}
                onClose={closeStoryPanel}
                onReact={handleReact}
                reacting={reacting}
                reactionCount={
                  reactionCounts[selectedExperience.id] ?? selectedExperience.reactions_count
                }
                hasReacted={hasReactedToExperience(selectedExperience.id)}
                reactionError={reactionError}
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none">
            <div className="glass-strong rounded-2xl px-6 py-4 shadow-lg border border-stone-light/50">
              <LoadingSpinner message="Loading stories…" />
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] glass-strong rounded-2xl px-5 py-3 shadow-lg max-w-sm border border-stone-light/50">
            <p className="text-sm text-charcoal-soft">{error}</p>
          </div>
        )}

        {!loading && !error && filteredExperiences.length === 0 && experiences.length > 0 && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] glass-strong rounded-2xl shadow-lg border border-stone-light/50">
            <EmptyState
              title="No stories match"
              message="Try adjusting your filters or search terms."
            />
          </div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] glass-strong rounded-2xl shadow-lg max-w-xs border border-stone-light/50">
            <EmptyState
              title="The map awaits"
              message="Be the first to leave a memory on this map."
            />
          </div>
        )}

        {selectMode && (
          <MapPickBar
            hasLocation={!!tempLocation}
            onConfirm={handleConfirmLocation}
            onChooseAgain={() => setTempLocation(null)}
            onBack={handleMapPickBack}
          />
        )}

        {!selectMode && <BottomNav onAdd={handleStartAdd} />}
      </div>

      {isMobile && panel === 'search' && (
        <BottomSheet open title="Search" onClose={() => setPanel('none')}>
          <SearchBar
            value={filters.searchQuery}
            onChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
            variant="mobile"
          />
        </BottomSheet>
      )}

      {isMobile && panel === 'filter' && (
        <BottomSheet open title="Filters" onClose={() => setPanel('none')}>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onNearMe={handleNearMe}
            nearMeActive={filters.nearMe}
            geoDenied={geoStatus === 'denied'}
          />
        </BottomSheet>
      )}

      {panel === 'add' && addOpen && !selectMode && (
        isMobile ? (
          <BottomSheet open title="Share a memory" onClose={closeAddFlow} variant="share">
            <AddExperienceFlow key={addFlowKey} {...addFlowProps} />
          </BottomSheet>
        ) : (
          <Modal open title="Share a memory" onClose={closeAddFlow} variant="share">
            <AddExperienceFlow key={addFlowKey} {...addFlowProps} />
          </Modal>
        )
      )}

      {isMobile && panel === 'detail' && selectedExperience && (
        <BottomSheet open title="" onClose={closeStoryPanel}>
          <ExperienceDetailWrapper
            experience={selectedExperience}
            onClose={closeStoryPanel}
            onReact={handleReact}
            reacting={reacting}
            reactionCount={
              reactionCounts[selectedExperience.id] ?? selectedExperience.reactions_count
            }
            hasReacted={hasReactedToExperience(selectedExperience.id)}
            reactionError={reactionError}
          />
        </BottomSheet>
      )}
    </AppFrame>
  )
}
