import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Draft from '@/models/Draft'
import { z } from 'zod'

const DraftPayloadSchema = z.object({
  step: z.number().min(1).max(6).optional(),
  progress: z.number().min(0).max(100).optional(),
  payload: z.any(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validation = DraftPayloadSchema.safeParse(body)

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

    await dbConnect()

    const userId = session.user.email
    const { step, progress, payload } = validation.data

    let draft = await Draft.findOne({ userId }).sort({ updatedAt: -1 })

    if (draft) {
      draft.step = step ?? draft.step
      draft.progress = progress ?? draft.progress
      draft.payload = payload ?? draft.payload
      draft.lastUpdated = new Date()
      
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      draft.expiresAt = thirtyDaysFromNow

      await draft.save()
    } else {
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

      draft = await Draft.create({
        userId,
        step: step ?? 1,
        progress: progress ?? 0,
        payload: payload ?? {},
        expiresAt: thirtyDaysFromNow,
      })
    }

    return NextResponse.json(
      {
        success: true,
        draft: {
          id: String(draft._id),
          step: draft.step,
          progress: draft.progress,
          lastUpdated: draft.lastUpdated,
          expiresAt: draft.expiresAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error saving draft:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save draft',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    await dbConnect()

    const userId = session.user.email
    const drafts = await Draft.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({
      success: true,
      drafts: drafts.map((draft) => ({
        id: String(draft._id),
        step: draft.step,
        progress: draft.progress,
        payload: draft.payload,
        lastUpdated: draft.lastUpdated,
        expiresAt: draft.expiresAt,
        createdAt: draft.createdAt,
      })),
    })
  } catch (error) {
    console.error('❌ Error fetching drafts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch drafts' },
      { status: 500 }
    )
  }
}
