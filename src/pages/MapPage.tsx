import { MapPickBar } from '../components/layout/MapOverlays'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Experience, ExperienceFilters, LatLng } from '../types'
import {
  addReaction,
  fetchApprovedExperiences,
  filterExperiences,
} from '../lib/experiences'
import { hasReactedToExperience } from '../lib/fingerprint'
import { isSupabaseConfigured } from '../lib/supabase'
import { useGeolocation, useMediaQuery } from '../hooks'
import { MapView } from '../components/map/MapView'
import { WelcomeOverlay } from '../components/WelcomeOverlay'
import { AppFrame } from '../components/layout/AppFrame'
import { HomeHud, type AppViewMode } from '../components/layout/HomeHud'
import { ExploreFloat } from '../components/layout/ExploreFloat'
import { DeskRoom } from '../components/desk/DeskRoom'
import { LetterReadView } from '../components/desk/LetterReadView'
import { AddExperienceFlow } from '../components/AddExperienceFlow'
import { BottomSheet } from '../components/ui/BottomSheet'
import { Modal } from '../components/ui/Modal'
import { shortenPlaceName } from '../lib/geocoding'
import { WELCOME_DISMISSED_KEY } from '../lib/constants'

type Panel = 'none' | 'explore' | 'add' | 'detail'

const defaultFilters: ExperienceFilters = {
  messageType: null,
  emotionColor: null,
  sort: 'newest',
  nearMe: false,
  withPhotos: false,
  anonymousOnly: false,
  searchQuery: '',
}

