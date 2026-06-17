export interface MessageType {
  id: string
  label: string
}

/** Emotion-first message types — what people actually search for */
export const MESSAGE_TYPES: MessageType[] = [
  { id: 'love', label: 'Love' },
  { id: 'regret', label: 'Regret' },
  { id: 'promise', label: 'Promise' },
  { id: 'confession', label: 'Confession' },
  { id: 'apology', label: 'Apology' },
  { id: 'goodbye', label: 'Goodbye' },
  { id: 'hope', label: 'Hope' },
  { id: 'memory', label: 'Memory' },
  { id: 'healing', label: 'Healing' },
  { id: 'for_myself', label: 'For Myself' },
  { id: 'thank_you', label: 'Thank You' },
  { id: 'other', label: 'Other' },
]

export function getMessageType(id: string): MessageType {
  return MESSAGE_TYPES.find((t) => t.id === id) ?? MESSAGE_TYPES.find((t) => t.id === 'other')!
}

/** Map legacy category ids to message types for older posts */
const LEGACY_CATEGORY_MAP: Record<string, string> = {
  love: 'love',
  friendship: 'memory',
  family: 'memory',
  life_moment: 'memory',
  food: 'memory',
  nature: 'memory',
  travel: 'memory',
  student_life: 'memory',
  work: 'memory',
  hidden_gem: 'memory',
  recommendation: 'hope',
  funny_moment: 'memory',
  other: 'other',
}

export function resolveMessageType(messageType: string | null | undefined, category: string): string {
  if (messageType) return messageType
  return LEGACY_CATEGORY_MAP[category] ?? 'memory'
}
