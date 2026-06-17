import { Button } from '../ui/Button'

export function MapPickBar({
  hasLocation,
  onConfirm,
  onChooseAgain,
  onBack,
}: {
  hasLocation: boolean
  onConfirm: () => void
  onChooseAgain: () => void
  onBack: () => void
}) {
  return (
    <nav className="map-pick-bar" aria-label="Place letter on map">
      <div className="map-pick-bar__inner">
        {hasLocation ? (
          <div className="flex items-center gap-2 w-full">
            <Button size="sm" variant="warm" className="flex-1" onClick={onConfirm}>
              Place here
            </Button>
            <button type="button" className="write-flow-link" onClick={onChooseAgain}>
              Move pin
            </button>
          </div>
        ) : (
          <p className="text-sm text-center m-0 mb-2 write-flow-hint">
            Tap the map where this letter belongs
          </p>
        )}
        <button type="button" className="map-pick-bar__back w-full text-center" onClick={onBack}>
          Cancel
        </button>
      </div>
    </nav>
  )
}
