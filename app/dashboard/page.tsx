import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'
import DashboardClient from './DashboardClient'
import { IWishBloom } from '@/models/WishBloom'

/**
 * ✅ Part 4: Creator Dashboard
 * React Server Component - Fetches user's WishBlooms server-side
 */
export default async function DashboardPage() {
  // Get user session
  const session = await getServerSession(authOptions)

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect('/api/auth/signin?callbackUrl=/dashboard')
  }

  // Connect to database
  await dbConnect()

  // Fetch all WishBlooms created by this user
  const blooms = await WishBloom.find({ 
    'createdBy.id': (session.user as any).id 
  })
    .sort({ createdDate: -1 })
    .lean()
    .exec()

  // Serialize the data for client component
  // Convert MongoDB documents to plain objects and handle Date objects
  const serializedBlooms = JSON.parse(JSON.stringify(blooms))

  return (
    <div className="min-h-screen bg-gradient-to-b from-warmCream-100 to-rosePetal/10 pt-16">
      <DashboardClient 
        blooms={serializedBlooms} 
        userName={session.user.name || 'User'}
      />
    </div>
  )
}
