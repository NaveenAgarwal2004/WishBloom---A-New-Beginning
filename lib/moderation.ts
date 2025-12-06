/**
 * 🌸 WishBloom Content Moderation
 * 
 * Provides content safety checks for user-generated content.
 * Phase 1 Security Enhancement - Basic text filtering and safety checks.
 * 
 * For production enhancement, consider:
 * - OpenAI Moderation API for advanced text filtering
 * - Cloudinary AI moderation for image content
 * - AWS Rekognition for image safety
 */

// Common profanity and inappropriate words (basic list for MVP)
const PROFANITY_LIST = [
  'damn',
  'hell',
  'crap',
  'shit',
  'fuck',
  'ass',
  'bitch',
  'bastard',
  'dick',
  'piss',
  'cock',
  'pussy',
  'slut',
  'whore',
  'fag',
  'nigger',
  'nigga',
  'chink',
  'spic',
  'kike',
  'retard',
  // Add more as needed
]

// Spam patterns
const SPAM_PATTERNS = [
  /viagra/gi,
  /cialis/gi,
  /casino/gi,
  /bitcoin/gi,
  /crypto/gi,
  /click here/gi,
  /buy now/gi,
  /limited offer/gi,
  /act now/gi,
  /free money/gi,
  /(http|https):\/\/[^\s]+/gi, // URLs (WishBloom shouldn't have URLs in content)
]

/**
 * Result of content moderation
 */
export interface ModerationResult {
  safe: boolean
  flagged: boolean
  reasons: string[]
  severity: 'low' | 'medium' | 'high'
}

/**
 * Moderate text content for profanity and inappropriate content
 */
export function moderateText(text: string): ModerationResult {
  const reasons: string[] = []
  let severity: 'low' | 'medium' | 'high' = 'low'

  // Convert to lowercase for checking
  const lowerText = text.toLowerCase()

  // Check for profanity
  const foundProfanity = PROFANITY_LIST.filter(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i')
    return regex.test(lowerText)
  })

  if (foundProfanity.length > 0) {
    reasons.push(`Contains inappropriate language: ${foundProfanity.slice(0, 3).join(', ')}`)
    severity = foundProfanity.length > 2 ? 'high' : 'medium'
  }

  // Check for spam patterns
  const foundSpam = SPAM_PATTERNS.filter(pattern => pattern.test(text))
  if (foundSpam.length > 0) {
    reasons.push('Content matches spam patterns')
    severity = 'high'
  }

  // Check for excessive caps (potential shouting/spam)
  const capsPercentage = (text.match(/[A-Z]/g) || []).length / text.length
  if (text.length > 20 && capsPercentage > 0.7) {
    reasons.push('Excessive use of capital letters')
    severity = severity === 'high' ? 'high' : 'medium'
  }

  // Check for excessive repetition (spam indicator)
  const words = text.split(/\s+/)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()))
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    reasons.push('Excessive word repetition detected')
    severity = severity === 'high' ? 'high' : 'medium'
  }

  const flagged = reasons.length > 0
  const safe = !flagged || severity === 'low'

  return {
    safe,
    flagged,
    reasons,
    severity,
  }
}

/**
 * Sanitize text by removing potentially harmful content
 */
export function sanitizeText(text: string): string {
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '')

  // Remove scripts
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Trim whitespace
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Moderate multiple text fields in an object
 */
export function moderateTextFields(fields: Record<string, string>): {
  safe: boolean
  results: Record<string, ModerationResult>
  blocked: boolean
} {
  const results: Record<string, ModerationResult> = {}
  let hasHighSeverity = false

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string' && value.length > 0) {
      const result = moderateText(value)
      results[key] = result

      if (result.severity === 'high') {
        hasHighSeverity = true
      }
    }
  }

  const allSafe = Object.values(results).every(r => r.safe)

  return {
    safe: allSafe,
    results,
    blocked: hasHighSeverity, // Block content with high severity issues
  }
}

/**
 * Moderate image URL
 * 
 * For production, integrate with:
 * - Cloudinary AI Moderation: https://cloudinary.com/documentation/ai_moderation_addon
 * - AWS Rekognition: https://aws.amazon.com/rekognition/
 * 
 * Current implementation: Basic URL validation
 */
