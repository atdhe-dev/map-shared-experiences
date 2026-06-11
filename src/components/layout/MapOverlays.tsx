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
    <nav className="map-pick-bar" aria-label="Place memory on map">
      <div className="map-pick-bar__inner">
        {hasLocation ? (
          <div className="map-pick-bar__confirm">
            <Button size="sm" variant="warm" onClick={onConfirm}>
              Yes, here
            </Button>
            <button type="button" className="map-pick-bar__again" onClick={onChooseAgain}>
              Choose again
            </button>
          </div>
        ) : null}
        <button type="button" className="map-pick-bar__back" onClick={onBack}>
          Back
        </button>
      </div>
    </nav>
  )
}
