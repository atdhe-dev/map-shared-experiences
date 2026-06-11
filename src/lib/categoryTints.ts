/** Muted earthy category palette — distinct but not candy-bright */
export interface CategoryTint {
  bg: string
  bgDeep: string
  marker: string
  markerLight: string
  markerGlow: string
  icon: string
  accent: string
}

export const CATEGORY_TINTS: Record<string, CategoryTint> = {
  life_moment: {
    bg: '#e8e0d8', bgDeep: '#d4c8bc', marker: '#a06848', markerLight: '#c08868',
    markerGlow: 'rgba(160,104,72,0.38)', icon: '#5c4030', accent: '#b07858',
  },
  love: {
    bg: '#e4d4d8', bgDeep: '#d0b8c0', marker: '#8b4049', markerLight: '#a85860',
    markerGlow: 'rgba(139,64,73,0.38)', icon: '#6a2830', accent: '#985058',
  },
  friendship: {
    bg: '#d4e0ec', bgDeep: '#b8cce0', marker: '#3a6898', markerLight: '#5888b8',
    markerGlow: 'rgba(58,104,152,0.36)', icon: '#284868', accent: '#4878a8',
  },
  family: {
    bg: '#e8ddd0', bgDeep: '#d8c8b4', marker: '#987048', markerLight: '#b89068',
    markerGlow: 'rgba(152,112,72,0.36)', icon: '#684830', accent: '#a88058',
  },
  food: {
    bg: '#ece4cc', bgDeep: '#dcd0a8', marker: '#a88028', markerLight: '#c8a048',
    markerGlow: 'rgba(168,128,40,0.38)', icon: '#685818', accent: '#b89038',
  },
  nature: {
    bg: '#d4e8d8', bgDeep: '#b8d8c0', marker: '#3a8058', markerLight: '#58a078',
    markerGlow: 'rgba(58,128,88,0.36)', icon: '#285838', accent: '#489868',
  },
  travel: {
    bg: '#d4dce8', bgDeep: '#b8c8dc', marker: '#486898', markerLight: '#6888b8',
    markerGlow: 'rgba(72,104,152,0.36)', icon: '#304868', accent: '#5878a8',
  },
  student_life: {
    bg: '#dcd4e8', bgDeep: '#c4b8d8', marker: '#6858a0', markerLight: '#8878c0',
    markerGlow: 'rgba(104,88,160,0.36)', icon: '#483878', accent: '#7868b0',
  },
  work: {
    bg: '#e0dee0', bgDeep: '#c8c4c8', marker: '#606068', markerLight: '#808088',
    markerGlow: 'rgba(96,96,104,0.3)', icon: '#404048', accent: '#707078',
  },
  hidden_gem: {
    bg: '#ece8cc', bgDeep: '#dcd8a8', marker: '#988828', markerLight: '#b8a848',
    markerGlow: 'rgba(152,136,40,0.36)', icon: '#685818', accent: '#a89838',
  },
  recommendation: {
    bg: '#e4dcd4', bgDeep: '#d0c4b8', marker: '#887058', markerLight: '#a89078',
    markerGlow: 'rgba(136,112,88,0.32)', icon: '#584838', accent: '#988068',
  },
  funny_moment: {
    bg: '#ece8cc', bgDeep: '#dcd4a0', marker: '#988820', markerLight: '#b8a840',
    markerGlow: 'rgba(152,136,32,0.34)', icon: '#685818', accent: '#a89830',
  },
  other: {
    bg: '#e8e4e0', bgDeep: '#d4cec8', marker: '#787068', markerLight: '#989088',
    markerGlow: 'rgba(120,112,104,0.3)', icon: '#504840', accent: '#888078',
  },
}

export function getCategoryTint(categoryId: string): CategoryTint {
  return CATEGORY_TINTS[categoryId] ?? CATEGORY_TINTS.other
}
