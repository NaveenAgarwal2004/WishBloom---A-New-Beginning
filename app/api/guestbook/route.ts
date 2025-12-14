import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'
import { GuestbookEntrySchema, GUESTBOOK_LIMITS } from '@/schemas/guestbook.schema'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'
import { moderateText, sanitizeText } from '@/lib/moderation'

/**
 * POST /api/guestbook
 * Add a new guestbook entry to a WishBloom
 * Phase 4.2: Guestbook Feature
 */
export async function POST(request: Request) {
  // Apply rate limiting - use public limiter (10 requests per minute)
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json()

        // Validate input with Zod
        const validation = GuestbookEntrySchema.safeParse(body)

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

        const data = validation.data

        // Content Moderation: Check for inappropriate content
        const nameModeration = moderateText(data.name)
        if (!nameModeration.safe) {
          return NextResponse.json(
            {
              success: false,
              error: 'Content moderation failed',
              message: 'Your name contains inappropriate content. Please update it.',
              details: nameModeration.reasons,
            },
            { status: 400 }
          )
        }

        const messageModeration = moderateText(data.message)
        if (!messageModeration.safe) {
          return NextResponse.json(
            {
              success: false,
              error: 'Content moderation failed',
              message: 'Your message contains inappropriate content. Please update it.',
              details: messageModeration.reasons,
            },
            { status: 400 }
          )
        }

        // Sanitize inputs
        const sanitizedName = sanitizeText(data.name)
        const sanitizedMessage = sanitizeText(data.message)

        await dbConnect()

        // Find the WishBloom
        const wishbloom = await WishBloom.findOne({ uniqueUrl: data.wishbloomId })

        if (!wishbloom) {
          return NextResponse.json(
            { success: false, error: 'WishBloom not found' },
            { status: 404 }
          )
        }

        // Check if guestbook is full
        if (wishbloom.guestbook && wishbloom.guestbook.length >= GUESTBOOK_LIMITS.MAX_ENTRIES_PER_WISHBLOOM) {
          return NextResponse.json(
            {
              success: false,
              error: 'Guestbook is full',
              message: 'This WishBloom has reached its maximum number of guestbook entries.',
            },
            { status: 400 }
          )
        }

        // Create new guestbook entry
        const entry = {
          id: nanoid(8),
          name: sanitizedName,
          message: sanitizedMessage,
          color: data.color,
          createdAt: new Date(),
        }

        // Add entry to guestbook
        if (!wishbloom.guestbook) {
          wishbloom.guestbook = []
        }
        wishbloom.guestbook.push(entry)
        await wishbloom.save()

        return NextResponse.json(
          {
            success: true,
            entry: {
              id: entry.id,
              name: entry.name,
              message: entry.message,
              color: entry.color,
              createdAt: entry.createdAt,
            },
          },
          { status: 201 }
        )
      } catch (error) {
        console.error('❌ Error creating guestbook entry:', error)

        const message = error instanceof Error ? error.message : 'Failed to create guestbook entry'

        return NextResponse.json(
          {
            success: false,
            error: process.env.NODE_ENV === 'development' ? message : 'Internal server error',
          },
          { status: 500 }
        )
      }
    },
    rateLimiters.public
  )
}

/**
 * GET /api/guestbook?wishbloomId=xxx
 * Fetch guestbook entries for a WishBloom
 * Phase 4.2: Guestbook Feature
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const wishbloomId = searchParams.get('wishbloomId')

    if (!wishbloomId) {
      return NextResponse.json(
        { success: false, error: 'WishBloom ID is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const wishbloom = await WishBloom.findOne({ uniqueUrl: wishbloomId })
      .select('guestbook')
      .lean()

    if (!wishbloom) {
      return NextResponse.json(
        { success: false, error: 'WishBloom not found' },
        { status: 404 }
      )
    }

    // Sort guestbook entries by date (newest first)
    const entries = (wishbloom.guestbook || []).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      success: true,
      entries,
      count: entries.length,
    })
  } catch (error) {
    console.error('❌ Error fetching guestbook entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guestbook entries' },
      { status: 500 }
    )
  }
}
