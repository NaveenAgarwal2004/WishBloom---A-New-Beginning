/**
 * 🌸 WishBloom Auto-Save Hook
 * PWA & Reliability
 * 
 * Provides silent auto-save functionality with visual indicator
 * - Monitors Zustand store changes
 * - Saves to localStorage automatically (already handled by persist middleware)
 * - Detects existing drafts on mount
 * - Offers draft restoration via toast
 */

import { useEffect, useState, useRef } from 'react'
import useWishBloomStore from '@/store/useWishBloomStore'
import { useToast } from '@/hooks/use-toast'
import { useShallow } from 'zustand/shallow'

interface UseAutoSaveReturn {
  isAutoSaving: boolean
  lastSaved: Date | null
  hasDraft: boolean
  restoreDraft: () => void
  clearDraft: () => void
}

const DRAFT_KEY = 'wishbloom-draft'
const AUTO_SAVE_DEBOUNCE = 2000 // 2 seconds

export function useAutoSave(): UseAutoSaveReturn {
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [draftOffered, setDraftOffered] = useState(false)
  
  const { toast } = useToast()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Get store state with shallow comparison to prevent infinite re-renders
  const store = useWishBloomStore()
  
  // ✅ FIX: Use useShallow hook to cache the selector result
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
    }))
  )

  // Define restoreDraft first so it can be referenced
  const restoreDraft = () => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY)
      if (!stored) return

      const draft = JSON.parse(stored)
      
      // Restore each field individually
      store.setRecipientName(draft.data.recipientName || '')
      store.setAge(draft.data.age || null)
      store.setCreativeAgeDescription(draft.data.creativeAgeDescription || '')
      store.setIntroMessage(draft.data.introMessage || '')
      store.setCreatedBy(draft.data.createdBy || { id: '', name: '', email: '', contributionCount: 1 })
      
      // Restore arrays
      draft.data.memories?.forEach((memory: any) => store.addMemory(memory))
      draft.data.messages?.forEach((message: any) => store.addMessage(message))
      
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

        const draft = JSON.parse(stored)
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
  // Use requestAnimationFrame to schedule setState outside of render cycle
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Skip saving if no content
    if (!storeState.recipientName && storeState.memories.length === 0) {
      return
    }

    // Schedule state update for next frame to avoid cascading renders
    requestAnimationFrame(() => {
      setIsAutoSaving(true)
    })

    // Debounced save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const draft = {
          timestamp: new Date().toISOString(),
          data: storeState,
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        setLastSaved(new Date())
        setIsAutoSaving(false)
      } catch (error) {
        console.error('Error auto-saving draft:', error)
        setIsAutoSaving(false)
      }
    }, AUTO_SAVE_DEBOUNCE)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [storeState])

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
  }
}
