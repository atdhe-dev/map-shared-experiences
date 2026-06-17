import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  variant?: 'default' | 'share'
}

export function Modal({ open, onClose, title, children, variant = 'default' }: ModalProps) {
  if (!open) return null

  return (
    <div className="apple-sheet-root apple-sheet-root--center" role="presentation">
      <button type="button" className="apple-sheet-backdrop" onClick={onClose} aria-label="Close" />
      <div
        className={`apple-sheet apple-sheet--modal ${variant === 'share' ? 'apple-sheet--write' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <header className="apple-sheet__header">
            <h2 className="apple-sheet__title">{title}</h2>
            <button type="button" className="apple-sheet__done" onClick={onClose}>
              Done
            </button>
          </header>
        )}
        <div className="apple-sheet__body apple-sheet__body--write">{children}</div>
      </div>
    </div>
  )
}
