import { z } from 'zod'

// Contributor Schema
export const ContributorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email').optional(), // ✅ Just .optional()
  contributionCount: z.number().int().min(0).default(1),
})

// Memory Schema
export const MemorySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  contributor: ContributorSchema,
  imageUrl: z.string().url('Invalid image URL').optional(), // ✅ Just .optional()
  type: z.enum(['standard', 'featured', 'quote']).default('standard'),
  tags: z.array(z.enum(['love', 'milestone', 'nostalgic', 'celebration', 'funny'])).default([]),
  rotation: z.number().min(-10).max(10).default(0),
  createdAt: z.string().datetime().optional(),
})

// Message Schema
export const MessageSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['letter', 'poem']),
  greeting: z.string().max(100).optional(), // ✅ Just .optional()
  content: z.string().min(10, 'Content must be at least 10 characters').max(5000),
  closing: z.string().max(100).optional(), // ✅ Just .optional()
  signature: z.string().min(1, 'Signature is required').max(100),
  title: z.string().max(200).optional(), // ✅ Just .optional()
  postscript: z.string().max(500).optional(), // ✅ Just .optional()
  contributor: ContributorSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  createdAt: z.string().datetime().optional(),
})

// Main WishBloom Creation Schema
export const CreateWishBloomSchema = z.object({
  recipientName: z.string().min(1, 'Recipient name is required').max(50),
  age: z.number().int().min(1).max(120).optional(), // ✅ Just .optional() (not .nullable())
  creativeAgeDescription: z.string().max(100).optional(), // ✅ Just .optional()
  introMessage: z.string().min(10, 'Intro message must be at least 10 characters').max(2000),
  createdBy: ContributorSchema,
  memories: z.array(MemorySchema).min(3, 'At least 3 memories required').max(200),
  messages: z.array(MessageSchema).min(1, 'At least 1 message required').max(100),
  celebrationWishPhrases: z.array(z.string().max(50)).min(1).max(50).optional(),
})

// Update Schema (partial for PATCH requests)
export const UpdateWishBloomSchema = CreateWishBloomSchema.partial()

// Email Schema
export const SendEmailSchema = z.object({
  recipientEmail: z.string().email('Invalid recipient email'),
  recipientName: z.string().min(1, 'Recipient name is required').max(100),
  wishbloomUrl: z.string().url('Invalid WishBloom URL'),
  senderName: z.string().min(1, 'Sender name is required').max(100),
  customMessage: z.string().max(500).optional(), // ✅ Just .optional()
})

// Image Upload Schema
export const ImageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    ),
})

// Type exports
export type Contributor = z.infer<typeof ContributorSchema>
export type Memory = z.infer<typeof MemorySchema>
export type Message = z.infer<typeof MessageSchema>
export type CreateWishBloomInput = z.infer<typeof CreateWishBloomSchema>
export type UpdateWishBloomInput = z.infer<typeof UpdateWishBloomSchema>
export type SendEmailInput = z.infer<typeof SendEmailSchema>