import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

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

// Ensure the blog index updates dynamically but can be cached
export const revalidate = 60 

export default async function BlogPage() {
  await dbConnect()
  
  // Only fetch published posts for the public blog
  const postsData = await BlogPost.find({ published: true })
    .sort({ createdAt: -1 })
    .select('title slug description createdAt readTime')
    .lean()
    .exec()

  const posts = JSON.parse(JSON.stringify(postsData))

  return (
    <main className="min-h-screen bg-warmCream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body font-body text-warmCream-700 hover:text-sepiaInk transition-colors mb-12"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        <header className="mb-16 text-center">
          <h1 className="text-h2 md:text-h1 font-heading font-bold text-sepiaInk mb-4">
            The WishBloom Journal
          </h1>
          <p className="text-body-lg font-body text-warmCream-700 max-w-2xl mx-auto">
            Meaningful birthday gift ideas, step-by-step guides on making digital memory books, and inspiration for celebrating the people you love.
          </p>
        </header>

        <div className="grid gap-8">
          {posts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-warmCream-200 shadow-soft hover:shadow-medium hover:border-fadedGold/40 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <h2 className="text-h3 font-heading text-sepiaInk group-hover:text-burntSienna transition-colors">
                    {post.title}
                  </h2>
                  <ArrowRight className="text-warmCream-400 group-hover:text-burntSienna transform group-hover:translate-x-1 transition-all hidden md:block" size={24} />
                </div>
                
                <p className="text-body font-body text-warmCream-700 leading-relaxed mb-6">
                  {post.description}
                </p>
                
                <div className="flex items-center gap-6 text-caption font-mono text-warmCream-500">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} />
                    {post.readTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12 bg-white/40 rounded-2xl border border-warmCream-200 border-dashed">
              <p className="text-body font-body text-warmCream-600">
                Check back soon for our first article!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
