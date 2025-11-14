import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'

interface RouteParams {
  params: {
    id: string
  }
}

// GET - Get WishBloom by ID or unique URL
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await dbConnect()

    const { id } = params

    // Try to find by uniqueUrl first, then by _id
    let wishbloom = await WishBloom.findOne({ uniqueUrl: id, isArchived: { $ne: true } })
    
    if (!wishbloom) {
      wishbloom = await WishBloom.findOne({ _id: id, isArchived: { $ne: true } })
    }

    if (!wishbloom) {
      return NextResponse.json(
        { success: false, error: 'WishBloom not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await WishBloom.findByIdAndUpdate(wishbloom._id, { $inc: { viewCount: 1 } })

    return NextResponse.json({
      success: true,
      wishbloom,
    })
  } catch (error) {
    console.error('Error fetching WishBloom:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch WishBloom' },
      { status: 500 }
    )
  }
}

// PATCH - Update WishBloom
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    await dbConnect()

    const { id } = params
    const body = await request.json()

    const wishbloom = await WishBloom.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!wishbloom) {
      return NextResponse.json(
        { success: false, error: 'WishBloom not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      wishbloom,
    })
  } catch (error) {
    console.error('Error updating WishBloom:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update WishBloom' },
      { status: 500 }
    )
  }
}

// DELETE - Archive WishBloom (soft delete)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await dbConnect()

    const { id } = params

    const wishbloom = await WishBloom.findByIdAndUpdate(
      id,
      { $set: { isArchived: true } },
      { new: true }
    )

    if (!wishbloom) {
      return NextResponse.json(
        { success: false, error: 'WishBloom not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'WishBloom archived successfully',
    })
  } catch (error) {
    console.error('Error archiving WishBloom:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to archive WishBloom' },
      { status: 500 }
    )
  }
}