export function moderateImage(imageUrl: string): ModerationResult {
  const reasons: string[] = []

  // Ensure it's from Cloudinary (trusted source)
  if (!imageUrl.includes('res.cloudinary.com')) {
    reasons.push('Image must be uploaded through Cloudinary')
    return {
      safe: false,
      flagged: true,
      reasons,
      severity: 'high',
    }
  }

  // Basic validation passed
  return {
    safe: true,
    flagged: false,
    reasons: [],
    severity: 'low',
  }
}

/**
 * Check if content contains personal information (PII)
 * Basic implementation - enhance for production
 */
export function containsPII(text: string): { found: boolean; types: string[] } {
  const types: string[] = []

  // Check for email addresses
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    types.push('email')
  }

  // Check for phone numbers (simple pattern)
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
    types.push('phone')
  }

  // Check for credit card patterns (basic)
  if (/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/.test(text)) {
    types.push('credit_card')
  }

  // Check for SSN patterns (US)
  if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
    types.push('ssn')
  }

  return {
    found: types.length > 0,
    types,
  }
}

/**
 * Comprehensive content moderation for WishBloom creation
 */
export function moderateWishBloomContent(data: {
  recipientName: string
  introMessage: string
  memories: Array<{ title: string; description: string; imageUrl?: string }>
  messages: Array<{ content: string; greeting?: string; signature: string }>
  celebrationWishPhrases?: string[]
}): {
  approved: boolean
  issues: Array<{ field: string; reason: string; severity: string }>
} {
  const issues: Array<{ field: string; reason: string; severity: string }> = []

  // Moderate recipient name
  const nameResult = moderateText(data.recipientName)
  if (!nameResult.safe) {
    issues.push({
      field: 'recipientName',
      reason: nameResult.reasons.join(', '),
      severity: nameResult.severity,
    })
  }

  // Moderate intro message
  const introResult = moderateText(data.introMessage)
  if (!introResult.safe) {
    issues.push({
      field: 'introMessage',
      reason: introResult.reasons.join(', '),
      severity: introResult.severity,
    })
  }

  // Moderate memories
  data.memories.forEach((memory, index) => {
    const titleResult = moderateText(memory.title)
    if (!titleResult.safe) {
      issues.push({
        field: `memories[${index}].title`,
        reason: titleResult.reasons.join(', '),
        severity: titleResult.severity,
      })
    }

    const descResult = moderateText(memory.description)
    if (!descResult.safe) {
      issues.push({
        field: `memories[${index}].description`,
        reason: descResult.reasons.join(', '),
        severity: descResult.severity,
      })
    }

    if (memory.imageUrl) {
      const imageResult = moderateImage(memory.imageUrl)
      if (!imageResult.safe) {
        issues.push({
          field: `memories[${index}].imageUrl`,
          reason: imageResult.reasons.join(', '),
          severity: imageResult.severity,
        })
      }
    }
  })

  // Moderate messages
  data.messages.forEach((message, index) => {
    const contentResult = moderateText(message.content)
    if (!contentResult.safe) {
      issues.push({
        field: `messages[${index}].content`,
        reason: contentResult.reasons.join(', '),
        severity: contentResult.severity,
      })
    }

    if (message.greeting) {
      const greetingResult = moderateText(message.greeting)
      if (!greetingResult.safe) {
        issues.push({
          field: `messages[${index}].greeting`,
          reason: greetingResult.reasons.join(', '),
          severity: greetingResult.severity,
        })
      }
    }
  })

  // Moderate celebration wish phrases
  if (data.celebrationWishPhrases) {
    data.celebrationWishPhrases.forEach((phrase, index) => {
      const phraseResult = moderateText(phrase)
      if (!phraseResult.safe) {
        issues.push({
          field: `celebrationWishPhrases[${index}]`,
          reason: phraseResult.reasons.join(', '),
          severity: phraseResult.severity,
        })
      }
    })
  }

  // Block if there are high severity issues
  const hasHighSeverity = issues.some(issue => issue.severity === 'high')

  return {
    approved: !hasHighSeverity,
    issues,
  }
}
