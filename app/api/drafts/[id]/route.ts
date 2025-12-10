import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Draft from '@/models/Draft'
import mongoose from 'mongoose'

export async function GET(
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

    const draft = await Draft.findById(draftId).lean()

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

    return NextResponse.json({
      success: true,
      draft: {
        id: String(draft._id),
        step: draft.step,
        progress: draft.progress,
        payload: draft.payload,
        lastUpdated: draft.lastUpdated,
        expiresAt: draft.expiresAt,
        createdAt: draft.createdAt,
      },
    })
  } catch (error) {
    console.error('❌ Error fetching draft:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch draft' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await Draft.findByIdAndDelete(draftId)

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    })
  } catch (error) {
    console.error('❌ Error deleting draft:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete draft' },
      { status: 500 }
    )
  }
}
