import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import WishBloomView from './WishBloomView'
import ErrorBoundary from '@/components/ErrorBoundary'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'

interface WishBloomPageProps {
  params: {
    id: string
  }
}

/**
 * Generate dynamic metadata for social sharing (OG tags, Twitter cards)
 * This makes shared links look beautiful on WhatsApp, Twitter, Facebook, etc.
 */
export async function generateMetadata({ params }: WishBloomPageProps): Promise<Metadata> {
  const { id } = params

  try {
    await dbConnect()
    
    // Find by uniqueUrl (the [id] param)
    const wishbloom = await WishBloom.findOne({ 
      uniqueUrl: id, 
      isArchived: { $ne: true } 
    }).lean()

    if (!wishbloom) {
      return {
        title: 'WishBloom Not Found',
        description: 'This WishBloom could not be found.',
      }
    }

    // Construct dynamic metadata
    const title = `Happy Birthday ${wishbloom.recipientName}! 🌸`
    const description = `A collection of memories and wishes created by ${wishbloom.createdBy.name}. ${wishbloom.memories.length} special memories, ${wishbloom.messages.length} heartfelt messages.`
    
    // Get first memory image for OG image (if available)
    const firstImageUrl = wishbloom.memories.find((m: { imageUrl?: string }) => m.imageUrl)?.imageUrl
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/${wishbloom.uniqueUrl}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        siteName: 'WishBloom',
        images: firstImageUrl ? [
          {
            url: firstImageUrl,
            width: 1200,
            height: 630,
            alt: `Memory from ${wishbloom.recipientName}'s WishBloom`,
          }
        ] : [],
      },
      twitter: {
        card: firstImageUrl ? 'summary_large_image' : 'summary',
        title,
        description,
        images: firstImageUrl ? [firstImageUrl] : [],
      },
      // Additional metadata for better SEO
      keywords: [
        'birthday wishes',
        'digital scrapbook',
        'memory book',
        wishbloom.recipientName,
        'celebration',
      ],
      authors: [{ name: wishbloom.createdBy.name }],
      creator: wishbloom.createdBy.name,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    
    // Return default metadata on error
    return {
      title: 'WishBloom - Digital Memory Book',
      description: 'A beautiful collection of memories and wishes.',
    }
  }
}

/**
 * Dynamic route for viewing WishBlooms
 * Now using direct DB query for better performance and consistency with metadata
 */
export default async function WishBloomPage({ params }: WishBloomPageProps) {
  const { id } = params

  await dbConnect()
  
  // Find by uniqueUrl first, then by _id (same logic as API route)
  let wishbloom = await WishBloom.findOne({ 
    uniqueUrl: id, 
    isArchived: { $ne: true } 
  }).lean()
  
  if (!wishbloom) {
    wishbloom = await WishBloom.findOne({ 
      _id: id, 
      isArchived: { $ne: true } 
    }).lean()
  }

  if (!wishbloom) {
    notFound()
  }

  // Increment view count (fire and forget, don't await)
  WishBloom.findByIdAndUpdate(wishbloom._id, { $inc: { viewCount: 1 } }).catch(err => {
    console.error('Failed to increment view count:', err)
  })

  // Convert MongoDB document to plain object and serialize dates
  const serializedWishbloom = JSON.parse(JSON.stringify(wishbloom))

  return (
    <ErrorBoundary>
      <WishBloomView wishbloom={serializedWishbloom} />
    </ErrorBoundary>
  )
}