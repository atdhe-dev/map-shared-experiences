export type AuthorMode = 'anonymous' | 'nickname' | 'real_name'
export type ExperienceStatus = 'pending' | 'approved' | 'rejected'
export type SortOption = 'newest' | 'most_loved'
export type ReactionType = 'touched'

export interface Experience {
  id: string
  title: string
  story: string
  category: string
  message_to: string | null
  message_type: string | null
  emotion_color: string | null
  lat: number
  lng: number
  location_name: string | null
  image_url: string | null
  author_mode: AuthorMode
  author_name: string | null
  memory_date: string | null
  status: ExperienceStatus
  reactions_count: number
  reports_count: number
  created_at: string
  updated_at: string
}

export interface ExperienceInsert {
  title: string
  story: string
  category: string
  message_to: string
  message_type: string
  emotion_color: string
  lat: number
  lng: number
  location_name?: string | null
  image_url?: string | null
  author_mode: AuthorMode
  author_name?: string | null
  memory_date?: string | null
  status: 'pending'
}

export interface GeocodingResult {
  display_name: string
  lat: number
  lng: number
}

export interface ExperienceFilters {
  messageType: string | null
  emotionColor: string | null
  sort: SortOption
  nearMe: boolean
  withPhotos: boolean
  anonymousOnly: boolean
  searchQuery: string
}

export interface Profile {
  id: string
  email: string | null
  role: 'user' | 'admin'
  created_at: string
}

export interface LatLng {
  lat: number
  lng: number
}
