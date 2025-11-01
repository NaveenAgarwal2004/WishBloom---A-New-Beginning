process.env.MONGODB_URI = 'mongodb://localhost:27017/test'
process.env.DB_NAME = 'wishbloom'
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud'
process.env.CLOUDINARY_API_KEY = '123456'
process.env.CLOUDINARY_API_SECRET = 'abcdef'
process.env.BREVO_API_KEY = 'test-brevo-key'
process.env.BREVO_SENDER_EMAIL = 'test@example.com'
process.env.BREVO_SENDER_NAME = 'WishBloom'
process.env.NEXTAUTH_SECRET = '123456789012345678901234567890123456' // ≥32 chars
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.GOOGLE_CLIENT_ID = 'test-google-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret'
process.env.UPSTASH_REDIS_REST_URL = 'https://fake.url'
process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'
process.env.ALLOWED_ORIGINS = 'http://localhost:3000'
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'

import { describe, it, expect } from '@jest/globals'
import { getIdentifier } from '@/lib/rate-limit'


describe('Rate Limiting', () => {
  describe('getIdentifier', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      })

      const identifier = getIdentifier(request)
      expect(identifier).toBe('192.168.1.1')
    })

    it('should return "anonymous" when no IP available', () => {
      const request = new Request('http://localhost')

      const identifier = getIdentifier(request)
      expect(identifier).toBe('anonymous')
    })

    it('should handle single IP in x-forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '203.0.113.1',
        },
      })

      const identifier = getIdentifier(request)
      expect(identifier).toBe('203.0.113.1')
    })
  })

  // Note: Actual rate limiting tests would require mocking Redis or using test containers
  // For now, we test the helper functions
})