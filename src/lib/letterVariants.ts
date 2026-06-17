import type { CSSProperties } from 'react'
import type { Experience } from '../types'
import { getResolvedEmotionColor } from './messageHelpers'

export interface LetterVariant {
  rotate: number
  fold: 'none' | 'corner' | 'soft'
  paperShift: number
  lift: number
}

export function getLetterVariant(experience: Experience, index: number): LetterVariant {
  const seed = experience.id.charCodeAt(0) + experience.id.charCodeAt(experience.id.length - 1) + index
  const folds: LetterVariant['fold'][] = ['none', 'corner', 'soft']
  return {
    rotate: ((seed % 9) - 4) * 0.35,
    fold: folds[seed % folds.length],
    paperShift: (seed % 5) * 2,
    lift: (seed % 3) * 1,
  }
}

export function getLetterPaperStyle(experience: Experience, index: number): CSSProperties {
  const emotion = getResolvedEmotionColor(experience)
  const variant = getLetterVariant(experience, index)
  return {
    '--letter-rotate': `${variant.rotate}deg`,
    '--letter-paper': emotion.soft,
    '--letter-ink': emotion.deep,
    '--letter-accent': emotion.accent,
    '--letter-lift': `${variant.lift}px`,
  } as CSSProperties
}

export function getLetterFoldClass(index: number, experience: Experience): string {
  const fold = getLetterVariant(experience, index).fold
  return fold === 'none' ? '' : `letter-object--fold-${fold}`
}
