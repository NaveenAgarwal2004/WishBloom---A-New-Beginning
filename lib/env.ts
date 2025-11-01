import { z } from 'zod'

const envSchema = z.object({
  // Database
  MONGODB_URI: z.string().url().startsWith('mongodb'),
  DB_NAME: z.string().min(1).default('wishbloom'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // Email (Brevo)
  BREVO_API_KEY: z.string().min(1),
  BREVO_SENDER_EMAIL: z.string().email(),
  BREVO_SENDER_NAME: z.string().min(1).default('WishBloom'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

  // Rate Limiting (Upstash Redis)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // App
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

// Validate on startup
function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.format(), null, 2))
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

// Export validated env
export const env = validateEnv()

// Helper to check if we're in production
export const isProd = env.NODE_ENV === 'production'
export const isDev = env.NODE_ENV === 'development'