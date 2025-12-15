import { NextResponse } from 'next/server'
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'
import { env } from '@/lib/env'
import { FILE_LIMITS, CLOUDINARY_CONFIG, ERROR_MESSAGES } from '@/config/constants'

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

// ✅ Proper Cloudinary types
interface CloudinaryResult {
  secure_url: string
  public_id: string
}

export async function POST(request: Request) {
  // Apply strict rate limiting for uploads
  return withRateLimit(
    request,
    async () => {
      try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
          return NextResponse.json(
            { success: false, error: 'No file provided' },
            { status: 400 }
          )
        }

        // Determine file type (image or audio)
        const isAudio = file.type.startsWith('audio/')
        const isImage = file.type.startsWith('image/')

        // Validate file type - Type-safe check
        if (isImage) {
          const allowedImageTypes = FILE_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]
          if (!allowedImageTypes.includes(file.type)) {
            return NextResponse.json(
              {
                success: false,
                error: ERROR_MESSAGES.INVALID_FILE_TYPE,
              },
              { status: 400 }
            )
          }

          // Validate image file size
          if (file.size > FILE_LIMITS.IMAGE_MAX_SIZE_BYTES) {
            return NextResponse.json(
              { 
                success: false, 
                error: ERROR_MESSAGES.FILE_TOO_LARGE,
              },
              { status: 400 }
            )
          }
        } else if (isAudio) {
          // Phase 5: Audio file validation
          const allowedAudioTypes = FILE_LIMITS.ALLOWED_AUDIO_TYPES as readonly string[]
          if (!allowedAudioTypes.includes(file.type)) {
            return NextResponse.json(
              {
                success: false,
                error: ERROR_MESSAGES.INVALID_AUDIO_TYPE,
              },
              { status: 400 }
            )
          }

          // Validate audio file size
          if (file.size > FILE_LIMITS.AUDIO_MAX_SIZE_BYTES) {
            return NextResponse.json(
              { 
                success: false, 
                error: ERROR_MESSAGES.AUDIO_FILE_TOO_LARGE,
              },
              { status: 400 }
            )
          }
        } else {
          return NextResponse.json(
            {
              success: false,
              error: 'File must be an image or audio file',
            },
            { status: 400 }
          )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary with resource_type based on file type
        const result = await new Promise<CloudinaryResult>((resolve, reject) => {
          // ✅ Properly typed uploadOptions - NO 'any'
          const uploadOptions: UploadApiOptions = {
            folder: CLOUDINARY_CONFIG.FOLDER,
            resource_type: isAudio ? 'video' : 'image', // Cloudinary uses 'video' for audio files
          }

          // Add transformations only for images
          if (isImage) {
            uploadOptions.transformation = [
              { 
                width: CLOUDINARY_CONFIG.TRANSFORMATION.width, 
                crop: CLOUDINARY_CONFIG.TRANSFORMATION.crop 
              },
              { quality: CLOUDINARY_CONFIG.TRANSFORMATION.quality },
              { fetch_format: CLOUDINARY_CONFIG.TRANSFORMATION.fetch_format },
            ]
          }

          cloudinary.uploader
            .upload_stream(
              uploadOptions,
              (error, result) => {
                if (error) reject(error)
                else if (result) resolve(result as CloudinaryResult)
                else reject(new Error('Upload failed'))
              }
            )
            .end(buffer)
        })

        return NextResponse.json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
        })
      } catch (error) {
        console.error('❌ Error uploading to Cloudinary:', error)
        return NextResponse.json(
          {
            success: false,
            error:
              error instanceof Error && process.env.NODE_ENV === 'development'
                ? error.message
                : 'Failed to upload image',
          },
          { status: 500 }
        )
      }
    },
    rateLimiters.upload // Strict rate limit: 5 per minute
  )
}