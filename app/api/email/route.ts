import { NextResponse } from 'next/server'
import { brevoEmailService } from '@/lib/email/brevo'
import { SendEmailSchema } from '@/schemas/wishbloom.schema'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'

export async function POST(request: Request) {
  // Apply rate limiting
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json()

        // Validate input with Zod
        const validation = SendEmailSchema.safeParse(body)

        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: 'Validation failed',
              details: validation.error.flatten().fieldErrors,
            },
            { status: 422 }
          )
        }

        const { recipientEmail, recipientName, wishbloomUrl, senderName, customMessage } =
          validation.data

        // Send email via Brevo
        const result = await brevoEmailService.sendWishBloomNotification({
          recipientEmail,
          recipientName,
          wishbloomUrl,
          senderName,
          customMessage,
        })

        return NextResponse.json({
          success: true,
          messageId: result.messageId,
        })
      } catch (error) {
        console.error('❌ Error sending email:', error)

        const message =
          error instanceof Error && process.env.NODE_ENV === 'development'
            ? error.message
            : 'Failed to send email'

        return NextResponse.json(
          { success: false, error: message },
          { status: 500 }
        )
      }
    },
    rateLimiters.authenticated // More lenient for authenticated users
  )
}