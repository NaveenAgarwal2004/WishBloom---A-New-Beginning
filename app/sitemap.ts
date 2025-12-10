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

  // Static pages
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
  ]

  try {
    // Get recent public WishBlooms
    await dbConnect()
    const wishblooms = await WishBloom.find({ isArchived: { $ne: true } })
      .select('uniqueUrl createdDate')
      .sort({ createdDate: -1 })
      .limit(1000)
      .lean()

    const wishbloomPages: MetadataRoute.Sitemap = (wishblooms as WishBloomDocument[]).map((wb) => ({
      url: `${baseUrl}/${wb.uniqueUrl}`,
      lastModified: new Date(wb.createdDate),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...wishbloomPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
