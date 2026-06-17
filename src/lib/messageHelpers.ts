import type { Experience } from '../types'
import { resolveEmotionColor, getEmotionColor } from './emotionColors'
import { resolveMessageType, getMessageType } from './messageTypes'

export function getMessageTo(exp: Experience): string {
  const to = exp.message_to?.trim()
  if (to) return to
  return 'Someone'
}

export function getResolvedMessageType(exp: Experience) {
  return getMessageType(resolveMessageType(exp.message_type, exp.category))
}

export function getResolvedEmotionColor(exp: Experience) {
  return getEmotionColor(resolveEmotionColor(exp.emotion_color, exp.category))
}
