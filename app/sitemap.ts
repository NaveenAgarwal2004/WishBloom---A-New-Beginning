// app/sitemap.ts
import type { MetadataRoute } from 'next'
import dbConnect from '@/lib/mongodb'
import WishBloom from '@/models/WishBloom'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Base URL logic:
 * We hardcode the production URL to ensure Vercel preview domains NEVER leak into our sitemaps, 
 * which could cause Google to index duplicate Vercel subdomains.
 */
const BASE = 'https://wishblooms.in'

/**
 * Fetch dynamic WishBloom pages from MongoDB
 * Returns array of uniqueUrl strings
 */
import BlogPost from '@/models/BlogPost'

/**
 * Fetch dynamic WishBloom pages and published BlogPosts from MongoDB
 */
async function getDynamicPages(): Promise<{ wishbloomUrls: string[]; blogPosts: { slug: string; updatedAt?: Date }[] }> {
  try {
    await dbConnect()

    const [wishblooms, posts] = await Promise.all([
      WishBloom.find({ isArchived: { $ne: true } })
        .select('uniqueUrl')
        .lean()
        .maxTimeMS(4000)
        .exec(),
      BlogPost.find({ published: true })
        .select('slug updatedAt')
        .lean()
        .maxTimeMS(4000)
        .exec()
    ])

    return {
      wishbloomUrls: wishblooms.map((wb: any) => wb.uniqueUrl).filter(Boolean),
      blogPosts: posts.map((p: any) => ({ slug: p.slug, updatedAt: p.updatedAt }))
    }
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error)
    return { wishbloomUrls: [], blogPosts: [] }
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
  {
    url: `${BASE}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE}/how-it-works`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${BASE}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
]

  try {
    const timeoutPromise = new Promise<{ wishbloomUrls: string[]; blogPosts: { slug: string; updatedAt?: Date }[] }>((_, reject) => {
      setTimeout(() => reject(new Error('Sitemap generation timeout')), 5000)
    })

    const { wishbloomUrls, blogPosts } = await Promise.race([
      getDynamicPages(),
      timeoutPromise,
    ])

    // Map dynamic WishBloom creation pages
    const wishbloomRoutes: MetadataRoute.Sitemap = wishbloomUrls.map((slug) => {
      const path = slug.startsWith('/') ? slug : `/${slug}`
      return {
        url: `${BASE}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })

    // Map published blog post pages
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
      const cleanSlug = post.slug.replace(/^\/blog\//, '').replace(/^\//, '')
      return {
        url: `${BASE}/blog/${cleanSlug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })

    return [...staticRoutes, ...blogRoutes, ...wishbloomRoutes]
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
    return staticRoutes
  }
}
