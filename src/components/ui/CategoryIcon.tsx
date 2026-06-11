import {
  Sparkles,
  Heart,
  Users,
  Home,
  Utensils,
  Leaf,
  Plane,
  BookOpen,
  Briefcase,
  Gem,
  Star,
  Smile,
  MapPin,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  life_moment: Sparkles,
  love: Heart,
  friendship: Users,
  family: Home,
  food: Utensils,
  nature: Leaf,
  travel: Plane,
  student_life: BookOpen,
  work: Briefcase,
  hidden_gem: Gem,
  recommendation: Star,
  funny_moment: Smile,
  other: MapPin,
}

interface CategoryIconProps {
  categoryId: string
  size?: number
  className?: string
  strokeWidth?: number
}

export function CategoryIcon({
  categoryId,
  size = 16,
  className = '',
  strokeWidth = 1.5,
}: CategoryIconProps) {
  const Icon = ICONS[categoryId] ?? MapPin
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden />
}

export function getCategoryLucideIcon(categoryId: string): LucideIcon {
  return ICONS[categoryId] ?? MapPin
}

export const MARKER_SYMBOL_PATHS: Record<string, string> = {
  life_moment: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  love: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  friendship: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><circle cx="9" cy="7" r="4" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M22 21v-2a4 4 0 0 0-3-3.87" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  family: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  food: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M7 2v20" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  nature: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  travel: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M6 12h12" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M6 16h12" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  student_life: '<path d="M12 7v14" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  work: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><rect width="20" height="14" x="2" y="6" rx="2" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  hidden_gem: '<path d="M6 3h12l4 6-10 13L2 9Z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M11 3 8 9l4 13 4-13-3-6" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  recommendation: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
  funny_moment: '<circle cx="12" cy="12" r="10" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><path d="M8 14s1.5 2 4 2 4-2 4-2" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><line x1="9" x2="9.01" y1="9" y2="9" stroke="#F7F3ED" stroke-width="2"/><line x1="15" x2="15.01" y1="9" y2="9" stroke="#F7F3ED" stroke-width="2"/>',
  other: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none" stroke="#F7F3ED" stroke-width="1.5"/><circle cx="12" cy="10" r="3" fill="none" stroke="#F7F3ED" stroke-width="1.5"/>',
}
