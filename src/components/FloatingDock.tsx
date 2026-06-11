import { Search, SlidersHorizontal, PenLine, X } from 'lucide-react'
import { Button } from './ui/Button'

interface FloatingDockProps {
  onSearch: () => void
  onFilter: () => void
  onAdd: () => void
  storyCount: number
}

export function FloatingDock({
  onSearch,
  onFilter,
  onAdd,
  storyCount,
}: FloatingDockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-end gap-3 safe-bottom">
      <div className="glass-strong rounded-full flex items-center gap-0.5 p-1 shadow-lg">
        <DockButton icon={Search} label="Search" onClick={onSearch} />
        <DockButton icon={SlidersHorizontal} label="Filter" onClick={onFilter} />
        <span className="hidden sm:block px-3 text-[11px] text-stone tracking-wide">
          {storyCount} {storyCount === 1 ? 'story' : 'stories'}
        </span>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2.5 bg-charcoal hover:bg-charcoal-soft text-ivory pl-5 pr-6 py-3.5 rounded-full shadow-lg font-medium text-sm transition-all duration-300 active:scale-[0.98]"
      >
        <PenLine size={16} strokeWidth={1.5} />
        Share memory
      </button>
    </div>
  )
}

function DockButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Search
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-full hover:bg-stone-light/50 transition-colors duration-300"
      aria-label={label}
    >
      <Icon size={18} strokeWidth={1.5} className="text-charcoal-soft" />
      <span className="text-[10px] text-stone font-medium tracking-wide">{label}</span>
    </button>
  )
}

export function DesktopHeader({
  storyCount,
  onAdd,
}: {
  storyCount: number
  onAdd: () => void
}) {
  return (
    <div className="hidden md:flex absolute top-5 left-5 right-5 z-[1000] items-start justify-between pointer-events-none">
      <div className="glass-strong rounded-sm px-6 py-4 pointer-events-auto border border-stone-light/50">
        <p className="label-caps mb-1">Shared Experiences</p>
        <h1 className="font-display text-xl font-medium text-charcoal">North Macedonia</h1>
        <p className="text-xs text-stone mt-1 tracking-wide">
          {storyCount} {storyCount === 1 ? 'memory' : 'memories'} on the map
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="pointer-events-auto flex items-center gap-2.5 bg-charcoal hover:bg-charcoal-soft text-ivory px-6 py-3 rounded-full shadow-lg font-medium text-sm transition-all duration-300"
      >
        <PenLine size={16} strokeWidth={1.5} />
        Share memory
      </button>
    </div>
  )
}

export function SelectLocationBanner({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1100] glass-strong rounded-sm px-5 py-3.5 animate-fade-in flex items-center gap-4 max-w-md w-[calc(100%-2rem)] border border-stone-light/50">
      <p className="text-sm text-charcoal-soft flex-1 leading-relaxed">
        Tap the map where this memory belongs
      </p>
      <button
        type="button"
        onClick={onCancel}
        className="text-stone hover:text-charcoal transition-colors shrink-0"
        aria-label="Cancel"
      >
        <X size={18} strokeWidth={1.5} />
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
    <div className="fixed bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 z-[1100] glass-strong rounded-sm px-5 py-4 animate-slide-up flex items-center gap-4 border border-stone-light/50">
      <p className="text-sm text-charcoal-soft">Place your memory here?</p>
      <Button size="sm" onClick={onConfirm}>
        Yes, here
      </Button>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-stone hover:text-charcoal transition-colors"
      >
        Choose again
      </button>
    </div>
  )
}
