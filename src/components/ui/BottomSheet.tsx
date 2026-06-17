import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  variant?: 'default' | 'share'
  size?: 'auto' | 'large'
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  variant = 'default',
  size = 'large',
}: BottomSheetProps) {
  if (!open) return null

  const isShare = variant === 'share'

  return (
    <div className="apple-sheet-root" role="presentation">
      <button
        type="button"
        className="apple-sheet-backdrop"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className={`apple-sheet ${isShare ? 'apple-sheet--write' : ''} ${size === 'auto' ? 'apple-sheet--compact' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'apple-sheet-title' : undefined}
      >
        <div className="apple-sheet__handle" aria-hidden />
        {title && (
          <header className="apple-sheet__header">
            <h2 id="apple-sheet-title" className="apple-sheet__title">{title}</h2>
            <button type="button" className="apple-sheet__done" onClick={onClose}>
              Done
            </button>
          </header>
        )}
        <div className={`apple-sheet__body ${isShare ? 'apple-sheet__body--write' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  )
}
