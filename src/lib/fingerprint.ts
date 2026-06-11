import { FINGERPRINT_KEY } from './constants'

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function getBrowserFingerprint(): string {
  let fp = localStorage.getItem(FINGERPRINT_KEY)
  if (!fp) {
    fp = randomId()
    localStorage.setItem(FINGERPRINT_KEY, fp)
  }
  return fp
}

export function getReactedExperiences(): Set<string> {
  try {
    const raw = localStorage.getItem('semk_reacted_experiences')
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function markExperienceReacted(id: string): void {
  const reacted = getReactedExperiences()
  reacted.add(id)
  localStorage.setItem('semk_reacted_experiences', JSON.stringify([...reacted]))
}

export function hasReactedToExperience(id: string): boolean {
  return getReactedExperiences().has(id)
}
