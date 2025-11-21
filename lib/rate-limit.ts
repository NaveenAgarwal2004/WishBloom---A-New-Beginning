import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { env, isDev } from './env'

// In-memory rate limiter for development
class MemoryRateLimiter {
  private cache = new Map<string, { count: number; reset: number }>()

  async limit(identifier: string, tokens: number = 1) {
    const now = Date.now()
    const key = identifier
    const data = this.cache.get(key)

    if (!data || now > data.reset) {
      this.cache.set(key, { count: tokens, reset: now + 60000 }) // 1 minute window
      return { success: true, limit: 10, remaining: 10 - tokens, reset: now + 60000 }
    }

    if (data.count >= 10) {
      return { success: false, limit: 10, remaining: 0, reset: data.reset }
    }

    data.count += tokens
    return { success: true, limit: 10, remaining: 10 - data.count, reset: data.reset }
  }
}

// Create rate limiter instance
let ratelimit: Ratelimit | MemoryRateLimiter

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN && !isDev) {
  // Production: Use Upstash Redis
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
  })
} else {
  // Development: Use in-memory limiter
  console.log('⚠️  Using in-memory rate limiter (development mode)')
  ratelimit = new MemoryRateLimiter()
}

// Rate limit configurations for different endpoints
export const rateLimiters = {
  // Public API endpoints - strict
  public: ratelimit,

  // Authenticated endpoints - more lenient
  authenticated: env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN && !isDev
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 requests per minute
      })
    : new MemoryRateLimiter(),

  // WishBloom creation - production-optimized
  // Anonymous users: 5 per hour | Authenticated users: 20 per hour
  wishbloomCreationAnonymous: env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN && !isDev
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 WishBlooms per hour for anonymous
      })
    : new MemoryRateLimiter(),

  wishbloomCreationAuthenticated: env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN && !isDev
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 WishBlooms per hour for authenticated
      })
    : new MemoryRateLimiter(),

  // Image uploads - reasonable limit
  upload: env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN && !isDev
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 uploads per minute
      })
    : new MemoryRateLimiter(),
}

// Helper to get identifier from request
export function getIdentifier(request: Request): string {
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'anonymous'
  
  // Could also use user ID if authenticated
  return ip
}

// Helper to check rate limit
export async function checkRateLimit(
  request: Request,
  limiter: Ratelimit | MemoryRateLimiter = rateLimiters.public
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const identifier = getIdentifier(request)
  const result = await limiter.limit(identifier)
  
  return result
}

// Middleware-style helper
export async function withRateLimit(
  request: Request,
  handler: () => Promise<Response>,
  limiter?: Ratelimit | MemoryRateLimiter
): Promise<Response> {
  const result = await checkRateLimit(request, limiter)

  // Add rate limit headers
  const headers = new Headers()
  headers.set('X-RateLimit-Limit', result.limit.toString())
  headers.set('X-RateLimit-Remaining', result.remaining.toString())
  headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString())

  if (!result.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: new Date(result.reset).toISOString(),
      }),
      {
        status: 429,
        headers: {
          ...Object.fromEntries(headers),
          'Content-Type': 'application/json',
        },
      }
    )
  }

  const response = await handler()
  
  // Add rate limit headers to successful response
  headers.forEach((value, key) => {
    response.headers.set(key, value)
  })

  return response
}