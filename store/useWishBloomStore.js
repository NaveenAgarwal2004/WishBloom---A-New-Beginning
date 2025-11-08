import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

const useWishBloomStore = create(
  persist(
    (set, get) => ({
      // Form state
      currentStep: 1,
      recipientName: '',
      age: null,
      creativeAgeDescription: '',
      introMessage: '',
      createdBy: { id: '', name: '', email: '' },
      memories: [],
      messages: [],
      celebrationWishPhrases: [
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
      ],

      // ✅ NEW: Validation state tracking
      validationState: {
        isValidating: false,
        step1Valid: false,
        step2Valid: false,
        step3Valid: false,
        step4Valid: true, // Wishes are optional
      },

      // ✅ NEW: Validation helper
      validateStep1: () => {
        const state = get()
        const isValid = Boolean(
          state.recipientName.trim().length > 0 &&
          state.introMessage.trim().length >= 10
        )
        set({ 
          validationState: { 
            ...state.validationState, 
            step1Valid: isValid,
            isValidating: false 
          } 
        })
        return isValid
      },

      validateStep2: () => {
        const state = get()
        const isValid = state.memories.length >= 3
        set({ 
          validationState: { 
            ...state.validationState, 
            step2Valid: isValid,
            isValidating: false 
          } 
        })
        return isValid
      },

      validateStep3: () => {
        const state = get()
        const isValid = state.messages.length >= 1
        set({ 
          validationState: { 
            ...state.validationState, 
            step3Valid: isValid,
            isValidating: false 
          } 
        })
        return isValid
      },

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
      previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      setRecipientName: (name) => {
        set({ 
          recipientName: name,
          validationState: { ...get().validationState, isValidating: true }
        })
        // Trigger validation after state update
        setTimeout(() => get().validateStep1(), 0)
      },

      setAge: (age) => set({ age }),
      setCreativeAgeDescription: (desc) => set({ creativeAgeDescription: desc }),
      
      setIntroMessage: (msg) => {
        set({ 
          introMessage: msg,
          validationState: { ...get().validationState, isValidating: true }
        })
        // Trigger validation after state update
        setTimeout(() => get().validateStep1(), 0)
      },

      setCreatedBy: (creator) => set({ createdBy: { ...creator, id: creator.id || nanoid(8) } }),

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
        createdBy: { id: '', name: '', email: '' },
        memories: [],
        messages: [],
        celebrationWishPhrases: [
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
        ],
        validationState: {
          isValidating: false,
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
        // Don't save validation state or currentStep
      }),
    }
  )
)

export default useWishBloomStore