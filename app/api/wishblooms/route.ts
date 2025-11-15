import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'
import { CreateWishBloomSchema } from '@/schemas/wishbloom.schema'
import type { CreateWishBloomInput } from '@/schemas/wishbloom.schema'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'

// POST - Create new WishBloom
export async function POST(request: Request) {
  // Apply rate limiting
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json()

        // Validate input with Zod
        const validation = CreateWishBloomSchema.safeParse(body)

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

        const data: CreateWishBloomInput = validation.data

        await dbConnect()

        // Generate unique URL
        let uniqueUrl = nanoid(10)
        let attempts = 0
        while (attempts < 5) {
          const existing = await WishBloom.findOne({ uniqueUrl })
          if (!existing) break
          uniqueUrl = nanoid(10)
          attempts++
        }

        if (attempts >= 5) {
          return NextResponse.json(
            { success: false, error: 'Failed to generate unique URL' },
            { status: 500 }
          )
        }

        // Add IDs to nested objects
        const memoriesWithIds = data.memories.map((mem) => ({
          ...mem,
          id: mem.id || nanoid(8),
          contributor: {
            ...mem.contributor,
            id: mem.contributor.id || nanoid(8),
          },
        }))

        const messagesWithIds = data.messages.map((msg) => ({
          ...msg,
          id: msg.id || nanoid(8),
          contributor: {
            ...msg.contributor,
            id: msg.contributor.id || nanoid(8),
          },
        }))

        // Collect all contributors
        const contributorMap = new Map()
        const creatorId = data.createdBy.id || nanoid(8)
        contributorMap.set(creatorId, { ...data.createdBy, id: creatorId, contributionCount: 1 })

        memoriesWithIds.forEach((mem) => {
          const id = mem.contributor.id
          if (contributorMap.has(id)) {
            contributorMap.get(id).contributionCount++
          } else {
            contributorMap.set(id, { ...mem.contributor, contributionCount: 1 })
          }
        })

        messagesWithIds.forEach((msg) => {
          const id = msg.contributor.id
          if (contributorMap.has(id)) {
            contributorMap.get(id).contributionCount++
          } else {
            contributorMap.set(id, { ...msg.contributor, contributionCount: 1 })
          }
        })

        const contributors = Array.from(contributorMap.values())

        // Default celebration phrases if not provided
        const defaultPhrases = [
          'Endless joy! ✨',
          'So proud of you',
          'Best year yet! 🎉',
          'You are amazing 💛',
          'Keep shining bright',
          'Here is to you!',
          'Another beautiful chapter',
          'You deserve the world',
          'Grateful for you',
          'The best is yet to come',
          'Forever your friend',
        ]

        // Create WishBloom
        const wishbloom = await WishBloom.create({
          recipientName: data.recipientName,
          age: data.age,
          creativeAgeDescription: data.creativeAgeDescription,
          introMessage: data.introMessage,
          uniqueUrl,
          createdBy: contributorMap.get(creatorId),
          contributors,
          memories: memoriesWithIds,
          messages: messagesWithIds,
          celebrationWishPhrases:
            data.celebrationWishPhrases && data.celebrationWishPhrases.length > 0
              ? data.celebrationWishPhrases
              : defaultPhrases,
          viewCount: 0,
        })

        return NextResponse.json(
          {
            success: true,
            wishbloom: {
              id: (wishbloom._id as any).toString(),
              uniqueUrl: wishbloom.uniqueUrl,
              createdDate: wishbloom.createdDate,
            },
          },
          { status: 201 }
        )
      } catch (error) {
        console.error('❌ Error creating WishBloom:', error)

        // Don't expose internal errors to client
        const message = error instanceof Error ? error.message : 'Failed to create WishBloom'

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

// GET - Get all WishBlooms (optional, for admin)
export async function GET() {
  try {
    await dbConnect()

    const wishblooms = await WishBloom.find({ isArchived: { $ne: true } })
      .select('recipientName uniqueUrl createdDate viewCount')
      .sort({ createdDate: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({
      success: true,
      wishblooms,
    })
  } catch (error) {
    console.error('❌ Error fetching WishBlooms:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch WishBlooms' },
      { status: 500 }
    )
  }
}