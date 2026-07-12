import { redirect } from 'next/navigation'
import { requireBlogAdmin } from '@/lib/blogAdmin'
import BlogEditorForm from '@/components/blog/BlogEditorForm'

export default async function NewBlogPostPage() {
  const session = await requireBlogAdmin()
  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/dashboard/blog/new')
  }

  return <BlogEditorForm mode="create" />
}
