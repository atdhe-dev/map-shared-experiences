import type { Experience, ExperienceFilters, ExperienceInsert } from '../types'
import { getBrowserFingerprint, markExperienceReacted } from './fingerprint'
import { haversineKm } from './geocoding'
import { NEAR_ME_RADIUS_KM } from './constants'
import { prepareImageForUpload } from './imageUpload'
import { supabase } from './supabase'
import { resolveEmotionColor } from './emotionColors'
import { experienceMatchesMessageType } from './messageFilters'

export async function fetchApprovedExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message || 'Failed to load experiences.')
  }
  return (data ?? []) as Experience[]
}

export async function fetchPendingExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message || 'Failed to load pending experiences.')
  }
  return (data ?? []) as Experience[]
}

export async function fetchAllExperiencesForAdmin(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message || 'Failed to load experiences.')
  }
  return (data ?? []) as Experience[]
}

export async function submitExperience(
  experience: ExperienceInsert,
): Promise<void> {
  const { error } = await supabase.from('experiences').insert(experience)

  if (error) {
    throw new Error(error.message || 'Failed to submit experience.')
  }
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

function formatSupabaseError(error: { message?: string; error_description?: string }): string {
  return error.message || error.error_description || 'Something went wrong. Please try again.'
}

export async function uploadExperienceImage(file: File): Promise<string> {
  const prepared = await prepareImageForUpload(file)

  if (prepared.size > MAX_IMAGE_BYTES) {
    throw new Error('Image is still too large after compression. Please try a smaller photo.')
  }

  const ext = prepared.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('experience-images')
    .upload(fileName, prepared, {
      cacheControl: '3600',
      upsert: false,
      contentType: prepared.type || 'image/jpeg',
    })

  if (uploadError) {
    const msg = formatSupabaseError(uploadError)
    if (msg.toLowerCase().includes('mime')) {
      throw new Error('That image type is not supported. Please use JPEG or PNG.')
    }
    throw new Error(msg)
  }

  const { data } = supabase.storage
    .from('experience-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function updateExperienceStatus(
  id: string,
  status: 'approved' | 'rejected',
): Promise<void> {
  const { error } = await supabase
    .from('experiences')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(error.message || 'Failed to update experience.')
  }
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from('experiences').delete().eq('id', id)
  if (error) {
    throw new Error(error.message || 'Failed to delete experience.')
  }
}

export async function addReaction(
  experienceId: string,
): Promise<{ success: boolean; reactions_count: number }> {
  const fingerprint = getBrowserFingerprint()

  const { data, error } = await supabase.rpc('add_experience_reaction', {
    p_experience_id: experienceId,
    p_fingerprint: fingerprint,
  })

  if (error) {
    throw new Error(error.message || 'Could not save your reaction.')
  }

  const result = data as {
    success: boolean
    reactions_count: number
  }

  markExperienceReacted(experienceId)
  return result
}

export async function reportExperience(experienceId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_experience_reports', {
    p_experience_id: experienceId,
  })

  if (error) {
    // Fallback if RPC missing: direct update
    const { data: row } = await supabase
      .from('experiences')
      .select('reports_count')
      .eq('id', experienceId)
      .single()

    if (row) {
      const { error: updateError } = await supabase
        .from('experiences')
        .update({ reports_count: (row.reports_count ?? 0) + 1 })
        .eq('id', experienceId)
      if (updateError) throw new Error(updateError.message || 'Could not report message.')
      return
    }
    throw new Error(error.message || 'Could not report message.')
  }
}

export function filterExperiences(
  experiences: Experience[],
  filters: ExperienceFilters,
  userLocation: { lat: number; lng: number } | null,
): Experience[] {
  let result = [...experiences]

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim()
    result = result.filter((e) => {
      const name = (e.message_to || '').toLowerCase()
      return name.includes(q)
    })
  }

  if (filters.messageType) {
    result = result.filter((e) => experienceMatchesMessageType(e, filters.messageType!))
  }

  if (filters.emotionColor) {
    result = result.filter(
      (e) => resolveEmotionColor(e.emotion_color, e.category) === filters.emotionColor,
    )
  }

  if (filters.withPhotos) {
    result = result.filter((e) => Boolean(e.image_url))
  }

  if (filters.anonymousOnly) {
    result = result.filter((e) => e.author_mode === 'anonymous')
  }

  if (filters.nearMe && userLocation) {
    result = result.filter(
      (e) =>
        haversineKm(userLocation.lat, userLocation.lng, e.lat, e.lng) <=
        NEAR_ME_RADIUS_KM,
    )
  }

  if (filters.sort === 'most_loved') {
    result.sort((a, b) => b.reactions_count - a.reactions_count)
  } else {
    result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
  }

  return result
}

export function getNearbyExperiences(
  experiences: Experience[],
  userLocation: { lat: number; lng: number },
  limit = 5,
): Experience[] {
  return [...experiences]
    .map((e) => ({
      experience: e,
      distance: haversineKm(userLocation.lat, userLocation.lng, e.lat, e.lng),
    }))
    .filter((item) => item.distance <= NEAR_ME_RADIUS_KM)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((item) => item.experience)
}
