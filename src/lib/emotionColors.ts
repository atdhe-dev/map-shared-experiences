export interface EmotionColor {
  id: string
  label: string
  /** Soft accent for UI chips */
  soft: string
  /** Pin ring / marker accent */
  accent: string
  /** Marker gradient top */
  markerLight: string
  /** Marker gradient mid */
  marker: string
  /** Icon / deep tone */
  deep: string
  /** Subtle glow */
  glow: string
}

export const EMOTION_COLORS: EmotionColor[] = [
  {
    id: 'red',
    label: 'love',
    soft: '#f8d4d0',
    accent: '#9e4540',
    markerLight: '#f0b8b2',
    marker: '#e8a098',
    deep: '#6b3028',
    glow: 'rgba(158, 69, 64, 0.22)',
  },
  {
    id: 'blue',
    label: 'sadness',
    soft: '#d4e4f0',
    accent: '#4a6888',
    markerLight: '#b8d4e8',
    marker: '#9ec0dc',
    deep: '#3a5068',
    glow: 'rgba(74, 104, 136, 0.22)',
  },
  {
    id: 'yellow',
    label: 'warmth',
    soft: '#faf0b8',
    accent: '#8a7030',
    markerLight: '#f5e898',
    marker: '#ede080',
    deep: '#6b5820',
    glow: 'rgba(138, 112, 48, 0.22)',
  },
  {
    id: 'green',
    label: 'healing',
    soft: '#d8eed8',
    accent: '#4a7858',
    markerLight: '#b8dcb8',
    marker: '#a0d0a0',
    deep: '#385840',
    glow: 'rgba(74, 120, 88, 0.22)',
  },
  {
    id: 'purple',
    label: 'nostalgia',
    soft: '#e8dcf0',
    accent: '#685878',
    markerLight: '#d4c0e0',
    marker: '#c4acd8',
    deep: '#504060',
    glow: 'rgba(104, 88, 120, 0.22)',
  },
  {
    id: 'pink',
    label: 'tenderness',
    soft: '#f8dce8',
    accent: '#986878',
    markerLight: '#f0c0d4',
    marker: '#e8a8c0',
    deep: '#784858',
    glow: 'rgba(152, 104, 120, 0.22)',
  },
  {
    id: 'orange',
    label: 'longing',
    soft: '#f8e8d0',
    accent: '#987040',
    markerLight: '#f0d4a8',
    marker: '#e8c088',
    deep: '#785830',
    glow: 'rgba(152, 112, 64, 0.22)',
  },
  {
    id: 'black',
    label: 'grief',
    soft: '#e0dcd8',
    accent: '#404040',
    markerLight: '#c8c4c0',
    marker: '#b0aca8',
    deep: '#282828',
    glow: 'rgba(64, 64, 64, 0.18)',
  },
  {
    id: 'white',
    label: 'peace',
    soft: '#f8f4ec',
    accent: '#888880',
    markerLight: '#f0ece0',
    marker: '#e8e4d8',
    deep: '#686860',
    glow: 'rgba(136, 136, 128, 0.18)',
  },
  {
    id: 'gray',
    label: 'uncertainty',
    soft: '#ece8e0',
    accent: '#686860',
    markerLight: '#d8d4cc',
    marker: '#c8c4bc',
    deep: '#484840',
    glow: 'rgba(104, 104, 96, 0.18)',
  },
]

export function getEmotionColor(id: string): EmotionColor {
  return EMOTION_COLORS.find((c) => c.id === id) ?? EMOTION_COLORS.find((c) => c.id === 'gray')!
}

const LEGACY_CATEGORY_EMOTION: Record<string, string> = {
  love: 'red',
  friendship: 'purple',
  family: 'green',
  life_moment: 'gray',
  food: 'yellow',
  nature: 'green',
  travel: 'blue',
  student_life: 'orange',
  work: 'gray',
  hidden_gem: 'purple',
  recommendation: 'yellow',
  funny_moment: 'pink',
  other: 'gray',
}

export function resolveEmotionColor(
  emotionColor: string | null | undefined,
  category: string,
): string {
  if (emotionColor) return emotionColor
  return LEGACY_CATEGORY_EMOTION[category] ?? 'gray'
}
