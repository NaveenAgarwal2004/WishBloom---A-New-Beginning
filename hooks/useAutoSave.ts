/**
 * 🌸 WishBloom Auto-Save Hook
 * PWA & Reliability - Phase 4 Enhancement
 * 
 * Provides hybrid auto-save functionality with visual indicator
 * - Monitors Zustand store changes
 * - Saves to localStorage (anonymous users)
 * - Syncs to MongoDB (authenticated users)
 * - Detects existing drafts on mount
 * - Offers draft restoration via toast
 */

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import useWishBloomStore from '@/store/useWishBloomStore'
import { useToast } from '@/hooks/use-toast'
import { useShallow } from 'zustand/shallow'
import type { IMemory, IMessage } from '@/models/WishBloom'

interface UseAutoSaveReturn {
  isAutoSaving: boolean
  lastSaved: Date | null
  hasDraft: boolean
  restoreDraft: () => void
  clearDraft: () => void
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
}

// Draft data interface with proper types
interface DraftCreatedBy {
  id?: string
  name: string
  email: string
  contributionCount?: number
}

interface DraftData {
  recipientName: string
  age: number | null
  creativeAgeDescription: string
  introMessage: string
  createdBy: DraftCreatedBy
  memories: IMemory[]
  messages: IMessage[]
  celebrationWishPhrases: string[]
}

const DRAFT_KEY = 'wishbloom-draft'
const AUTO_SAVE_DEBOUNCE = 2000 // 2 seconds

export function useAutoSave(): UseAutoSaveReturn {
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [draftOffered, setDraftOffered] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  
  const { toast } = useToast()
  const { data: session } = useSession()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  
  const store = useWishBloomStore()
  
  const storeState = useWishBloomStore(
    useShallow((state) => ({
      recipientName: state.recipientName,
      age: state.age,
      creativeAgeDescription: state.creativeAgeDescription,
      introMessage: state.introMessage,
      createdBy: state.createdBy,
      memories: state.memories,
      messages: state.messages,
      celebrationWishPhrases: state.celebrationWishPhrases,
      currentStep: state.currentStep,
    }))
  )

  // Define restoreDraft first so it can be referenced
  const restoreDraft = () => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY)
      if (!stored) return

      const draft = JSON.parse(stored) as { timestamp: string; data: DraftData }
      
      // Restore each field individually
      store.setRecipientName(draft.data.recipientName || '')
      store.setAge(draft.data.age || null)
      store.setCreativeAgeDescription(draft.data.creativeAgeDescription || '')
      store.setIntroMessage(draft.data.introMessage || '')
      store.setCreatedBy(draft.data.createdBy || { id: '', name: '', email: '', contributionCount: 1 })
      
      // Restore arrays with proper typing
      if (draft.data.memories && Array.isArray(draft.data.memories)) {
        draft.data.memories.forEach((memory: IMemory) => store.addMemory(memory))
      }
      if (draft.data.messages && Array.isArray(draft.data.messages)) {
        draft.data.messages.forEach((message: IMessage) => store.addMessage(message))
      }
      
      if (draft.data.celebrationWishPhrases) {
        store.setCelebrationWishPhrases(draft.data.celebrationWishPhrases)
      }

      setHasDraft(false)
      
      toast({
        title: '✨ Draft Restored',
        description: 'Your previous work has been loaded.',
      })
    } catch (error) {
      console.error('Error restoring draft:', error)
      toast({
        title: 'Error',
        description: 'Could not restore draft. Please start fresh.',
      })
    }
  }

  // Check for existing draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkForDraft = () => {
      try {
        const stored = localStorage.getItem(DRAFT_KEY)
        if (!stored) return

        const draft = JSON.parse(stored) as { timestamp: string; data: DraftData }
        const draftDate = new Date(draft.timestamp)
        const now = new Date()
        const hoursSinceDraft = (now.getTime() - draftDate.getTime()) / (1000 * 60 * 60)

        // Only offer draft if it's less than 7 days old and has content
        if (hoursSinceDraft < 168 && draft.data.recipientName) {
          setHasDraft(true)
          
          // Only show toast once per session
          if (!draftOffered) {
            setDraftOffered(true)
            
            toast({
              title: '🌸 Draft Found',
              description: 'Would you like to continue where you left off? You can restore your draft from the create page.',
            })
          }
        } else {
          // Clear old draft
          localStorage.removeItem(DRAFT_KEY)
        }
      } catch (error) {
        console.error('Error checking for draft:', error)
      }
    }

    checkForDraft()
  }, [draftOffered, toast])

  // Auto-save on state change (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (!storeState.recipientName && storeState.memories.length === 0) {
      return
    }

    requestAnimationFrame(() => {
      setIsAutoSaving(true)
    })

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const draft = {
          timestamp: new Date().toISOString(),
          data: storeState,
        }

        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))

        if (session?.user) {
          setSyncStatus('syncing')
          
          const totalSteps = 6
          const completedItems = [
            storeState.recipientName ? 1 : 0,
            storeState.introMessage?.length >= 10 ? 1 : 0,
            storeState.memories.length >= 3 ? 1 : 0,
            storeState.messages.length >= 1 ? 1 : 0,
          ].reduce((a, b) => a + b, 0)
          const progress = Math.round((completedItems / totalSteps) * 100)

          const response = await fetch('/api/drafts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              step: storeState.currentStep,
              progress,
              payload: storeState,
            }),
          })

          if (response.ok) {
            setSyncStatus('synced')
            setTimeout(() => setSyncStatus('idle'), 2000)
          } else {
            setSyncStatus('error')
            console.warn('Backend draft save failed, localStorage backup active')
          }
        }

        setLastSaved(new Date())
        setIsAutoSaving(false)
      } catch (error) {
        console.error('Error auto-saving draft:', error)
        setSyncStatus('error')
        setIsAutoSaving(false)
      }
    }, AUTO_SAVE_DEBOUNCE)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [storeState, session])

  const clearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY)
      setHasDraft(false)
    } catch (error) {
      console.error('Error clearing draft:', error)
    }
  }

  return {
    isAutoSaving,
    lastSaved,
    hasDraft,
    restoreDraft,
    clearDraft,
    syncStatus,
  }
}
