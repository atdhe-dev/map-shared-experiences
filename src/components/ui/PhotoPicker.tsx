import { useId, useRef } from 'react'
import { ImagePlus } from 'lucide-react'
import { validateImageFile } from '../../lib/imageUpload'
import { Button } from './Button'

interface PhotoPickerProps {
  preview: string | null
  fileName: string | null
  uploading?: boolean
  onSelect: (file: File, previewUrl: string) => void
  onClear: () => void
  onError: (message: string) => void
}

export function PhotoPicker({
  preview,
  fileName,
  uploading,
  onSelect,
  onClear,
  onError,
}: PhotoPickerProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.ok) {
      onError(validation.error)
      return
    }

    onSelect(file, URL.createObjectURL(file))
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        onChange={handleChange}
        className="sr-only"
        disabled={uploading}
      />

      {preview ? (
        <div className="relative rounded-sm overflow-hidden border border-stone-light">
          <img src={preview} alt="Selected" className="w-full max-h-48 object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4 flex items-end justify-between gap-2">
            <p className="text-xs text-ivory/90 truncate flex-1">{fileName}</p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onClear}
              disabled={uploading}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex flex-col items-center justify-center gap-3 w-full py-10 rounded-sm border border-dashed border-stone-light bg-ivory-dark/30 cursor-pointer transition-all duration-300 hover:border-gold-muted hover:bg-ivory-dark/50 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <ImagePlus size={24} strokeWidth={1.5} className="text-stone" />
          <div className="text-center">
            <span className="text-sm text-charcoal-soft block">Add a photograph</span>
            <span className="text-xs text-stone mt-1 block">Optional · JPEG or PNG · max 5MB</span>
          </div>
        </label>
      )}

      {preview && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="w-full"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Choose a different photo
        </Button>
      )}
    </div>
  )
}
