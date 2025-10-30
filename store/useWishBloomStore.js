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

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 6) })),
      previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      setRecipientName: (name) => set({ recipientName: name }),
      setAge: (age) => set({ age }),
      setCreativeAgeDescription: (desc) => set({ creativeAgeDescription: desc }),
      setIntroMessage: (msg) => set({ introMessage: msg }),
      setCreatedBy: (creator) => set({ createdBy: { ...creator, id: creator.id || nanoid(8) } }),

      // Memory actions
      addMemory: (memory) => set((state) => ({
        memories: [...state.memories, { ...memory, id: memory.id || nanoid(8) }]
      })),
      updateMemory: (id, updates) => set((state) => ({
        memories: state.memories.map(mem => mem.id === id ? { ...mem, ...updates } : mem)
      })),
      deleteMemory: (id) => set((state) => ({
        memories: state.memories.filter(mem => mem.id !== id)
      })),

      // Message actions
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, { ...message, id: message.id || nanoid(8) }]
      })),
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
      })),
      deleteMessage: (id) => set((state) => ({
        messages: state.messages.filter(msg => msg.id !== id)
      })),

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
        // Don't save currentStep to localStorage
      }),
    }
  )
)

export default useWishBloomStore
