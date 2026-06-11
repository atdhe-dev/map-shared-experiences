import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  variant?: 'default' | 'share'
}

export function BottomSheet({ open, onClose, title, children, variant = 'default' }: BottomSheetProps) {
  if (!open) return null

  const isShare = variant === 'share'

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center md:items-center">
      <button
        type="button"
        className={`absolute inset-0 animate-fade-in ${isShare ? 'share-modal-backdrop' : 'bg-charcoal/25 backdrop-blur-sm'}`}
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={`relative w-full max-h-[92vh] md:max-w-lg overflow-hidden flex flex-col animate-slide-up ${
          isShare
            ? 'share-modal-panel rounded-t-[32px] md:rounded-[32px]'
            : 'glass-strong rounded-t-[32px] md:rounded-[32px]'
        }`}
      >
        {isShare ? (
          <div className="share-modal-header share-modal-header--simple shrink-0">
            <div className="w-10 h-1 rounded-full bg-stone-light/80 mx-auto mb-3 md:hidden" aria-hidden />
            {title && <h2 className="share-modal-header__title">{title}</h2>}
            <button
              type="button"
              onClick={onClose}
              className="bubble-close absolute top-4 right-4"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
            <div className="w-10 md:hidden" />
            {title && (
              <h2 className="font-display text-lg font-semibold text-charcoal text-center flex-1">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bubble-close shrink-0"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        )}
        <div className={`overflow-y-auto overscroll-contain scrollbar-thin flex-1 min-h-0 share-modal-body ${isShare ? 'px-5 pb-6 pt-1' : 'px-5 pb-6'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
