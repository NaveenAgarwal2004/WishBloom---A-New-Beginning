import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Birthday Gift Ideas & Memory Book Guides | WishBloom Blog',
  description: 'Explore creative birthday gift ideas, guides on making digital memory books, and inspiration for heartfelt wishes for friends and family.',
  keywords: [
    'free birthday memory book online',
    'birthday gift ideas',
    'digital scrapbook birthday',
    'online birthday card maker',
    'birthday memory book creator'
  ],
  openGraph: {
    title: 'Birthday Gift Ideas & Memory Book Guides | WishBloom Blog',
    description: 'Explore creative birthday gift ideas, guides on making digital memory books, and inspiration for heartfelt wishes for friends and family.',
    url: 'https://wishblooms.in/blog',
    siteName: 'WishBloom',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Gift Ideas & Memory Book Guides | WishBloom Blog',
    description: 'Explore creative birthday gift ideas, guides on making digital memory books, and inspiration for heartfelt wishes for friends and family.',
  },
  alternates: {
    canonical: 'https://wishblooms.in/blog',
  },
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-warmCream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-4">
          The WishBloom Blog
        </h1>
        <p className="text-body-lg font-body text-warmCream-700">
          Birthday gift ideas, guides on making digital memory books, and more.
        </p>
      </div>
    </main>
  )
}
