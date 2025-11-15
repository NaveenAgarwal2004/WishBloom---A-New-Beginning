'use client'

import { useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  onUpload?: (url: string | null) => void
  existingImage?: string | null
}

export default function ImageUploader({ onUpload, existingImage }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(existingImage || null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = async (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', response.status, errorText)
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setImageUrl(data.url)
        if (onUpload) onUpload(data.url)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.'
      setError(errorMessage)
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    disabled: uploading,
  })

  const handleRemove = () => {
    setImageUrl(null)
    if (onUpload) onUpload(null)
  }

  if (imageUrl) {
    return (
      <div className="relative">
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-full h-48 object-cover rounded-lg shadow-medium"
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-2 bg-warmCream-800/80 text-warmCream-50 rounded-full hover:bg-fadedRose transition-colors"
          type="button"
        >
          <X size={20} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-fadedGold bg-fadedGold/10'
            : 'border-warmCream-400 hover:border-fadedGold'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={48} className="text-fadedGold animate-spin" />
            <p className="text-body text-warmCream-700">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={48} className="text-warmCream-600 mx-auto" />
            <p className="text-body text-warmCream-700">
              {isDragActive ? 'Drop image here' : 'Drop image here or click to upload'}
            </p>
            <p className="text-caption text-warmCream-600">PNG, JPG, WebP up to 5MB</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-caption text-fadedRose mt-2">{error}</p>
      )}
    </div>
  )
}
