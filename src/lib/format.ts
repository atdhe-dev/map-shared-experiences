import type { AuthorMode, Experience } from '../types'

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getAuthorDisplay(experience: Experience): string {
  if (experience.author_mode === 'anonymous') return 'Anonymous'
  if (experience.author_name?.trim()) return experience.author_name.trim()
  if (experience.author_mode === 'nickname') return 'Anonymous nickname'
  return 'Anonymous'
}

export function getAuthorModeLabel(mode: AuthorMode): string {
  switch (mode) {
    case 'anonymous':
      return 'Anonymous'
    case 'nickname':
      return 'Nickname'
    case 'real_name':
      return 'Real Name'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}
