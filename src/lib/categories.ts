export interface Category {
  id: string
  label: string
}

export const CATEGORIES: Category[] = [
  { id: 'life_moment', label: 'Life Moment' },
  { id: 'love', label: 'Love' },
  { id: 'friendship', label: 'Friendship' },
  { id: 'family', label: 'Family' },
  { id: 'food', label: 'Food' },
  { id: 'nature', label: 'Nature' },
  { id: 'travel', label: 'Travel' },
  { id: 'student_life', label: 'Student Life' },
  { id: 'work', label: 'Work' },
  { id: 'hidden_gem', label: 'Hidden Gem' },
  { id: 'recommendation', label: 'Recommendation' },
  { id: 'funny_moment', label: 'Funny Moment' },
  { id: 'other', label: 'Other' },
]

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]
}

export type CategoryId = (typeof CATEGORIES)[number]['id']
