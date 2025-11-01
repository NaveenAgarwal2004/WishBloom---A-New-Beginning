import { describe, it, expect } from '@jest/globals'
import {
  ContributorSchema,
  MemorySchema,
  CreateWishBloomSchema,
} from '@/schemas/wishbloom.schema'

describe('WishBloom Schemas', () => {
  describe('ContributorSchema', () => {
    it('should validate a valid contributor', () => {
      const validContributor = {
        id: 'user-001',
        name: 'John Doe',
        email: 'john@example.com',
        contributionCount: 3,
      }

      const result = ContributorSchema.safeParse(validContributor)
      expect(result.success).toBe(true)
    })

    it('should reject contributor with invalid email', () => {
      const invalidContributor = {
        name: 'John Doe',
        email: 'not-an-email',
      }

      const result = ContributorSchema.safeParse(invalidContributor)
      expect(result.success).toBe(false)
    })

    it('should accept contributor without email', () => {
      const contributor = {
        name: 'John Doe',
      }

      const result = ContributorSchema.safeParse(contributor)
      expect(result.success).toBe(true)
    })
  })

  describe('MemorySchema', () => {
    it('should validate a valid memory', () => {
      const validMemory = {
        title: 'A wonderful day',
        description: 'We had so much fun together.',
        date: '2023-06-15',
        contributor: {
          name: 'Jane Smith',
        },
        type: 'standard' as const,
      }

      const result = MemorySchema.safeParse(validMemory)
      expect(result.success).toBe(true)
    })

    it('should reject memory with invalid date format', () => {
      const invalidMemory = {
        title: 'Test',
        description: 'Test description',
        date: '06/15/2023', // Wrong format
        contributor: { name: 'John' },
      }

      const result = MemorySchema.safeParse(invalidMemory)
      expect(result.success).toBe(false)
    })

    it('should reject memory with description too short', () => {
      const invalidMemory = {
        title: 'Test',
        description: '',
        date: '2023-06-15',
        contributor: { name: 'John' },
      }

      const result = MemorySchema.safeParse(invalidMemory)
      expect(result.success).toBe(false)
    })
  })

  describe('CreateWishBloomSchema', () => {
    it('should validate a complete WishBloom', () => {
      const validWishBloom = {
        recipientName: 'Emma',
        age: 25,
        creativeAgeDescription: 'Twenty-Five Rotations',
        introMessage: 'Dear Emma, this is your special day...',
        createdBy: {
          name: 'Sarah',
          email: 'sarah@example.com',
        },
        memories: [
          {
            title: 'Memory 1',
            description: 'First memory description',
            date: '2023-01-01',
            contributor: { name: 'John' },
          },
          {
            title: 'Memory 2',
            description: 'Second memory description',
            date: '2023-02-01',
            contributor: { name: 'Jane' },
          },
          {
            title: 'Memory 3',
            description: 'Third memory description',
            date: '2023-03-01',
            contributor: { name: 'Bob' },
          },
        ],
        messages: [
          {
            type: 'letter' as const,
            content: 'Happy birthday, Emma! You are amazing.',
            signature: 'Sarah',
            date: '2024-01-01',
            contributor: { name: 'Sarah' },
          },
        ],
      }

      const result = CreateWishBloomSchema.safeParse(validWishBloom)
      if (!result.success) {
        console.log(result.error.flatten())
      }
      expect(result.success).toBe(true)
    })

    it('should reject WishBloom with less than 3 memories', () => {
      const invalidWishBloom = {
        recipientName: 'Emma',
        introMessage: 'Test intro message here',
        createdBy: { name: 'Sarah' },
        memories: [
          {
            title: 'Memory 1',
            description: 'Only one memory',
            date: '2023-01-01',
            contributor: { name: 'John' },
          },
        ],
        messages: [
          {
            type: 'letter' as const,
            content: 'Happy birthday!',
            signature: 'Sarah',
            date: '2024-01-01',
            contributor: { name: 'Sarah' },
          },
        ],
      }

      const result = CreateWishBloomSchema.safeParse(invalidWishBloom)
      expect(result.success).toBe(false)
    })

    it('should reject WishBloom with no messages', () => {
      const invalidWishBloom = {
        recipientName: 'Emma',
        introMessage: 'Test intro message here',
        createdBy: { name: 'Sarah' },
        memories: [
          { title: 'M1', description: 'Desc1', date: '2023-01-01', contributor: { name: 'J' } },
          { title: 'M2', description: 'Desc2', date: '2023-02-01', contributor: { name: 'J' } },
          { title: 'M3', description: 'Desc3', date: '2023-03-01', contributor: { name: 'J' } },
        ],
        messages: [],
      }

      const result = CreateWishBloomSchema.safeParse(invalidWishBloom)
      expect(result.success).toBe(false)
    })
  })
})