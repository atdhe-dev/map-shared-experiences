import type { CSSProperties } from 'react'
import type { Experience } from '../types'
import { getResolvedEmotionColor } from './messageHelpers'

const NOTE_COLORS = [
  '#FDF8E8',
  '#FDEDF2',
  '#EAF4FB',
  '#EDF7F0',
  '#F3EFF9',
  '#FBF0EA',
  '#F5F0EB',
  '#EEF5F5',
]

function hashSeed(id: string, index: number): number {
  let h = index
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 997
  return h
}

export function getStickyNoteStyle(experience: Experience, index: number): CSSProperties {
  const emotion = getResolvedEmotionColor(experience)
  const seed = hashSeed(experience.id, index)

  // Wider rotation range for a more natural wall feel
  const rotate = ((seed % 13) - 6) * 0.7

  const color = emotion.soft || NOTE_COLORS[seed % NOTE_COLORS.length]

  // Aspect ratio variance — some notes taller, some slightly wider
  const aspects = [1, 0.88, 1, 1.1, 0.92, 1, 0.85, 1.06, 1, 0.9]
  const aspect = aspects[seed % aspects.length]

  // Fold corner: roughly 1 in 4 notes gets one
  const fold = seed % 4 === 0 ? 1 : 0

  // Worn feel: notes older than 30 days appear slightly faded
  const ageDays = (Date.now() - new Date(experience.created_at).getTime()) / 86_400_000
  const opacity = ageDays > 60 ? 0.86 : ageDays > 30 ? 0.93 : 1

  return {
    '--note-color': color,
    '--note-ink': '#2C2C2C',
    '--note-accent': emotion.accent,
    '--note-rotate': `${rotate}deg`,
    '--note-aspect': aspect,
    '--note-fold': fold,
    '--note-opacity': opacity,
  } as CSSProperties
}
