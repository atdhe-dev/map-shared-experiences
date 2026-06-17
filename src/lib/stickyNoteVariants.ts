import type { CSSProperties } from 'react'
import type { Experience } from '../types'
import { getResolvedEmotionColor } from './messageHelpers'

export function getStickyNoteStyle(experience: Experience, _index: number): CSSProperties {
  const emotion = getResolvedEmotionColor(experience)
  return {
    '--card-bg': emotion.soft,
    '--card-accent': emotion.accent,
  } as CSSProperties
}
