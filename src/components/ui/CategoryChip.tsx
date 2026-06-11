import type { ReactNode } from 'react'
import { CategoryIcon } from './CategoryIcon'

interface CategoryChipProps {
  categoryId: string
  label: string
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function CategoryChip({
  categoryId,
  label,
  selected,
  onClick,
  size = 'md',
}: CategoryChipProps) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
  const className = `inline-flex items-center gap-2 rounded-full font-medium ${sizeClasses} ${
    selected
      ? 'bg-charcoal text-ivory shadow-sm'
      : 'bg-ivory/80 text-charcoal-soft border border-stone-light'
  } ${onClick ? 'transition-all duration-300 hover:border-gold-muted hover:text-charcoal cursor-pointer' : ''}`

  const content = (
    <>
      <CategoryIcon
        categoryId={categoryId}
        size={size === 'sm' ? 12 : 14}
        className={selected ? 'text-gold-light' : 'text-stone'}
      />
      <span>{label}</span>
    </>
  )

  if (!onClick) {
    return <span className={className}>{content}</span>
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex p-1 rounded-full bg-white/60 border border-stone-light/60 shadow-inner">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
            value === opt.value
              ? 'bg-gradient-to-r from-charcoal to-walnut text-white shadow-md'
              : 'text-stone hover:text-charcoal-soft'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="w-6 h-6 border-2 border-stone-light border-t-charcoal rounded-full animate-spin" />
      {message && <p className="text-sm text-stone">{message}</p>}
    </div>
  )
}

export function EmptyState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6 animate-gentle-rise">
      <div className="w-10 h-1 rounded-full bg-gradient-to-r from-terracotta-light to-terracotta mb-5" />
      <h3 className="font-display text-xl font-medium text-charcoal mb-2">{title}</h3>
      <p className="text-sm text-stone max-w-xs leading-relaxed">{message}</p>
    </div>
  )
}

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`glass rounded-2xl shadow-sm ${className}`}>{children}</div>
  )
}
