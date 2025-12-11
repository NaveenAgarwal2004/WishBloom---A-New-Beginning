// app/sitemap.ts
import type { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'

/**
 * Base URL logic:
 * - Prefer explicit NEXT_PUBLIC_BASE_URL (set in Vercel)
 * - Fallback to NEXT_PUBLIC_VERCEL_URL (Vercel env for preview/prod without protocol)
 * - Finally fallback to the production URL string
 */
const BASE =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '') ||
  'https://wishbloom-a-new-beginning.vercel.app'

/**
 * Fetch dynamic WishBloom pages from MongoDB
 * Returns array of uniqueUrl strings
 */
async function getDynamicPages(): Promise<string[]> {
  try {
    await dbConnect()
    
    // Fetch all non-archived WishBlooms with timeout protection
    const wishblooms = await WishBloom.find({ isArchived: { $ne: true } })
      .select('uniqueUrl')
      .lean()
      .maxTimeMS(4000) // 4 second MongoDB timeout
      .exec()

    return wishblooms.map((wb: { uniqueUrl: string }) => wb.uniqueUrl).filter(Boolean)
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error)
    // Return empty array on error - static pages will still work
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes - always available
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/create`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ]

  try {
    // Set timeout for entire dynamic page fetch (5 seconds max)
    const timeoutPromise = new Promise<string[]>((_, reject) => {
      setTimeout(() => reject(new Error('Sitemap generation timeout')), 5000)
    })

    const dynamicPageSlugs = await Promise.race([
      getDynamicPages(),
      timeoutPromise,
    ])

    // Map dynamic pages to sitemap entries
    const dynamicRoutes: MetadataRoute.Sitemap = dynamicPageSlugs.map((slug) => {
      // Ensure slug starts with /
      const path = slug.startsWith('/') ? slug : `/${slug}`
      return {
        url: `${BASE}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })

    return [...staticRoutes, ...dynamicRoutes]
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
    // Return static pages only if dynamic fetch fails
    return staticRoutes
  }
}
