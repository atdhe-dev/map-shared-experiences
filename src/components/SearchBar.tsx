import { useState, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  variant?: 'default' | 'sidebar' | 'mobile'
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search places, names, or messages…',
  variant = 'default',
}: SearchBarProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const shellClass =
    variant === 'sidebar'
      ? 'search-bar search-bar--sidebar'
      : variant === 'mobile'
        ? 'search-bar search-bar--mobile'
        : 'search-bar'

  return (
    <div
      className={`${shellClass} ${focused ? 'search-bar--focused' : ''}`}
    >
      <Search size={variant === 'sidebar' ? 17 : 16} strokeWidth={1.5} className="text-stone shrink-0" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-stone min-w-0"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          className="text-stone hover:text-charcoal transition-colors"
          aria-label="Clear search"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

interface PlaceSearchProps {
  onSelect: (place: { display_name: string; lat: number; lng: number }) => void
  onSearch: (query: string) => Promise<{ display_name: string; lat: number; lng: number }[]>
}

export function PlaceSearch({ onSelect, onSearch }: PlaceSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ display_name: string; lat: number; lng: number }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSearch = async (q: string) => {
    if (q.trim().length < 2) {
      setResults([])
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await onSearch(q)
      setResults(data)
      if (data.length === 0) setError('No places found in North Macedonia.')
    } catch {
      setError('Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runSearch(val), 400)
  }

  return (
    <div className="space-y-2">
      <SearchBar
        value={query}
        onChange={handleChange}
        placeholder="Search a place in North Macedonia…"
        variant="mobile"
      />
      {loading && <p className="text-xs text-stone px-1">Searching…</p>}
      {error && !loading && <p className="text-xs text-stone px-1">{error}</p>}
      {results.length > 0 && (
        <ul className="rounded-2xl overflow-hidden border border-stone-light/80 max-h-48 overflow-y-auto scrollbar-thin bg-white/95 shadow-sm">
          {results.map((place) => (
            <li key={`${place.lat}-${place.lng}`} className="border-b border-stone-light/40 last:border-0">
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-charcoal-soft hover:bg-terracotta/5 hover:text-charcoal transition-colors"
                onClick={() => {
                  onSelect(place)
                  setQuery('')
                  setResults([])
                }}
              >
                {place.display_name.split(',').slice(0, 3).join(', ')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
