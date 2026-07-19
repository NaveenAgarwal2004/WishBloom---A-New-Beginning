import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { requireBlogAdmin } from '@/lib/blogAdmin'

// GET — List blog posts
// Admin sees all (drafts + published). Public sees published only.
export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'

    let query = {}

    if (adminView) {
      const session = await requireBlogAdmin()
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      // Admin sees everything
    } else {
      // Public only sees published posts
      query = { published: true }
    }

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .select('-content') // Don't send full content for list view
      .lean()
      .exec()

    return NextResponse.json({ posts: JSON.parse(JSON.stringify(posts)) })
  } catch (error) {
    console.error('Blog GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST — Create a new blog post
export async function POST(request: Request) {
  const session = await requireBlogAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const body = await request.json()

    const { title, slug, description, content, published, tier, readTime, keywords, faqSchema } = body

    if (!title || !slug || !description || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, description, content' },
        { status: 422 }
      )
    }

    // Check for duplicate slug
    const existing = await BlogPost.findOne({ slug })
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    }

    const post = await BlogPost.create({
      title,
      slug,
      description,
      content,
      published: published || false,
      tier: tier || 2,
      readTime: readTime || '3 min read',
      keywords: keywords || [],
      faqSchema: faqSchema || null,
      author: {
        name: session.user?.name || 'Naveen Agarwal',
        email: session.user?.email || '',
      },
    })

    return NextResponse.json({ post: JSON.parse(JSON.stringify(post)) }, { status: 201 })
  } catch (error) {
    console.error('Blog POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
