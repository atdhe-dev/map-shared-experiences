export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

export function resolveImageMime(file: File): string | null {
  if (file.type && ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return file.type
  }
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return EXT_TO_MIME[ext] ?? null
}

export function validateImageFile(file: File): { ok: true; mime: string } | { ok: false; error: string } {
  const mime = resolveImageMime(file)

  if (!mime) {
    if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
      return {
        ok: false,
        error: 'HEIC photos are not supported yet. Please choose JPEG or PNG from your gallery.',
      }
    }
    return {
      ok: false,
      error: 'Please upload a JPEG, PNG, WebP, or GIF image.',
    }
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Image must be under 5MB. Try a smaller photo.' }
  }

  if (file.size === 0) {
    return { ok: false, error: 'That file appears empty. Please choose another photo.' }
  }

  return { ok: true, mime }
}

/** Normalize file so Supabase storage receives a reliable content type (mobile fix). */
export function normalizeImageFile(file: File, mime: string): File {
  if (file.type === mime) return file
  return new File([file], file.name || `photo.${mime.split('/')[1]}`, { type: mime })
}

/** Downscale large photos so uploads succeed on mobile networks. */
export async function compressImageIfNeeded(file: File, mime: string): Promise<File> {
  if (mime === 'image/gif') return file
  if (file.size <= 1.5 * 1024 * 1024) return normalizeImageFile(file, mime)

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const maxSide = 1920
      let { width, height } = img
      if (width > maxSide || height > maxSide) {
        if (width >= height) {
          height = Math.round((height * maxSide) / width)
          width = maxSide
        } else {
          width = Math.round((width * maxSide) / height)
          height = maxSide
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(normalizeImageFile(file, mime))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)

      const outputType = mime === 'image/png' ? 'image/png' : 'image/jpeg'
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(normalizeImageFile(file, mime))
            return
          }
          const ext = outputType === 'image/png' ? 'png' : 'jpg'
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + `.${ext}`, { type: outputType }))
        },
        outputType,
        0.85,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image. Please try another photo.'))
    }

    img.src = url
  })
}

export async function prepareImageForUpload(file: File): Promise<File> {
  const validation = validateImageFile(file)
  if (!validation.ok) throw new Error(validation.error)
  return compressImageIfNeeded(file, validation.mime)
}
