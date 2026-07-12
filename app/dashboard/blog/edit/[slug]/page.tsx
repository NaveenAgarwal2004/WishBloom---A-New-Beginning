import { redirect, notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import BlogPost from '@/models/BlogPost'
import { requireBlogAdmin } from '@/lib/blogAdmin'
import BlogEditorForm from '@/components/blog/BlogEditorForm'

export default async function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const session = await requireBlogAdmin()
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/dashboard/blog/edit/${params.slug}`)
  }

  await dbConnect()
  const post = await BlogPost.findOne({ slug: params.slug }).lean().exec()

  if (!post) {
    notFound()
  }

  const serialized = JSON.parse(JSON.stringify(post))

  return <BlogEditorForm mode="edit" initialData={serialized} />
}
