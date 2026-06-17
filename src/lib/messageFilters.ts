import type { Experience } from '../types'
import { resolveMessageType } from './messageTypes'

export function experienceMatchesMessageType(exp: Experience, messageType: string): boolean {
  const resolved = resolveMessageType(exp.message_type, exp.category)
  if (resolved === messageType) return true
  // Legacy: category id may match message type id directly
  return exp.category === messageType
}
