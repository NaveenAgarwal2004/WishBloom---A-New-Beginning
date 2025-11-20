'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ArrowLeft, Plus, Trash2, Edit2, Check } from 'lucide-react'
import { useState } from 'react'
import { nanoid } from 'nanoid'
import useWishBloomStore from '@/store/useWishBloomStore'
import ImageUploader from '@/components/ImageUploader'
import { MemorySchema } from '@/schemas/wishbloom.schema'
import { VALIDATION_LIMITS, MEMORY_TYPES, MEMORY_TAGS } from '@/config/constants'
import type { IMemory } from '@/models/WishBloom'

// ✅ ROOT FIX: Match Zod schema's inferred type exactly
type MemoryFormData = {
  title: string
  description: string
  date: string
  type: 'standard' | 'featured' | 'quote'
  contributor: {
    id?: string
    name: string
    email?: string
    contributionCount: number
  }
  imageUrl?: string
  tags: Array<'love' | 'milestone' | 'nostalgic' | 'celebration' | 'funny'> // ✅ Required array, not optional
  rotation?: number
  createdAt?: string
}

export default function Step2Memories() {
  const store = useWishBloomStore()
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MemoryFormData>({
    resolver: zodResolver(MemorySchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      date: '',
      imageUrl: undefined,
      type: 'standard',
      tags: [], // ✅ Initialize as empty array, not undefined
      contributor: { 
        name: '', 
        email: '',
        contributionCount: 1
      },
    },
  })

  const canProceed = store.memories.length >= VALIDATION_LIMITS.MEMORIES_MIN_REQUIRED

  const onSubmit = (data: MemoryFormData) => {
    const memory: IMemory = {
      ...data,
      id: editingMemoryId || nanoid(8),
      type: data.type || 'standard',
      contributor: {
        id: data.contributor.id || nanoid(8),
        name: data.contributor.name || 'Anonymous',
        email: data.contributor.email || undefined,
        contributionCount: data.contributor.contributionCount || 1,
      },
      rotation: data.rotation || 0,
      createdAt: new Date(),
    }

    if (editingMemoryId) {
      store.updateMemory(editingMemoryId, memory)
      setEditingMemoryId(null)
    } else {
      store.addMemory(memory)
    }

    reset({
      title: '',
      description: '',
      date: '',
      imageUrl: undefined,
      type: 'standard',
      tags: [], // ✅ Reset to empty array
      contributor: { 
        name: '', 
        email: '',
        contributionCount: 1
      },
    })
  }

  const handleEdit = (memory: IMemory) => {
    setEditingMemoryId(memory.id)
    setValue('title', memory.title)
    setValue('description', memory.description)
    setValue('date', memory.date)
    setValue('imageUrl', memory.imageUrl)
    setValue('type', memory.type)
    setValue('tags', (memory.tags || []) as any) // ✅ Ensure it's an array
    setValue('contributor.name', memory.contributor.name)
    setValue('contributor.email', memory.contributor.email || '')
    setValue('contributor.contributionCount', memory.contributor.contributionCount)
  }

  const selectedTags = watch('tags') || []

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-h2 font-heading font-bold text-sepiaInk mb-4">Add Memories</h2>
      <p className="text-body text-warmCream-700 mb-8">
        Share at least {VALIDATION_LIMITS.MEMORIES_MIN_REQUIRED} memorable moments
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-warmCream-50 rounded-xl p-8 border-2 border-warmCream-300 mb-8">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="The Coffee Shop Revelation"
              />
              {errors.title && (
                <p className="text-caption text-fadedRose mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Date *
              </label>
              <input
                {...register('date')}
                type="date"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
              />
              {errors.date && (
                <p className="text-caption text-fadedRose mt-1">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
              Description *
            </label>
            <textarea
              {...register('description')}
              maxLength={VALIDATION_LIMITS.MEMORY_DESCRIPTION_MAX}
              rows={6}
              className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none resize-none"
              placeholder="Tell the story behind this memory..."
            />
            {errors.description && (
              <p className="text-caption text-fadedRose mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
              Image (optional)
            </label>
            <ImageUploader
              onUpload={(url) => setValue('imageUrl', url)}
              existingImage={watch('imageUrl')}
            />
          </div>

          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
              Memory Type
            </label>
            <div className="flex gap-4">
              {MEMORY_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register('type')}
                    type="radio"
                    value={type}
                    className="w-5 h-5"
                  />
                  <span className="text-body font-body capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-3">
              {MEMORY_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={(e) => {
                      const current = selectedTags
                      if (e.target.checked) {
                        setValue('tags', [...current, tag] as any)
                      } else {
                        setValue('tags', current.filter((t) => t !== tag) as any)
                      }
                    }}
                    className="w-5 h-5"
                  />
                  <span className="text-body font-body capitalize">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Contributor Name *
              </label>
              <input
                {...register('contributor.name')}
                type="text"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="Your name"
              />
              {errors.contributor?.name && (
                <p className="text-caption text-fadedRose mt-1">{errors.contributor.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-body-sm font-body font-semibold text-sepiaInk mb-2 block">
                Contributor Email (optional)
              </label>
              <input
                {...register('contributor.email')}
                type="email"
                className="w-full bg-white border-2 border-warmCream-300 focus:border-fadedGold rounded-lg px-4 py-3 text-body font-body outline-none"
                placeholder="email@example.com"
              />
              {errors.contributor?.email && (
                <p className="text-caption text-fadedRose mt-1">{errors.contributor.email.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-mossGreen text-warmCream-50 rounded-lg font-body font-semibold hover:shadow-colored-green transition-all flex items-center gap-2"
          >
            {editingMemoryId ? <Check size={20} /> : <Plus size={20} />}
            {editingMemoryId ? 'Update Memory' : 'Add Memory'}
          </button>
        </div>
      </form>

      {store.memories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-h5 font-heading font-semibold text-sepiaInk mb-4">
            Added Memories ({store.memories.length})
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {store.memories.map((memory) => (
              <div key={memory.id} className="bg-warmCream-50 rounded-lg p-6 border-2 border-warmCream-300">
                {memory.imageUrl && (
                  <img src={memory.imageUrl} alt={memory.title} className="w-full h-32 object-cover rounded mb-4" />
                )}
                <h4 className="text-h6 font-heading font-semibold text-sepiaInk mb-2">{memory.title}</h4>
                <p className="text-body-sm text-warmCream-700 line-clamp-2 mb-3">{memory.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(memory)}
                    type="button"
                    className="px-3 py-1 bg-fadedGold/20 text-fadedGold rounded font-body text-caption font-semibold hover:bg-fadedGold/30 transition-colors flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => store.deleteMemory(memory.id)}
                    type="button"
                    className="px-3 py-1 bg-fadedRose/20 text-fadedRose rounded font-body text-caption font-semibold hover:bg-fadedRose/30 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!canProceed && (
        <p className="text-body text-fadedRose mb-4">
          Please add at least {VALIDATION_LIMITS.MEMORIES_MIN_REQUIRED} memories to continue
        </p>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => store.previousStep()}
          type="button"
          className="px-8 py-4 bg-warmCream-300 text-warmCream-800 rounded-xl text-h6 font-heading font-semibold hover:bg-warmCream-400 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={() => store.nextStep()}
          disabled={!canProceed}
          type="button"
          className="px-8 py-4 bg-burntSienna text-warmCream-50 rounded-xl text-h6 font-heading font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-colored-gold transition-all flex items-center gap-2"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}