export function MapPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { location: userLocation, status: geoStatus } = useGeolocation()

  const [viewMode, setViewMode] = useState<AppViewMode>('desk')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ExperienceFilters>(defaultFilters)
  const [panel, setPanel] = useState<Panel>('none')
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({})
  const [reacting, setReacting] = useState(false)

  const [addOpen, setAddOpen] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [tempLocation, setTempLocation] = useState<LatLng | null>(null)
  const [confirmedLocation, setConfirmedLocation] = useState<LatLng | null>(null)
  const [locationName, setLocationName] = useState('')
  const [flyTo, setFlyTo] = useState<LatLng | null>(null)
  const [addFlowKey, setAddFlowKey] = useState(0)
  const [reactionError, setReactionError] = useState<string | null>(null)
  const [welcomeActive, setWelcomeActive] = useState(() => {
    try {
      return localStorage.getItem(WELCOME_DISMISSED_KEY) !== 'true'
    } catch {
      return true
    }
  })

  const showMap = viewMode === 'map' || selectMode

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
      setError('Could not load messages. Please refresh.')
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

  useEffect(() => {
    const lockScroll =
      welcomeActive ||
      panel === 'detail' ||
      panel === 'explore' ||
      (panel === 'add' && addOpen)

    document.documentElement.classList.toggle('diary-scroll-lock', lockScroll)
    document.body.classList.toggle('diary-scroll-lock', lockScroll)

    return () => {
      document.documentElement.classList.remove('diary-scroll-lock')
      document.body.classList.remove('diary-scroll-lock')
    }
  }, [welcomeActive, panel, addOpen])

  const filteredExperiences = useMemo(
    () => filterExperiences(experiences, filters, userLocation),
    [experiences, filters, userLocation],
  )

  const mapExperiences = useMemo(
    () => filteredExperiences.filter((e) => Boolean(e.location_name?.trim())),
    [filteredExperiences],
  )

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
    setViewMode('map')
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
    setReactionError(null)
  }

  const closeAddFlow = () => {
    setPanel('none')
    setAddOpen(false)
    resetLocationState()
  }

  const toggleExplore = () => {
    setPanel((p) => (p === 'explore' ? 'none' : 'explore'))
  }

  const toggleViewMode = () => {
    setViewMode((v) => (v === 'desk' ? 'map' : 'desk'))
    if (panel === 'detail') closeStoryPanel()
  }

  const handleViewOnMap = (exp: Experience) => {
    closeStoryPanel()
    setViewMode('map')
    setFlyTo({ lat: exp.lat, lng: exp.lng })
  }

  const handleLetterTap = (exp: Experience) => {
    setSelectedExperience(exp)
    setPanel('detail')
    setFlyTo({ lat: exp.lat, lng: exp.lng })
  }

  const handleOpenAdjacent = (exp: Experience) => {
    setSelectedExperience(exp)
    setFlyTo({ lat: exp.lat, lng: exp.lng })
  }

  const handlePinSelect = (exp: Experience) => {
    handleLetterTap(exp)
  }

  const handleReact = async (id: string) => {
    if (hasReactedToExperience(id)) return
    setReacting(true)
    setReactionError(null)
    try {
      const result = await addReaction(id)
      if (!result.success) {
        setReactionError('You already felt this message.')
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

  const exploreProps = {
    filters,
    onChange: setFilters,
  }

  const chromeHidden =
    welcomeActive ||
    selectMode ||
    panel === 'add' ||
    panel === 'detail'

  const emptyFiltered = !loading && !error && filteredExperiences.length === 0 && experiences.length > 0
  const emptyDesk = !loading && !error && experiences.length === 0

  const selectedIndex = selectedExperience
    ? filteredExperiences.findIndex((e) => e.id === selectedExperience.id)
    : -1

  const letterProps = selectedExperience
    ? {
        experience: selectedExperience,
        pageIndex: selectedIndex >= 0 ? selectedIndex + 1 : undefined,
        pageTotal: filteredExperiences.length,
        nextExperience:
          selectedIndex >= 0 && selectedIndex < filteredExperiences.length - 1
            ? filteredExperiences[selectedIndex + 1]
            : null,
        previousExperience:
          selectedIndex > 0 ? filteredExperiences[selectedIndex - 1] : null,
        onClose: closeStoryPanel,
        onNext:
          selectedIndex >= 0 && selectedIndex < filteredExperiences.length - 1
            ? () => handleOpenAdjacent(filteredExperiences[selectedIndex + 1])
            : undefined,
        onPrevious:
          selectedIndex > 0
            ? () => handleOpenAdjacent(filteredExperiences[selectedIndex - 1])
            : undefined,
        onReact: handleReact,
        onViewOnMap: () => handleViewOnMap(selectedExperience),
        reacting,
        reactionCount:
          reactionCounts[selectedExperience.id] ?? selectedExperience.reactions_count,
        hasReacted: hasReactedToExperience(selectedExperience.id),
        reactionError,
      }
    : null

  const frameMode = showMap ? 'map' : 'desk'

  return (
    <AppFrame mode={frameMode}>
      <div className={`relative w-full app-shell${showMap ? ' h-full min-h-0' : ''}`}>
        {!showMap && (
          <DeskRoom
            experiences={filteredExperiences}
            onRead={handleLetterTap}
            loading={loading}
            error={error}
            emptyFiltered={emptyFiltered}
            emptyDesk={emptyDesk}
            activeColor={filters.emotionColor}
            onColorFilter={(color) => setFilters((f) => ({ ...f, emotionColor: color }))}
          />
        )}

        {showMap && (
          <div className="relative h-full w-full map-shell map-shell--visible">
            <MapView
              experiences={mapExperiences}
              onSelect={handlePinSelect}
              selectMode={selectMode}
              tempLocation={tempLocation}
              onMapClick={handleMapClick}
              userLocation={userLocation}
              flyTo={flyTo}
              insetControls
            />

            {error && !loading && (
              <div className="map-toast">
                <p>{error}</p>
              </div>
            )}

            {emptyFiltered && panel === 'none' && (
              <div className="map-toast">
                <strong>Nothing here yet</strong>
                <p>Try a different name.</p>
              </div>
            )}

            {emptyDesk && panel === 'none' && (
              <div className="map-toast">
                <strong>The map is quiet</strong>
                <p>Be the first to leave something here.</p>
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
          </div>
        )}

        <WelcomeOverlay
          onExplore={() => {}}
          onShare={handleStartAdd}
          onActiveChange={setWelcomeActive}
        />

        <HomeHud
          hidden={chromeHidden}
          viewMode={showMap ? 'map' : 'desk'}
          exploreOpen={panel === 'explore'}
          onExplore={toggleExplore}
          onWrite={handleStartAdd}
          onToggleView={toggleViewMode}
        />
      </div>

      <ExploreFloat
        open={panel === 'explore'}
        onClose={() => setPanel('none')}
        {...exploreProps}
      />

      {panel === 'add' && addOpen && !selectMode && (
        isMobile ? (
          <BottomSheet open title="Unsent note" onClose={closeAddFlow} variant="share">
            <AddExperienceFlow key={addFlowKey} {...addFlowProps} />
          </BottomSheet>
        ) : (
          <Modal open title="Unsent note" onClose={closeAddFlow} variant="share">
            <AddExperienceFlow key={addFlowKey} {...addFlowProps} />
          </Modal>
        )
      )}

      {panel === 'detail' && letterProps && <LetterReadView {...letterProps} />}
    </AppFrame>
  )
}
