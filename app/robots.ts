import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Use production URL to prevent Vercel preview domains from leaking into SEO
  const baseUrl = 'https://wishblooms.in'

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