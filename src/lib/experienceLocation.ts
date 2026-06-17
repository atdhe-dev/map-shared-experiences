import type { Experience } from '../types'

/** True when the author attached a named place (shown on map + in read view). */
export function hasExperienceLocation(experience: Experience): boolean {
  return Boolean(experience.location_name?.trim())
}
