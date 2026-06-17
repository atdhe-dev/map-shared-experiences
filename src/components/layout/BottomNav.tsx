import { Plus } from 'lucide-react'

interface BottomNavProps {
  onAdd: () => void
}

export function BottomNav({ onAdd }: BottomNavProps) {
  return (
    <nav className="map-mobile-chrome map-mobile-chrome--bottom md:hidden" aria-label="Share">
      <button type="button" onClick={onAdd} className="mobile-share-btn">
        <span className="mobile-share-btn__icon">
          <Plus size={17} strokeWidth={2.5} />
        </span>
        Leave a letter
      </button>
    </nav>
  )
}
