import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Draft from '@/models/Draft'
import WishBloom from '@/models/WishBloom'
import { CreateWishBloomSchema } from '@/schemas/wishbloom.schema'
import { moderateWishBloomContent } from '@/lib/moderation'
import mongoose from 'mongoose'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()

    const draftId = params.id
    if (!mongoose.Types.ObjectId.isValid(draftId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid draft ID' },
        { status: 400 }
      )
    }

    const draft = await Draft.findById(draftId)

    if (!draft) {
      return NextResponse.json(
        { success: false, error: 'Draft not found' },
        { status: 404 }
      )
    }

    if (draft.userId !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const validation = CreateWishBloomSchema.safeParse(draft.payload)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Draft is incomplete',
          message: 'Please complete all required fields before publishing',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 422 }
      )
    }

    const data = validation.data

    const moderationResult = moderateWishBloomContent({
      recipientName: data.recipientName,
      introMessage: data.introMessage,
      memories: data.memories,
      messages: data.messages,
      celebrationWishPhrases: data.celebrationWishPhrases,
    })

    if (!moderationResult.approved) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content moderation failed',
          message: 'Your content contains inappropriate material. Please review and update before publishing.',
          details: moderationResult.issues.map(issue => ({
            field: issue.field,
            message: issue.reason,
          })),
        },
        { status: 400 }
      )
    }

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

    await Draft.findByIdAndDelete(draftId)

    return NextResponse.json(
      {
        success: true,
        wishbloom: {
          id: String(wishbloom._id),
          uniqueUrl: wishbloom.uniqueUrl,
          createdDate: wishbloom.createdDate,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error publishing draft:', error)

    const message = error instanceof Error ? error.message : 'Failed to publish draft'

    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'development' ? message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
