import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'

// POST - Create new WishBloom
export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { recipientName, age, creativeAgeDescription, introMessage, createdBy, memories, messages, celebrationWishPhrases } = body

    // Validate required fields
    if (!recipientName || !introMessage || !createdBy || !memories || !messages) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (memories.length < 3) {
      return NextResponse.json(
        { success: false, error: 'At least 3 memories required' },
        { status: 400 }
      )
    }

    if (messages.length < 1) {
      return NextResponse.json(
        { success: false, error: 'At least 1 message required' },
        { status: 400 }
      )
    }

    // Generate unique URL
    let uniqueUrl = nanoid(10)
    let attempts = 0
    while (attempts < 5) {
      const existing = await WishBloom.findOne({ uniqueUrl })
      if (!existing) break
      uniqueUrl = nanoid(10)
      attempts++
    }

    // Add IDs to nested objects
    const memoriesWithIds = memories.map(mem => ({
      ...mem,
      id: mem.id || nanoid(8),
      contributor: {
        ...mem.contributor,
        id: mem.contributor.id || nanoid(8)
      }
    }))

    const messagesWithIds = messages.map(msg => ({
      ...msg,
      id: msg.id || nanoid(8),
      contributor: {
        ...msg.contributor,
        id: msg.contributor.id || nanoid(8)
      }
    }))

    // Collect all contributors
    const contributorMap = new Map()
    contributorMap.set(createdBy.id || nanoid(8), { ...createdBy, id: createdBy.id || nanoid(8) })

    memoriesWithIds.forEach(mem => {
      const id = mem.contributor.id
      if (contributorMap.has(id)) {
        contributorMap.get(id).contributionCount++
      } else {
        contributorMap.set(id, mem.contributor)
      }
    })

    messagesWithIds.forEach(msg => {
      const id = msg.contributor.id
      if (contributorMap.has(id)) {
        contributorMap.get(id).contributionCount++
      } else {
        contributorMap.set(id, msg.contributor)
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
      recipientName,
      age,
      creativeAgeDescription,
      introMessage,
      uniqueUrl,
      createdBy: contributorMap.get(createdBy.id || nanoid(8)),
      contributors,
      memories: memoriesWithIds,
      messages: messagesWithIds,
      celebrationWishPhrases: celebrationWishPhrases && celebrationWishPhrases.length > 0 ? celebrationWishPhrases : defaultPhrases,
      viewCount: 0,
    })

    return NextResponse.json(
      {
        success: true,
        wishbloom: {
          id: wishbloom._id.toString(),
          uniqueUrl: wishbloom.uniqueUrl,
          createdDate: wishbloom.createdDate,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating WishBloom:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create WishBloom' },
      { status: 500 }
    )
  }
}

// GET - Get all WishBlooms (optional, for admin)
export async function GET(request) {
  try {
    await dbConnect()

    const wishblooms = await WishBloom.find({ isArchived: { $ne: true } })
      .select('recipientName uniqueUrl createdDate viewCount')
      .sort({ createdDate: -1 })
      .limit(50)

    return NextResponse.json({
      success: true,
      wishblooms,
    })
  } catch (error) {
    console.error('Error fetching WishBlooms:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch WishBlooms' },
      { status: 500 }
    )
  }
}
