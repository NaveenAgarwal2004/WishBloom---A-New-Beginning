import { redirect } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { requireBlogAdmin } from '@/lib/blogAdmin'
import BlogPostList from '@/components/blog/BlogPostList'

export default async function BlogManagerPage() {
  const session = await requireBlogAdmin()
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard/blog')
  }

  await dbConnect()
  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .select('-content')
    .lean()
    .exec()

  const serialized = JSON.parse(JSON.stringify(posts))

  return <BlogPostList posts={serialized} />
}
