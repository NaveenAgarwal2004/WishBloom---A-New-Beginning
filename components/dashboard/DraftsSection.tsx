'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Trash2, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import useWishBloomStore from '@/store/useWishBloomStore'

interface Draft {
  id: string
  step: number
  progress: number
  payload: any
  lastUpdated: string
  expiresAt: string
  createdAt: string
}

export default function DraftsSection() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const { toast } = useToast()
  const router = useRouter()
  const store = useWishBloomStore()

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/drafts')
      const data = await response.json()

      if (data.success) {
        setDrafts(data.drafts)
      }
    } catch (error) {
      console.error('Error fetching drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResumeDraft = async (draft: Draft) => {
    try {
      store.resetStore()
      
      if (draft.payload.recipientName) {
        store.setRecipientName(draft.payload.recipientName)
      }
      if (draft.payload.age !== undefined) {
        store.setAge(draft.payload.age)
      }
      if (draft.payload.creativeAgeDescription) {
        store.setCreativeAgeDescription(draft.payload.creativeAgeDescription)
      }
      if (draft.payload.introMessage) {
        store.setIntroMessage(draft.payload.introMessage)
      }
      if (draft.payload.createdBy) {
        store.setCreatedBy(draft.payload.createdBy)
      }
      if (draft.payload.memories && Array.isArray(draft.payload.memories)) {
        draft.payload.memories.forEach((memory: any) => store.addMemory(memory))
      }
      if (draft.payload.messages && Array.isArray(draft.payload.messages)) {
        draft.payload.messages.forEach((message: any) => store.addMessage(message))
      }
      if (draft.payload.celebrationWishPhrases) {
        store.setCelebrationWishPhrases(draft.payload.celebrationWishPhrases)
      }
      
      if (draft.step) {
        store.setCurrentStep(draft.step)
      }

      toast({
        title: '✨ Draft Loaded',
        description: 'Your draft has been restored. Continue creating!',
      })

      router.push('/create')
    } catch (error) {
      console.error('Error resuming draft:', error)
      toast({
        title: 'Error',
        description: 'Could not load draft. Please try again.',
      })
    }
  }

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(draftId)
      const response = await fetch(`/api/drafts/${draftId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setDrafts((prev) => prev.filter((d) => d.id !== draftId))
        toast({
          title: 'Draft Deleted',
          description: 'Your draft has been removed.',
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error deleting draft:', error)
      toast({
        title: 'Error',
        description: 'Could not delete draft. Please try again.',
      })
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const getRecipientName = (draft: Draft): string => {
    return draft.payload?.recipientName || 'Untitled Draft'
  }

  const getStepLabel = (step: number): string => {
    const steps = [
      'Getting Started',
      'Basics',
      'Memories',
      'Messages',
      'Celebration',
      'Review',
    ]
    return steps[step - 1] || `Step ${step}`
  }

  if (loading) {
    return (
      <div className="mb-12">
        <Card className="bg-warmCream-50/30 border-warmCream-200/50">
          <CardContent className="py-12">
            <div className="text-center text-warmCream-600">
              <p className="font-body">Loading drafts...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (drafts.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-h4 font-heading font-bold text-sepiaInk mb-4 flex items-center gap-2">
          <FileText size={24} className="text-warmCream-600" />
          Your Drafts
        </h2>
        <p className="text-body-sm font-body text-warmCream-600 mb-6">
          Continue working on unfinished WishBlooms
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((draft, index) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * index }}
            >
              <Card 
                className="bg-warmCream-50/30 border-warmCream-200/50 hover:shadow-soft-lift transition-all duration-300"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='ruled-paper' x='0' y='0' width='100' height='30' patternUnits='userSpaceOnUse'%3E%3Cline x1='0' y1='30' x2='100' y2='30' stroke='%23D4A373' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23ruled-paper)'/%3E%3C/svg%3E")`,
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-h6 font-heading text-sepiaInk/80 mb-1">
                        {getRecipientName(draft)}
                      </CardTitle>
                      <CardDescription className="text-body-sm font-body text-warmCream-600 flex items-center gap-2">
                        <Clock size={14} />
                        {formatDate(draft.lastUpdated)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-caption font-body text-warmCream-600 mb-1">
                        {getStepLabel(draft.step)}
                      </div>
                      <div className="text-body-sm font-heading font-bold text-fadedGold">
                        {draft.progress}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-warmCream-200/50 rounded-full overflow-hidden mb-4">
                    <motion.div
                      className="h-full bg-gradient-to-r from-fadedGold to-rosePetal"
                      initial={{ width: 0 }}
                      animate={{ width: `${draft.progress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleResumeDraft(draft)}
                      className="flex-1 bg-fadedGold/90 hover:bg-fadedGold text-white font-heading gap-2"
                      data-testid={`resume-draft-${draft.id}`}
                    >
                      <Edit3 size={14} />
                      Resume Painting
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDraft(draft.id)}
                      disabled={deleting === draft.id}
                      className="border-warmCream-300 hover:bg-warmCream-100 text-warmCream-700 hover:text-sepiaInk"
                      data-testid={`delete-draft-${draft.id}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
