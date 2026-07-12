'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, FileText } from 'lucide-react'

interface BlogPostSummary {
  _id: string
  title: string
  slug: string
  description: string
  published: boolean
  tier: number
  readTime: string
  createdAt: string
  updatedAt: string
}

interface BlogPostListProps {
  posts: BlogPostSummary[]
}

export default function BlogPostList({ posts: initialPosts }: BlogPostListProps) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to permanently delete this post?')) return

    setDeleting(slug)
    try {
      const res = await fetch(`/api/blog/${slug}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== slug))
      }
    } catch {
      alert('Failed to delete post. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleTogglePublish = async (slug: string, currentlyPublished: boolean) => {
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentlyPublished }),
      })

      if (res.ok) {
        setPosts(
          posts.map((p) =>
            p.slug === slug ? { ...p, published: !currentlyPublished } : p
          )
        )
      }
    } catch {
      alert('Failed to update post. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-warmCream-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-body font-body text-warmCream-700 hover:text-sepiaInk transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-h2 font-heading font-bold text-sepiaInk">Blog Manager</h1>
            <p className="text-body font-body text-warmCream-600 mt-1">
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/dashboard/blog/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-mossGreen text-white rounded-full font-heading hover:bg-mossGreen/90 transition-all shadow-soft"
          >
            <Plus size={18} />
            New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white/40 rounded-2xl border border-warmCream-200 border-dashed">
            <FileText className="mx-auto mb-4 text-warmCream-400" size={48} />
            <p className="text-body-lg font-body text-warmCream-600 mb-2">No blog posts yet</p>
            <p className="text-body-sm font-body text-warmCream-500">
              Click "New Post" to write your first article.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-warmCream-200 shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-h5 font-heading text-sepiaInk truncate">
                        {post.title}
                      </h2>
                      <span
                        className={`flex-shrink-0 px-3 py-1 rounded-full text-micro font-mono font-bold tracking-wider ${
                          post.published
                            ? 'bg-mossGreen/10 text-mossGreen border border-mossGreen/30'
                            : 'bg-warmCream-100 text-warmCream-600 border border-warmCream-300'
                        }`}
                      >
                        {post.published ? 'LIVE' : 'DRAFT'}
                      </span>
                      <span className="flex-shrink-0 px-2 py-1 rounded-full text-micro font-mono text-warmCream-500 bg-warmCream-100 border border-warmCream-200">
                        T{post.tier}
                      </span>
                    </div>
                    <p className="text-body-sm font-body text-warmCream-600 line-clamp-1 mb-2">
                      {post.description}
                    </p>
                    <p className="text-caption font-mono text-warmCream-500">
                      /blog/{post.slug} · {post.readTime} ·{' '}
                      {new Date(post.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(post.slug, post.published)}
                      title={post.published ? 'Unpublish' : 'Publish'}
                      className="p-2 rounded-lg text-warmCream-500 hover:bg-warmCream-100 hover:text-sepiaInk transition-colors"
                    >
                      {post.published ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <Link
                      href={`/dashboard/blog/edit/${post.slug}`}
                      className="p-2 rounded-lg text-warmCream-500 hover:bg-warmCream-100 hover:text-sepiaInk transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      disabled={deleting === post.slug}
                      title="Delete"
                      className="p-2 rounded-lg text-warmCream-500 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
