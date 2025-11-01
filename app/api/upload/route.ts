import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'
import { env } from '@/lib/env'

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

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

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(file.type)) {
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed',
            },
            { status: 400 }
          )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
          return NextResponse.json(
            { success: false, error: 'File size too large. Maximum 5MB allowed' },
            { status: 400 }
          )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: 'wishbloom',
                transformation: [
                  { width: 1200, crop: 'limit' },
                  { quality: 'auto' },
                  { fetch_format: 'auto' },
                ],
              },
              (error, result) => {
                if (error) reject(error)
                else resolve(result)
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