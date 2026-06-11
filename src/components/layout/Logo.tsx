export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden>
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="44" y2="44">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8e6e1" />
        </linearGradient>
        <linearGradient id="logo-heart" x1="22" y1="10" x2="22" y2="34">
          <stop offset="0%" stopColor="#489cb0" />
          <stop offset="100%" stopColor="#1f5f6d" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="21" fill="url(#logo-bg)" stroke="#c8c4bc" strokeWidth="1.5" />
      <path
        d="M22 36s-9-7.5-9-16C13 14 16.5 10.5 22 10.5S31 14 31 20c0 8.5-9 16-9 16z"
        fill="url(#logo-heart)"
      />
      <path
        d="M22 14v8M18 18h8"
        stroke="#ffffff"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M14 30c2.5-3.5 5-5 8-5s5.5 1.5 8 5"
        stroke="#5a9a78"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <circle cx="32" cy="12" r="2" fill="#b8862e" opacity="0.95" />
    </svg>
  )
}

export function MountainIllustration() {
  return (
    <svg viewBox="0 0 280 90" className="w-full h-auto opacity-95" aria-hidden>
      <defs>
        <linearGradient id="mtn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dde3e8" stopOpacity="0" />
          <stop offset="100%" stopColor="#a8b8c8" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="mtn-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a9a78" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5a9a78" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mtn-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8862e" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#b8862e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mtn-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#489cb0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#489cb0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="280" height="90" fill="url(#mtn-sky)" />
      <ellipse cx="140" cy="86" rx="100" ry="6" fill="#8a9199" opacity="0.15" />
      <path d="M0 90 L55 38 L105 58 L155 22 L215 48 L280 28 L280 90 Z" fill="url(#mtn-green)" />
      <path d="M35 90 L95 52 L145 68 L195 28 L255 58 L280 48 L280 90 Z" fill="url(#mtn-gold)" />
      <path d="M0 90 L80 72 L140 78 L220 68 L280 75 L280 90 Z" fill="url(#mtn-water)" />
    </svg>
  )
}
