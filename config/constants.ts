/**
 * Centralized constants for WishBloom application
 * All magic numbers and commonly used strings should be defined here
 */

// ========================================
// AUDIO CONSTANTS
// ========================================
export const AUDIO_CONSTANTS = {
  BLOW_THRESHOLD: 180, // Threshold for detecting breath/blowing
  DEFAULT_VOLUME: 0.08,
  FFT_SIZE: 2048,
  SMOOTHING_TIME_CONSTANT: 0.8,
  LOW_FREQ_SLICE_END: 10, // Analyze low frequencies (0-500Hz) for breath
  AUDIO_CONTEXT_STATES: {
    RUNNING: 'running',
    SUSPENDED: 'suspended',
    CLOSED: 'closed',
  },
} as const

// ========================================
// FILE UPLOAD LIMITS
// ========================================
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB in bytes
  IMAGE_MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
  ALLOWED_IMAGE_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.webp'] as const,
  
  // Audio file limits (Phase 5)
  AUDIO_MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB in bytes
  AUDIO_MAX_SIZE_MB: 10,
  AUDIO_MAX_DURATION_SECONDS: 180, // 3 minutes max
  ALLOWED_AUDIO_TYPES: ['audio/webm', 'audio/mp4', 'audio/wav', 'audio/mpeg', 'audio/ogg'] as const,
  ALLOWED_AUDIO_EXTENSIONS: ['.webm', '.mp4', '.wav', '.mp3', '.ogg'] as const,
} as const

// ========================================
// APPLICATION METADATA
// ========================================
export const APP_CONFIG = {
  APP_NAME: 'WishBloom',
  APP_TAGLINE: 'Preserving memories, one bloom at a time',
  APP_DESCRIPTION: 'Create beautiful, interactive birthday memory books',
  DEFAULT_SENDER_NAME: 'WishBloom',
} as const

// ========================================
// VALIDATION LIMITS
// ========================================
export const VALIDATION_LIMITS = {
  // Recipient
  RECIPIENT_NAME_MIN: 1,
  RECIPIENT_NAME_MAX: 50,
  AGE_MIN: 1,
  AGE_MAX: 120,
  CREATIVE_AGE_MAX: 100,
  
  // Intro Message
  INTRO_MESSAGE_MIN: 10,
  INTRO_MESSAGE_MAX: 2000,
  
  // Memories
  MEMORIES_MIN_REQUIRED: 3,
  MEMORIES_MAX_ALLOWED: 200,
  MEMORY_TITLE_MAX: 200,
  MEMORY_DESCRIPTION_MIN: 1,
  MEMORY_DESCRIPTION_MAX: 2000,
  
  // Messages
  MESSAGES_MIN_REQUIRED: 1,
  MESSAGES_MAX_ALLOWED: 100,
  MESSAGE_CONTENT_MIN: 10,
  MESSAGE_CONTENT_MAX: 5000,
  MESSAGE_GREETING_MAX: 100,
  MESSAGE_CLOSING_MAX: 100,
  MESSAGE_SIGNATURE_MAX: 100,
  MESSAGE_TITLE_MAX: 200,
  MESSAGE_POSTSCRIPT_MAX: 500,
  
  // Contributor
  CONTRIBUTOR_NAME_MAX: 100,
  CONTRIBUTOR_EMAIL_MAX: 254, // RFC 5321
  
  // Celebration
  CELEBRATION_PHRASES_MIN: 1,
  CELEBRATION_PHRASES_MAX: 50,
  CELEBRATION_PHRASE_MAX_LENGTH: 50,
  
  // Email
  EMAIL_CUSTOM_MESSAGE_MAX: 500,
  
  // General
  URL_MAX_LENGTH: 2048,
} as const

// ========================================
// MEMORY & MESSAGE TYPES
// ========================================
export const MEMORY_TYPES = ['standard', 'featured', 'quote'] as const
export const MESSAGE_TYPES = ['letter', 'poem'] as const
export const MEMORY_TAGS = ['love', 'milestone', 'nostalgic', 'celebration', 'funny'] as const

export type MemoryType = typeof MEMORY_TYPES[number]
export type MessageType = typeof MESSAGE_TYPES[number]
export type MemoryTag = typeof MEMORY_TAGS[number]

