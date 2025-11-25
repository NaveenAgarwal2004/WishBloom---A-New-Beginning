import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'

export async function POST(request: Request) {
  // ✅ Use lenient rate limiter for analytics (internal use, not user-facing)
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json()
        const { name, value, rating, id, timestamp } = body

        // Log the web vital normally
        logger.info(`Web Vital: ${name}`, {
          value,
          rating,
          id,
          timestamp,
        })

        return NextResponse.json({ success: true })
      } catch (error: any) {
        // 🔕 Ignore harmless aborted requests
        if (error?.name === 'AbortError' || error?.message === 'aborted') {
          return NextResponse.json({ success: true, aborted: true }, { status: 204 })
        }

        // ❗ Log real errors only
        logger.error('Failed to record web vital', error)

        return NextResponse.json(
          { success: false, error: 'Failed to record metric' },
          { status: 500 }
        )
      }
    },
    rateLimiters.analytics
  )
}
