import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'

/**
 * GET /api/stats/blooms
 * 
 * Returns the count of WishBlooms created (excluding archived)
 * Used by FooterStats component for dynamic statistics
 */
export async function GET() {
  try {
    // Connect to database
    await dbConnect()
    
    // Get count of all non-archived WishBlooms
    const bloomCount = await WishBloom.countDocuments({ isArchived: false })
    
    return NextResponse.json({ 
      success: true, 
      count: bloomCount 
    })
  } catch (error) {
    console.error('Failed to fetch bloom count:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        count: 0,
        error: 'Failed to fetch bloom count' 
      },
      { status: 500 }
    )
  }
}
