import { z } from 'zod'
import { ERROR_MESSAGES } from '@/config/constants'

// Phase 4.2: Guestbook color options matching WishBloom theme
export const GUESTBOOK_COLORS = ['rosePetal', 'sunsetAmber', 'driedSage', 'lavenderPress'] as const

export type GuestbookColor = typeof GUESTBOOK_COLORS[number]

// Guestbook validation limits
export const GUESTBOOK_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 50,
  MESSAGE_MIN: 1,
  MESSAGE_MAX: 300,
  MAX_ENTRIES_PER_WISHBLOOM: 200,
} as const

// Guestbook Entry Schema
export const GuestbookEntrySchema = z.object({
  name: z
    .string()
    .min(GUESTBOOK_LIMITS.NAME_MIN, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(GUESTBOOK_LIMITS.NAME_MAX, `Name must be less than ${GUESTBOOK_LIMITS.NAME_MAX} characters`),
  message: z
    .string()
    .min(GUESTBOOK_LIMITS.MESSAGE_MIN, ERROR_MESSAGES.REQUIRED_FIELD)
    .max(GUESTBOOK_LIMITS.MESSAGE_MAX, `Message must be less than ${GUESTBOOK_LIMITS.MESSAGE_MAX} characters`),
  color: z.enum(GUESTBOOK_COLORS, {
    errorMap: () => ({ message: 'Please select a valid color' }),
  }),
  wishbloomId: z.string().min(1, 'WishBloom ID is required'),
})

export type GuestbookEntryInput = z.infer<typeof GuestbookEntrySchema>