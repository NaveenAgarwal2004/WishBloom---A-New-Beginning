'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, EyeOff, Plus, Trash2 } from 'lucide-react'

// Lazy-load the heavy editor component
const BlogEditor = dynamic(() => import('@/components/blog/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div className="bg-white/60 rounded-2xl border border-warmCream-200 p-8 text-center text-warmCream-500 min-h-[400px] flex items-center justify-center">
      Loading editor…
    </div>
  ),
})

interface FaqItem {
  question: string
  answer: string
}

interface BlogEditorFormProps {
  initialData?: {
    title: string
    slug: string
    description: string
    content: string
    published: boolean
    tier: number
    readTime: string
    faqSchema?: { mainEntity?: FaqItem[] } | null
    keywords?: string[]
  }
  mode: 'create' | 'edit'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function BlogEditorForm({ initialData, mode }: BlogEditorFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [content, setContent] = useState(initialData?.content || '<p>Start writing your blog post here…</p>')
  const [published, setPublished] = useState(initialData?.published || false)
  const [tier, setTier] = useState(initialData?.tier || 2)
  const [readTime, setReadTime] = useState(initialData?.readTime || '3 min read')
  const [faqItems, setFaqItems] = useState<FaqItem[]>(() => {
    const entities = initialData?.faqSchema?.mainEntity
    if (!entities || !Array.isArray(entities)) return []
    // Map from JSON-LD shape ({ name, acceptedAnswer.text }) back to editor shape ({ question, answer })
    return entities.map((e: any) => ({
      question: e.question || e.name || '',
      answer: e.answer || e.acceptedAnswer?.text || '',
    }))
  })
  const [keywords, setKeywords] = useState(initialData?.keywords?.join(', ') || '')

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (mode === 'create') {
      setSlug(slugify(value))
    }
  }

  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: '', answer: '' }])
  }

  const removeFaqItem = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index))
  }

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqItems]
    updated[index][field] = value
    setFaqItems(updated)
  }

  const handleSave = async () => {
    if (!title || !slug || !description || !content) {
      setError('Title, slug, description, and content are required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Build FAQ schema if items exist
      const faqSchema =
        faqItems.length > 0
          ? {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems
                .filter((item) => item.question && item.answer)
                .map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                  },
                })),
            }
          : null

      const keywordsArray = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)

      const body = { title, slug, description, content, published, tier, readTime, keywords: keywordsArray, faqSchema }

      const url = mode === 'create' ? '/api/blog' : `/api/blog/${initialData?.slug}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      router.push('/dashboard/blog')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-warmCream-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/blog"
          className="inline-flex items-center gap-2 text-body font-body text-warmCream-700 hover:text-sepiaInk transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Blog Manager</span>
        </Link>

        <h1 className="text-h2 font-heading font-bold text-sepiaInk mb-8">
          {mode === 'create' ? 'New Blog Post' : 'Edit Post'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-body font-body">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-body-sm font-heading text-sepiaInk mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="How to Make a Birthday Scrapbook Online"
              className="w-full px-4 py-3 bg-white/60 border border-warmCream-300 rounded-xl text-body font-body text-sepiaInk placeholder:text-warmCream-400 focus:outline-none focus:ring-2 focus:ring-fadedGold/50 focus:border-fadedGold transition-colors"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-body-sm font-heading text-sepiaInk mb-2">
              URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-warmCream-500 text-body-sm font-mono">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="how-to-make-a-birthday-scrapbook-online"
                className="flex-1 px-4 py-3 bg-white/60 border border-warmCream-300 rounded-xl text-body font-mono text-sepiaInk placeholder:text-warmCream-400 focus:outline-none focus:ring-2 focus:ring-fadedGold/50 focus:border-fadedGold transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-body-sm font-heading text-sepiaInk mb-2">
              Meta Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="SEO meta description for this post (150-160 characters ideal)"
              rows={3}
              className="w-full px-4 py-3 bg-white/60 border border-warmCream-300 rounded-xl text-body font-body text-sepiaInk placeholder:text-warmCream-400 focus:outline-none focus:ring-2 focus:ring-fadedGold/50 focus:border-fadedGold transition-colors resize-none"
            />
          </div>

          {/* Row: Tier + Read Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-heading text-sepiaInk mb-2">
                Keyword Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/60 border border-warmCream-300 rounded-xl text-body font-body text-sepiaInk focus:outline-none focus:ring-2 focus:ring-fadedGold/50 focus:border-fadedGold transition-colors"
              >
                <option value={1}>Tier 1 — Primary</option>
                <option value={2}>Tier 2 — Secondary</option>
                <option value={3}>Tier 3 — Long-tail</option>
              </select>
            </div>
            <div>
              <label className="block text-body-sm font-heading text-sepiaInk mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="4 min read"
                className="w-full px-4 py-3 bg-white/60 border border-warmCream-300 rounded-xl text-body font-body text-sepiaInk placeholder:text-warmCream-400 focus:outline-none focus:ring-2 focus:ring-fadedGold/50 focus:border-fadedGold transition-colors"
              />
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-body-sm font-heading text-sepiaInk mb-2">
              SEO Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="birthday scrapbook, memory book, online gift (comma-separated)"
              className="w-full px-4 py-3 bg-white/60 border border-warmCream-300 rounded-xl text-body font-body text-sepiaInk placeholder:text-warmCream-400 focus:outline-none focus:ring-2 focus:ring-fadedGold/50 focus:border-fadedGold transition-colors"
            />
            <p className="mt-1 text-caption text-warmCream-500 font-mono">Comma-separated keywords for the meta tag</p>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-body-sm font-heading text-sepiaInk mb-2">
              Content
            </label>
            <BlogEditor content={content} onChange={setContent} />
          </div>

          {/* FAQ Schema Builder */}
          <div className="bg-white/40 rounded-2xl border border-warmCream-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h5 font-heading text-sepiaInk">
                FAQ Schema (for AEO / Rich Snippets)
              </h2>
              <button
                type="button"
                onClick={addFaqItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-mossGreen/10 text-mossGreen border border-mossGreen/30 rounded-full text-body-sm font-heading hover:bg-mossGreen/20 transition-colors"
              >
                <Plus size={16} />
                Add Q&A
              </button>
            </div>

            {faqItems.length === 0 && (
              <p className="text-warmCream-500 text-body-sm font-body italic">
                No FAQ items. Add Q&A pairs to generate FAQPage JSON-LD for rich snippets.
              </p>
            )}

            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white/60 rounded-xl border border-warmCream-200 p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-caption font-mono text-warmCream-500">
                      Q{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(index)}
                      className="text-warmCream-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                    placeholder="Question (e.g., What is WishBloom?)"
                    className="w-full px-3 py-2 bg-warmCream-50 border border-warmCream-200 rounded-lg text-body-sm font-body text-sepiaInk placeholder:text-warmCream-400 focus:outline-none focus:ring-1 focus:ring-fadedGold/50 mb-2"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                    placeholder="Answer (2-3 sentences, concise)"
                    rows={2}
                    className="w-full px-3 py-2 bg-warmCream-50 border border-warmCream-200 rounded-lg text-body-sm font-body text-sepiaInk placeholder:text-warmCream-400 focus:outline-none focus:ring-1 focus:ring-fadedGold/50 resize-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-warmCream-200">
            <button
              type="button"
              onClick={() => {
                setPublished(!published)
              }}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-heading transition-all ${
                published
                  ? 'bg-mossGreen/10 text-mossGreen border border-mossGreen/30'
                  : 'bg-warmCream-100 text-warmCream-600 border border-warmCream-300'
              }`}
            >
              {published ? <Eye size={18} /> : <EyeOff size={18} />}
              {published ? 'Published' : 'Draft'}
            </button>

            <div className="flex-1" />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-sepiaInk text-white rounded-full font-heading hover:bg-sepiaInk/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving…' : mode === 'create' ? 'Create Post' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
