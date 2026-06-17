import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'warm'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variants = {
  primary:
    'bg-gradient-to-br from-walnut to-charcoal text-white hover:brightness-110 shadow-[0_4px_14px_rgba(74,56,50,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all duration-300 font-bold',
  warm:
    'bg-[var(--diary-ink)] text-[#f6eed8] hover:brightness-110 shadow-[0_4px_14px_rgba(42,24,16,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] active:scale-[0.98] transition-all duration-300 font-bold',
  secondary:
    'bg-gradient-to-b from-white to-ivory-dark text-charcoal hover:brightness-[1.02] border-2 border-stone-light shadow-[0_4px_14px_rgba(44,51,56,0.06)] active:scale-[0.98] transition-all duration-300 font-semibold',
  ghost:
    'bg-transparent text-stone hover:text-charcoal hover:bg-white/60 active:scale-[0.98] transition-all duration-300 font-medium',
  danger:
    'bg-gradient-to-br from-charcoal-soft to-charcoal text-white hover:brightness-110 shadow-[0_4px_14px_rgba(74,56,50,0.2)] active:scale-[0.98] transition-all duration-300 font-bold',
}

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-full tracking-wide',
  md: 'px-6 py-2.5 text-sm rounded-full',
  lg: 'px-8 py-3.5 text-sm rounded-full',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
