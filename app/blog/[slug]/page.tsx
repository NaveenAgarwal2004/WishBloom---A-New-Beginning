import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'

// Revalidate every 60 seconds so edits to posts show up relatively quickly
export const revalidate = 60

export async function generateStaticParams() {
  await dbConnect()
  const posts = await BlogPost.find({ published: true }).select('slug').lean().exec()
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await dbConnect()
  const post = await BlogPost.findOne({ slug: params.slug, published: true }).lean().exec() as any
  
  if (!post) {
    return {
      title: 'Post Not Found | WishBloom Blog',
    }
  }

  return {
    title: `${post.title} | WishBloom`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://wishblooms.in/blog/${post.slug}`,
      siteName: 'WishBloom',
      type: 'article',
      publishedTime: new Date(post.createdAt).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://wishblooms.in/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  await dbConnect()
  const post = await BlogPost.findOne({ slug: params.slug, published: true }).lean().exec() as any

  if (!post) {
    notFound()
  }

  return (
    <>
      {post.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faqSchema) }}
        />
      )}
      <div className="min-h-screen bg-warmCream-50 relative overflow-hidden">
        
        {/* Global Paper Texture Overlay */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50">
          <svg width="100%" height="100%">
            <defs>
              <filter id="global-paper-noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#global-paper-noise)" />
          </svg>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-warmCream-100 to-transparent opacity-60 pointer-events-none" />
        
        {/* Floral Watermark - Top Right */}
        <svg className="absolute top-0 right-0 opacity-[0.03] w-96 h-96 pointer-events-none" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="30" fill="#7A5C47" />
          <ellipse cx="100" cy="50" rx="25" ry="45" fill="#7A5C47" opacity="0.8" />
          <ellipse cx="150" cy="100" rx="45" ry="25" fill="#7A5C47" opacity="0.8" />
          <ellipse cx="100" cy="150" rx="25" ry="45" fill="#7A5C47" opacity="0.8" />
          <ellipse cx="50" cy="100" rx="45" ry="25" fill="#7A5C47" opacity="0.8" />
        </svg>

        {/* Floral Watermark - Middle Left */}
        <svg className="absolute top-1/2 -left-20 opacity-[0.03] w-96 h-96 pointer-events-none transform -rotate-45" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="30" fill="#7A5C47" />
          <ellipse cx="100" cy="50" rx="25" ry="45" fill="#7A5C47" opacity="0.8" />
          <ellipse cx="150" cy="100" rx="45" ry="25" fill="#7A5C47" opacity="0.8" />
          <ellipse cx="100" cy="150" rx="25" ry="45" fill="#7A5C47" opacity="0.8" />
          <ellipse cx="50" cy="100" rx="45" ry="25" fill="#7A5C47" opacity="0.8" />
        </svg>

        <main className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Elegant Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-warmCream-200 text-caption font-mono text-warmCream-700 hover:text-sepiaInk hover:bg-white hover:border-fadedGold/40 hover:shadow-soft transition-all mb-16 group relative"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Journal</span>
            </Link>

            <article>
              <header className="mb-16 text-center relative">
                
                <h1 className="text-h2 md:text-[3.5rem] font-heading font-bold text-sepiaInk mb-6 leading-[1.15] tracking-tight relative z-10">
                  {post.title}
                </h1>
                
                {/* Hand-drawn underline */}
                <svg className="mx-auto mb-8 relative z-10" width="200" height="12" viewBox="0 0 200 12">
                  <path d="M 5 8 Q 50 4, 100 6 T 195 8" stroke="#D4A373" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-body-sm font-body text-warmCream-600 relative z-10">
                  <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-warmCream-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fadedGold to-burntSienna text-white flex items-center justify-center font-heading font-bold text-sm shadow-soft">
                      {post.author?.name ? post.author.name.charAt(0) : 'W'}
                    </div>
                    <span className="font-medium text-sepiaInk">{post.author?.name || 'WishBloom Team'}</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                      <Calendar size={16} className="text-fadedGold" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-fadedGold" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </header>

              {/* Main Content Area - Styled like a scrapbook page */}
              <div className="relative bg-white rounded-[1rem] p-8 md:p-12 lg:p-16 border-2 border-warmCream-300 shadow-dramatic">
                
                {/* Paper texture SVG for the card itself */}
                <div className="absolute inset-0 opacity-[0.04] rounded-[1rem] pointer-events-none">
                  <svg width="100%" height="100%">
                    <defs>
                      <filter id="card-paper-noise">
                        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" />
                        <feColorMatrix type="saturate" values="0" />
                      </filter>
                    </defs>
                    <rect width="100%" height="100%" filter="url(#card-paper-noise)" />
                  </svg>
                </div>

                {/* Washi tape strips at top */}
                <div className="absolute -top-4 right-10 md:right-20 w-32 h-8 bg-gradient-to-r from-rosePetal/60 to-lavenderPress/60 rounded-sm shadow-sm" style={{ transform: 'rotate(2deg)' }} />
                <div className="absolute -top-3 right-32 md:right-48 w-40 h-8 bg-gradient-to-r from-sunsetAmber/60 to-driedSage/60 rounded-sm shadow-sm" style={{ transform: 'rotate(-3deg)' }} />

                {/* Paper clip */}
                <svg className="absolute top-16 -left-4 w-12 h-12 opacity-40 z-20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#7A5C47" strokeWidth="2.5"/>
                </svg>

                <div 
                  className="relative z-10 prose prose-warm prose-lg max-w-none 
                    prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight 
                    prose-p:text-warmCream-800 prose-p:leading-relaxed 
                    prose-a:font-medium prose-a:transition-colors
                    prose-img:shadow-medium prose-img:border-4 prose-img:border-white prose-img:-rotate-1"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Visible FAQ Section */}
                {post.faqSchema && post.faqSchema.mainEntity && post.faqSchema.mainEntity.length > 0 && (
                  <div className="relative z-10 mt-16 pt-12 border-t border-warmCream-200">
                    <h2 className="text-h3 font-heading font-bold text-sepiaInk mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                      {post.faqSchema.mainEntity.map((faq: any, index: number) => (
                        <div key={index} className="bg-warmCream-50/50 rounded-xl p-6 border border-warmCream-200">
                          <h3 className="text-lg font-heading font-bold text-sepiaInk mb-3">{faq.name}</h3>
                          <p className="text-body font-body text-warmCream-700 leading-relaxed">
                            {faq.acceptedAnswer.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <footer className="mt-20">
                <div className="bg-mossGreen relative overflow-hidden rounded-[2rem] p-10 md:p-16 shadow-dramatic text-center group border-4 border-white/20">
                  {/* Botanical Background Pattern */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent mix-blend-overlay transition-transform duration-1000 group-hover:scale-105" />
                  
                  {/* Subtle Flower SVGs in Footer */}
                  <svg className="absolute -bottom-10 -left-10 opacity-10 w-64 h-64 pointer-events-none transform rotate-45" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="30" fill="#ffffff" />
                    <ellipse cx="100" cy="50" rx="25" ry="45" fill="#ffffff" opacity="0.8" />
                    <ellipse cx="150" cy="100" rx="45" ry="25" fill="#ffffff" opacity="0.8" />
                    <ellipse cx="100" cy="150" rx="25" ry="45" fill="#ffffff" opacity="0.8" />
                    <ellipse cx="50" cy="100" rx="45" ry="25" fill="#ffffff" opacity="0.8" />
                  </svg>

                  <div className="relative z-10">
                    <h2 className="text-h2 md:text-h1 font-heading font-bold text-warmCream-50 mb-6">Preserve a memory.</h2>
                    <p className="text-body-lg font-body text-warmCream-100 mb-10 max-w-2xl mx-auto opacity-90">
                      WishBloom is a free, collaborative birthday memory book creator. Gather photos and heartfelt stories from friends around the world in minutes.
                    </p>
                    <Link 
                      href="https://wishblooms.in/create"
                      className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-warmCream-50 text-mossGreen rounded-full text-lg font-heading font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                      Start a Free Book
                    </Link>
                  </div>
                </div>
              </footer>
            </article>
          </div>
        </main>
      </div>
    </>
  )
}
