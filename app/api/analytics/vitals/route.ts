import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'

export async function POST(request: Request) {
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json()
        const { name, value, rating, id, timestamp } = body

        // Log the web vital
        logger.info(`Web Vital: ${name}`, {
          value,
          rating,
          id,
          timestamp,
        })

        // Optional: Store in database for analytics
        // await dbConnect()
        // await WebVital.create({ name, value, rating, timestamp })

        return NextResponse.json({ success: true })
      } catch (error) {
        logger.error('Failed to record web vital', error)
        return NextResponse.json(
          { success: false, error: 'Failed to record metric' },
          { status: 500 }
        )
      }
    },
    rateLimiters.public
  )
}