import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { requireBlogAdmin } from '@/lib/blogAdmin'

// GET — Fetch a single blog post by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()
    const post = await BlogPost.findOne({ slug: params.slug }).lean().exec()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post: JSON.parse(JSON.stringify(post)) })
  } catch (error) {
    console.error('Blog GET [slug] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH — Update a blog post
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await requireBlogAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const body = await request.json()

    const post = await BlogPost.findOneAndUpdate(
      { slug: params.slug },
      { $set: body },
      { new: true, runValidators: true }
    )
      .lean()
      .exec()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post: JSON.parse(JSON.stringify(post)) })
  } catch (error) {
    console.error('Blog PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE — Delete a blog post
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await requireBlogAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()
    const post = await BlogPost.findOneAndDelete({ slug: params.slug }).exec()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Blog DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
