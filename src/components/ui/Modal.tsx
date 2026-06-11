import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  wide?: boolean
  variant?: 'default' | 'share'
}

export function Modal({ open, onClose, title, children, wide, variant = 'default' }: ModalProps) {
  if (!open) return null

  const isShare = variant === 'share'

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <button
        type="button"
        className={`absolute inset-0 animate-fade-in ${isShare ? 'share-modal-backdrop' : 'bg-charcoal/25 backdrop-blur-sm'}`}
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={`relative overflow-hidden flex flex-col max-h-[90vh] w-full animate-scale-in ${
          isShare
            ? `share-modal-panel rounded-[32px] ${wide ? 'max-w-2xl' : 'max-w-lg'}`
            : `glass-strong rounded-3xl shadow-2xl shadow-charcoal/10 border border-stone-light/50 ${wide ? 'max-w-2xl' : 'max-w-lg'}`
        }`}
      >
        {isShare ? (
          <div className="share-modal-header share-modal-header--simple shrink-0">
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
          <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
            {title && (
              <h2 className="font-display text-xl font-medium text-charcoal">{title}</h2>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-light/60 text-stone hover:text-charcoal transition-colors duration-300"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
        <div className={`overflow-y-auto overscroll-contain scrollbar-thin flex-1 min-h-0 share-modal-body ${isShare ? 'px-6 pb-6 pt-2' : 'px-6 pb-6'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
