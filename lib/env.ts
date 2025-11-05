import { z } from 'zod'

const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  DB_NAME: z.string().min(1).default('wishbloom'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  // Email (Brevo)
  BREVO_API_KEY: z.string().min(1, 'BREVO_API_KEY is required'),
  BREVO_SENDER_EMAIL: z.string().email('BREVO_SENDER_EMAIL must be a valid email'),
  BREVO_SENDER_NAME: z.string().min(1).default('WishBloom'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  
  // Google OAuth (optional - empty string allowed)
  GOOGLE_CLIENT_ID: z.string().optional().or(z.literal('')),
  GOOGLE_CLIENT_SECRET: z.string().optional().or(z.literal('')),

  // Rate Limiting (optional - empty string allowed)
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal('')),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().or(z.literal('')),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // App
  NEXT_PUBLIC_BASE_URL: z.string().url('NEXT_PUBLIC_BASE_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables
function validateEnv(): Env {
  try {
    const parsed = envSchema.safeParse(process.env)

    if (!parsed.success) {
      console.error('❌ Invalid environment variables:')
      console.error(JSON.stringify(parsed.error.format(), null, 2))
      
      // In development, show helpful error message
      if (process.env.NODE_ENV === 'development') {
        console.error('\n📋 Required environment variables:')
        console.error('- MONGODB_URI')
        console.error('- CLOUDINARY_CLOUD_NAME')
        console.error('- CLOUDINARY_API_KEY')
        console.error('- CLOUDINARY_API_SECRET')
        console.error('- BREVO_API_KEY')
        console.error('- BREVO_SENDER_EMAIL')
        console.error('- NEXTAUTH_SECRET (must be 32+ characters)')
        console.error('- NEXTAUTH_URL')
        console.error('- NEXT_PUBLIC_BASE_URL')
        console.error('\n💡 Copy .env.example to .env.local and fill in your values')
      }
      
      throw new Error('Invalid environment variables')
    }

    return parsed.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Environment validation failed: ${error.message}`)
    }
    throw error
  }
}

// Server-side environment (always validate fully)
function getServerEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv()
  }
  return cachedEnv
}

// Client-side environment (only public variables)
function getClientEnv(): Env {
  return {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
  } as Env
}

let cachedEnv: Env | null = null

// Main getter - checks if running in Node.js or browser
export function getEnv(): Env {
  // Check if we're in Node.js environment (has 'process.versions.node')
  const isNode = typeof process !== 'undefined' && 
                 process.versions != null && 
                 process.versions.node != null
  
  if (isNode) {
    return getServerEnv()
  } else {
    return getClientEnv()
  }
}

export const env = getEnv()

// Helper to check if we're in production
export const isProd = env.NODE_ENV === 'production'
export const isDev = env.NODE_ENV === 'development'