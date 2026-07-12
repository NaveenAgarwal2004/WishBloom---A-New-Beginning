import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use production URL with fallback logic
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '') ||
    'https://wishblooms.in'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}