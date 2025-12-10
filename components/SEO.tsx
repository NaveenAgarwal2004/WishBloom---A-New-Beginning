import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  author?: string
  noindex?: boolean
}

export default function SEO({
  title = 'WishBloom - Pressed Flower Birthday Memories',
  description = "Create beautiful, interactive birthday memory books. Preserve and share life's most precious moments in a digital pressed flower scrapbook.",
  image = '/og-image.png',
  url = 'https://wishbloom.app',
  type = 'website',
  publishedTime,
  author,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes('WishBloom') ? title : `${title} | WishBloom`
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="WishBloom" />
      <meta property="og:locale" content="en_US" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Additional SEO tags */}
      <meta name="keywords" content="birthday, memories, gift, scrapbook, pressed flowers, digital memory book, birthday wishes" />
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* Theme color */}
      <meta name="theme-color" content="#FBF7F0" />
    </Head>
  )
}

// Proper type definition for WishBloom
interface WishBloomStructuredData {
  recipientName: string
  introMessage: string
  createdBy: {
    name: string
  }
  createdDate: string
  memories: Array<{
    imageUrl: string
  }>
  viewCount?: number
}

// Structured data for rich snippets
export function generateStructuredData(wishbloom: WishBloomStructuredData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `Birthday Memories for ${wishbloom.recipientName}`,
    description: wishbloom.introMessage.substring(0, 200),
    author: {
      '@type': 'Person',
      name: wishbloom.createdBy.name,
    },
    dateCreated: wishbloom.createdDate,
    datePublished: wishbloom.createdDate,
    thumbnailUrl: wishbloom.memories[0]?.imageUrl,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/ViewAction',
      userInteractionCount: wishbloom.viewCount,
    },
  }
}