// ========================================
// AI GENERATION (Phase 5)
// ========================================
export const AI_CONSTANTS = {
  RELATIONSHIPS: ['Mom', 'Dad', 'Bestie', 'Friend', 'Sibling', 'Partner'] as const,
  VIBES: ['Sentimental', 'Funny', 'Poetic', 'Inspirational'] as const,
  MAX_TOKENS: 200,
  TEMPERATURE: 0.8,
  MODEL: 'gemini-1.5-flash',
  GENERATION_TIMEOUT_MS: 15000, // 15 seconds
} as const

export type AIRelationship = typeof AI_CONSTANTS.RELATIONSHIPS[number]
export type AIVibe = typeof AI_CONSTANTS.VIBES[number]

// ========================================
// DEFAULT VALUES
// ========================================
export const DEFAULT_VALUES = {
  MEMORY_TYPE: 'standard' as MemoryType,
  MEMORY_ROTATION: 0,
  CONTRIBUTOR_COUNT: 1,
  VIEW_COUNT: 0,
  IS_ARCHIVED: false,
  
  // Default celebration phrases
  CELEBRATION_PHRASES: [
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
  ] as const,
} as const

// ========================================
// DATABASE CONSTANTS
// ========================================
export const DB_CONSTANTS = {
  CONNECTION_POOL_MAX: 10,
  CONNECTION_POOL_MIN: 2,
  SOCKET_TIMEOUT_MS: 45000,
  SERVER_SELECTION_TIMEOUT_MS: 10000,
  WISHBLOOM_COLLECTION: 'wishblooms',
  USER_COLLECTION: 'users',
} as const

// ========================================
// RATE LIMITING
// ========================================
export const RATE_LIMITS = {
  PUBLIC_REQUESTS_PER_MINUTE: 10,
  AUTHENTICATED_REQUESTS_PER_MINUTE: 30,
  UPLOAD_REQUESTS_PER_MINUTE: 5,
  WINDOW_DURATION_MS: 60000, // 1 minute
} as const

// ========================================
// SESSION & AUTH
// ========================================
export const AUTH_CONSTANTS = {
  SESSION_MAX_AGE_SECONDS: 30 * 24 * 60 * 60, // 30 days
  JWT_SECRET_MIN_LENGTH: 32,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_HASH_ROUNDS: 10,
} as const

// ========================================
// UI CONSTANTS
// ========================================
export const UI_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  TOAST_LIMIT: 1,
  TOAST_REMOVE_DELAY: 1000000,
  DEBOUNCE_DELAY_MS: 500,
  ANIMATION_DURATION_SHORT: 300,
  ANIMATION_DURATION_MEDIUM: 600,
  ANIMATION_DURATION_LONG: 1200,
} as const

// ========================================
// CLOUDINARY
// ========================================
export const CLOUDINARY_CONFIG = {
  FOLDER: 'wishbloom',
  TRANSFORMATION: {
    width: 1200,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
  } as const,
} as const

// ========================================
// REGEX PATTERNS
// ========================================
export const PATTERNS = {
  DATE_FORMAT: /^\d{4}-\d{2}-\d{2}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
} as const

// ========================================
// ERROR MESSAGES
// ========================================
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_URL: 'Invalid URL',
  INVALID_DATE: 'Invalid date format (YYYY-MM-DD)',
  FILE_TOO_LARGE: `File must be less than ${FILE_LIMITS.IMAGE_MAX_SIZE_MB}MB`,
  INVALID_FILE_TYPE: 'Only JPEG, PNG, and WebP images are allowed',
  AUDIO_FILE_TOO_LARGE: `Audio file must be less than ${FILE_LIMITS.AUDIO_MAX_SIZE_MB}MB`,
  INVALID_AUDIO_TYPE: 'Only WebM, MP4, WAV, MP3, and OGG audio files are allowed',
  AUDIO_TOO_LONG: `Audio recording must be less than ${FILE_LIMITS.AUDIO_MAX_DURATION_SECONDS} seconds`,
  MIN_MEMORIES: `At least ${VALIDATION_LIMITS.MEMORIES_MIN_REQUIRED} memories required`,
  MIN_MESSAGES: `At least ${VALIDATION_LIMITS.MESSAGES_MIN_REQUIRED} message required`,
  UNAUTHORIZED: 'Unauthorized',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  VALIDATION_FAILED: 'Validation failed',
  NOT_FOUND: 'Not found',
  AI_GENERATION_FAILED: 'Failed to generate AI message',
  MICROPHONE_PERMISSION_DENIED: 'Microphone permission denied',
  MICROPHONE_NOT_SUPPORTED: 'Audio recording is not supported in this browser',
} as const