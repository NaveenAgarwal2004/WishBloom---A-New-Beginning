import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { IContributor, IMemory, IMessage } from '@/models/WishBloom'

interface ValidationState {
  step1Valid: boolean
  step2Valid: boolean
  step3Valid: boolean
  step4Valid: boolean
}

interface WishBloomStore {
  // Form state
  currentStep: number
  recipientName: string
  age: number | null
  creativeAgeDescription: string
  introMessage: string
  createdBy: IContributor
  memories: IMemory[]
  messages: IMessage[]
  celebrationWishPhrases: string[]
  
  // Validation state
  validationState: ValidationState
  
  // Validation methods
  validateStep1: () => boolean
  validateStep2: () => boolean
  validateStep3: () => boolean
  
  // Navigation actions
  setCurrentStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  
  // Form actions
  setRecipientName: (name: string) => void
  setAge: (age: number | null) => void
  setCreativeAgeDescription: (desc: string) => void
  setIntroMessage: (msg: string) => void
  setCreatedBy: (creator: Partial<IContributor>) => void
  
  // Memory actions
  addMemory: (memory: IMemory) => void
  updateMemory: (id: string, updates: Partial<IMemory>) => void
  deleteMemory: (id: string) => void
  
  // Message actions
  addMessage: (message: IMessage) => void
  updateMessage: (id: string, updates: Partial<IMessage>) => void
  deleteMessage: (id: string) => void
  
  // Celebration phrases actions
  setCelebrationWishPhrases: (phrases: string[]) => void
  addWishPhrase: (phrase: string) => void
  removeWishPhrase: (index: number) => void
  updateWishPhrase: (index: number, phrase: string) => void
  
  // Reset
  resetStore: () => void
}

const defaultPhrases = [
  'Endless joy! ✨',
  'So proud of you',
  'Best year yet! 🎉',
  'You are amazing 💛',
  'Keep shining bright',
  'Here is to you!',
  'Another beautiful chapter',
  'You deserve the world',
  'Grateful for you',
  'The best is yet to come',
  'Forever your friend',
  'Cheers! 🥂',
]

const useWishBloomStore = create<WishBloomStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      recipientName: '',
      age: null,
      creativeAgeDescription: '',
      introMessage: '',
      createdBy: { id: '', name: '', email: '', contributionCount: 1 },
      memories: [],
      messages: [],
      celebrationWishPhrases: [...defaultPhrases],
      
      validationState: {
        step1Valid: false,
        step2Valid: false,
        step3Valid: false,
        step4Valid: true,
      },
      
      // Validation methods
      validateStep1: () => {
        const state = get()
        const isValid = Boolean(
          state.recipientName.trim().length > 0 &&
          state.introMessage.trim().length >= 10
        )
        
        if (state.validationState.step1Valid !== isValid) {
          set({ 
            validationState: { 
              ...state.validationState, 
              step1Valid: isValid
            } 
          })
        }
        
        return isValid
      },
      
      validateStep2: () => {
        const state = get()
        const isValid = state.memories.length >= 3
        
        if (state.validationState.step2Valid !== isValid) {
          set({ 
            validationState: { 
              ...state.validationState, 
              step2Valid: isValid
            } 
          })
        }
        
        return isValid
      },
      
      validateStep3: () => {
        const state = get()
        const isValid = state.messages.length >= 1
        
        if (state.validationState.step3Valid !== isValid) {
          set({ 
            validationState: { 
              ...state.validationState, 
              step3Valid: isValid
            } 
          })
        }
        
        return isValid
      },
      
      // Navigation actions
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
      previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      
      // Form actions
      setRecipientName: (name) => set({ recipientName: name }),
      setAge: (age) => set({ age }),
      setCreativeAgeDescription: (desc) => set({ creativeAgeDescription: desc }),
      setIntroMessage: (msg) => set({ introMessage: msg }),
      setCreatedBy: (creator) => set({ 
        createdBy: { 
          ...creator, 
          id: creator.id || nanoid(8),
          name: creator.name || '',
          contributionCount: creator.contributionCount || 1
        } as IContributor
      }),
      
      // Memory actions
      addMemory: (memory) => {
        set((state) => ({
          memories: [...state.memories, { ...memory, id: memory.id || nanoid(8) }]
        }))
        setTimeout(() => get().validateStep2(), 0)
      },
      
      updateMemory: (id, updates) => set((state) => ({
        memories: state.memories.map(mem => mem.id === id ? { ...mem, ...updates } : mem)
      })),
      
      deleteMemory: (id) => {
        set((state) => ({
          memories: state.memories.filter(mem => mem.id !== id)
        }))
        setTimeout(() => get().validateStep2(), 0)
      },
      
      // Message actions
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, { ...message, id: message.id || nanoid(8) }]
        }))
        setTimeout(() => get().validateStep3(), 0)
      },
      
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
      })),
      
      deleteMessage: (id) => {
        set((state) => ({
          messages: state.messages.filter(msg => msg.id !== id)
        }))
        setTimeout(() => get().validateStep3(), 0)
      },
      
      // Celebration phrases actions
      setCelebrationWishPhrases: (phrases) => set({ celebrationWishPhrases: phrases }),
      addWishPhrase: (phrase) => set((state) => ({
        celebrationWishPhrases: [...state.celebrationWishPhrases, phrase]
      })),
      removeWishPhrase: (index) => set((state) => ({
        celebrationWishPhrases: state.celebrationWishPhrases.filter((_, i) => i !== index)
      })),
      updateWishPhrase: (index, phrase) => set((state) => ({
        celebrationWishPhrases: state.celebrationWishPhrases.map((p, i) => i === index ? phrase : p)
      })),
      
      // Reset
      resetStore: () => set({
        currentStep: 1,
        recipientName: '',
        age: null,
        creativeAgeDescription: '',
        introMessage: '',
        createdBy: { id: '', name: '', email: '', contributionCount: 1 },
        memories: [],
        messages: [],
        celebrationWishPhrases: [...defaultPhrases],
        validationState: {
          step1Valid: false,
          step2Valid: false,
          step3Valid: false,
          step4Valid: true,
        },
      }),
    }),
    {
      name: 'wishbloom-storage',
      partialize: (state) => ({
        recipientName: state.recipientName,
        age: state.age,
        creativeAgeDescription: state.creativeAgeDescription,
        introMessage: state.introMessage,
        createdBy: state.createdBy,
        memories: state.memories,
        messages: state.messages,
        celebrationWishPhrases: state.celebrationWishPhrases,
      }),
    }
  )
)

export default useWishBloomStore