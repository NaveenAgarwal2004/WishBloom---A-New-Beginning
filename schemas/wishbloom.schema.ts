import { z } from 'zod'
import {
  VALIDATION_LIMITS,
  FILE_LIMITS,
  MEMORY_TYPES,
  MESSAGE_TYPES,
  MEMORY_TAGS,
  ERROR_MESSAGES,
  PATTERNS,
  DEFAULT_VALUES,
} from '@/config/constants'

//  Contributor Schema with required name
export const ContributorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Contributor name is required'), // REQUIRED
  email: z.string().email(ERROR_MESSAGES.INVALID_EMAIL).or(z.literal('')).optional(),
  contributionCount: z.number().int().min(1).default(1), // REQUIRED with default
})

//  Memory Schema with required type field
export const MemorySchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(VALIDATION_LIMITS.MEMORY_DESCRIPTION_MIN, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_LIMITS.MEMORY_TITLE_MAX),
  description: z
    .string()
    .min(VALIDATION_LIMITS.MEMORY_DESCRIPTION_MIN, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_LIMITS.MEMORY_DESCRIPTION_MAX),
  date: z.string().regex(PATTERNS.DATE_FORMAT, ERROR_MESSAGES.INVALID_DATE),
  type: z.enum(MEMORY_TYPES).default(DEFAULT_VALUES.MEMORY_TYPE), // ✅ REQUIRED field with default
  contributor: ContributorSchema, // Uses schema with required name
  imageUrl: z.string().url(ERROR_MESSAGES.INVALID_URL).optional(),
  tags: z.array(z.enum(MEMORY_TAGS)).default([]),
  rotation: z.number().min(-10).max(10).default(DEFAULT_VALUES.MEMORY_ROTATION),
  createdAt: z.string().datetime().optional(),
})

//  Message Schema with required signature and date
export const MessageSchema = z.object({
  id: z.string().optional(),
  type: z.enum(MESSAGE_TYPES),
  date: z.string().regex(PATTERNS.DATE_FORMAT, ERROR_MESSAGES.INVALID_DATE), // ✅ REQUIRED
  greeting: z.string().max(VALIDATION_LIMITS.MESSAGE_GREETING_MAX).optional(),
  content: z
    .string()
    .min(VALIDATION_LIMITS.MESSAGE_CONTENT_MIN, `Content must be at least ${VALIDATION_LIMITS.MESSAGE_CONTENT_MIN} characters`)
    .max(VALIDATION_LIMITS.MESSAGE_CONTENT_MAX),
  closing: z.string().max(VALIDATION_LIMITS.MESSAGE_CLOSING_MAX).optional(),
  signature: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD) // REQUIRED
    .max(VALIDATION_LIMITS.MESSAGE_SIGNATURE_MAX),
  title: z.string().max(VALIDATION_LIMITS.MESSAGE_TITLE_MAX).optional(),
  postscript: z.string().max(VALIDATION_LIMITS.MESSAGE_POSTSCRIPT_MAX).optional(),
  contributor: ContributorSchema, // Uses schema with required name
  createdAt: z.string().datetime().optional(),
})

// Main WishBloom Creation Schema
export const CreateWishBloomSchema = z.object({
  recipientName: z
    .string()
    .min(VALIDATION_LIMITS.RECIPIENT_NAME_MIN, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_LIMITS.RECIPIENT_NAME_MAX),
  age: z
    .number()
    .int()
    .min(VALIDATION_LIMITS.AGE_MIN)
    .max(VALIDATION_LIMITS.AGE_MAX)
    .optional(),
  creativeAgeDescription: z.string().max(VALIDATION_LIMITS.CREATIVE_AGE_MAX).optional(),
  introMessage: z
    .string()
    .min(
      VALIDATION_LIMITS.INTRO_MESSAGE_MIN,
      `Intro message must be at least ${VALIDATION_LIMITS.INTRO_MESSAGE_MIN} characters`
    )
    .max(VALIDATION_LIMITS.INTRO_MESSAGE_MAX),
  createdBy: ContributorSchema,
  memories: z
    .array(MemorySchema)
    .min(VALIDATION_LIMITS.MEMORIES_MIN_REQUIRED, ERROR_MESSAGES.MIN_MEMORIES)
    .max(VALIDATION_LIMITS.MEMORIES_MAX_ALLOWED),
  messages: z
    .array(MessageSchema)
    .min(VALIDATION_LIMITS.MESSAGES_MIN_REQUIRED, ERROR_MESSAGES.MIN_MESSAGES)
    .max(VALIDATION_LIMITS.MESSAGES_MAX_ALLOWED),
  celebrationWishPhrases: z
    .array(z.string().max(VALIDATION_LIMITS.CELEBRATION_PHRASE_MAX_LENGTH))
    .min(VALIDATION_LIMITS.CELEBRATION_PHRASES_MIN)
    .max(VALIDATION_LIMITS.CELEBRATION_PHRASES_MAX)
    .optional(),
})

// Update Schema (partial for PATCH requests)
export const UpdateWishBloomSchema = CreateWishBloomSchema.partial()

// Email Schema
export const SendEmailSchema = z.object({
  recipientEmail: z.string().email(ERROR_MESSAGES.INVALID_EMAIL),
  recipientName: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_LIMITS.CONTRIBUTOR_NAME_MAX),
  wishbloomUrl: z.string().url(ERROR_MESSAGES.INVALID_URL),
  senderName: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(VALIDATION_LIMITS.CONTRIBUTOR_NAME_MAX),
  customMessage: z.string().max(VALIDATION_LIMITS.EMAIL_CUSTOM_MESSAGE_MAX).optional(),
})

// Image Upload Schema
export const ImageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= FILE_LIMITS.IMAGE_MAX_SIZE_BYTES,
      ERROR_MESSAGES.FILE_TOO_LARGE
    )
    .refine(
      (file) => (FILE_LIMITS.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
      ERROR_MESSAGES.INVALID_FILE_TYPE
    ),
})

// Type exports
export type Contributor = z.infer<typeof ContributorSchema>
export type Memory = z.infer<typeof MemorySchema>
export type Message = z.infer<typeof MessageSchema>
export type CreateWishBloomInput = z.infer<typeof CreateWishBloomSchema>
export type UpdateWishBloomInput = z.infer<typeof UpdateWishBloomSchema>
export type SendEmailInput = z.infer<typeof SendEmailSchema>