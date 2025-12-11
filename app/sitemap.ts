import { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'
import { env } from '@/lib/env'

// Type for WishBloom document
interface WishBloomDocument {
  uniqueUrl: string
  createdDate: Date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL

  // Static pages - always return these
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Set timeout for database query (5 seconds max)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Sitemap generation timeout')), 5000)
    })

    // Get recent public WishBlooms with timeout
    const wishbloomsPromise = (async () => {
      await dbConnect()
      return await WishBloom.find({ isArchived: { $ne: true } })
        .select('uniqueUrl createdDate')
        .sort({ createdDate: -1 })
        .limit(1000)
        .lean()
        .maxTimeMS(4000) // MongoDB query timeout
    })()

    const wishblooms = await Promise.race([wishbloomsPromise, timeoutPromise])

    const wishbloomPages: MetadataRoute.Sitemap = (wishblooms as WishBloomDocument[]).map((wb) => ({
      url: `${baseUrl}/${wb.uniqueUrl}`,
      lastModified: new Date(wb.createdDate),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...wishbloomPages]
  } catch (error) {
    // Log error but still return static pages for Google
    console.error('Error generating dynamic sitemap entries:', error)
    // Return static pages so sitemap is still valid
    return staticPages
  }
}
