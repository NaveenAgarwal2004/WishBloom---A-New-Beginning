import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'

/**
 * GET /api/stats/blooms
 * 
 * Returns the count of WishBlooms created (excluding archived)
 * Used by FooterStats component for dynamic statistics
 * 
 * ✅ Cached for 60 seconds to improve performance
 */
export async function GET() {
  try {
    // Connect to database with timeout
    const connectTimeout = setTimeout(() => {
      console.warn('⚠️ Database connection taking longer than expected')
    }, 5000)
    
    await dbConnect()
    clearTimeout(connectTimeout)
    
    // Get count of all non-archived WishBlooms
    const bloomCount = await WishBloom.countDocuments({ isArchived: false })
    
    return NextResponse.json(
      { 
        success: true, 
        count: bloomCount 
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
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

// Enable Edge Runtime for faster cold starts (optional)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
