import { X } from 'lucide-react'
import { Button } from '../ui/Button'

export function SelectLocationBanner({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1100] share-flow-map-hint px-5 py-3.5 animate-fade-in flex items-center gap-4 max-w-md w-[calc(100%-2rem)]">
      <p className="text-sm text-charcoal-soft flex-1 leading-relaxed font-medium">
        Tap the map where this memory belongs
      </p>
      <button
        type="button"
        onClick={onCancel}
        className="bubble-close shrink-0 !w-9 !h-9"
        aria-label="Cancel"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  )
}

export function ConfirmLocationBar({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="absolute bottom-28 md:bottom-12 left-1/2 -translate-x-1/2 z-[1100] share-flow-map-hint px-5 py-4 animate-slide-up flex items-center gap-3 flex-wrap justify-center">
      <p className="text-sm text-charcoal-soft font-medium">Place your memory here?</p>
      <Button size="sm" variant="warm" onClick={onConfirm}>
        Yes, here
      </Button>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs font-semibold text-stone hover:text-charcoal transition-colors"
      >
        Choose again
      </button>
    </div>
  )
}
