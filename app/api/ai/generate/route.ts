import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { withRateLimit, rateLimiters } from '@/lib/rate-limit'
import { AI_CONSTANTS, ERROR_MESSAGES } from '@/config/constants'

// Define explicit types for our constants
type RelationshipType = typeof AI_CONSTANTS.RELATIONSHIPS[number]
type VibeType = typeof AI_CONSTANTS.VIBES[number]

// Mock responses for when API key is missing (testing/development)
const MOCK_RESPONSES: Record<string, Record<string, string>> = {
  Sentimental: {
    Mom: "Happy Birthday, sweetheart! Watching you grow has been the greatest joy of my life. You bring so much light and love into this world. I'm so proud of the person you've become. Here's to another beautiful year ahead!",
    Dad: "Happy Birthday, kiddo! I couldn't be prouder of the amazing person you are. Your strength, kindness, and determination inspire me every day. Wishing you all the happiness in the world today and always.",
    Bestie: "Happy Birthday to my partner in crime! Thank you for being my rock, my confidant, and my source of endless laughter. Life is so much brighter with you in it. Here's to many more adventures together!",
    Friend: "Happy Birthday! Your friendship means the world to me. You've been there through thick and thin, and I'm so grateful for every moment we've shared. Wishing you a day as wonderful as you are!",
    Sibling: "Happy Birthday to the best sibling anyone could ask for! From childhood memories to adult adventures, you've always been by my side. Thank you for being you. Love you more than words can say!",
    Partner: "Happy Birthday, my love! Every day with you is a gift. You make my world brighter, my heart fuller, and my life complete. Here's to celebrating you today and loving you always.",
  },
  Funny: {
    Mom: "Happy Birthday, Mom! Thanks for not giving me away when I was a terrible teenager. You deserve a medal... or at least a really big piece of cake today!",
    Dad: "Happy Birthday, Dad! You're not old, you're just retro! Thanks for all the dad jokes and life lessons. Here's to another year of you pretending to understand technology!",
    Bestie: "Happy Birthday! You're not getting older, you're just increasing in value like a fine wine... or cheese... or vintage memes. Let's celebrate before we throw out our backs!",
    Friend: "Happy Birthday! Another year older, but let's be honest, you peaked at 21 and have been coasting ever since. Just kidding! Here's to pretending we have it all figured out!",
    Sibling: "Happy Birthday! Thanks for being older/younger and making me look good by comparison. Remember, age is just a number... a really big, scary number in your case!",
    Partner: "Happy Birthday, babe! You're aging like fine wine... expensive and giving me a headache. Just kidding! You're perfect and I love you even when you steal the covers!",
  },
  Poetic: {
    Mom: "Another year has bloomed like spring's first flower, bringing grace and wisdom with each passing hour. Your love, a lighthouse through life's stormy weather. Happy Birthday, Mom—my heart's forever tether.",
    Dad: "Time's gentle hand has painted silver in your hair, but youth lives on in the kindness that you share. A father's love, unwavering and true. Happy Birthday, Dad—the world's a better place with you.",
    Bestie: "Through seasons of laughter and tears we've grown, a friendship like ours is rarely known. Like stars that shine through darkest night. Happy Birthday, friend—you make everything feel right.",
    Friend: "Like pages in a cherished book we turn, from you, there's always something new to learn. Your spirit bright, your heart so kind. Happy Birthday—what a treasure you to find.",
    Sibling: "From shared beginnings to paths our own, together we've laughed, together we've grown. Through every chapter, thick and thin. Happy Birthday—so glad we're kin.",
    Partner: "In you I've found my missing piece, a love that brings me joy and peace. With every sunrise, my heart renews. Happy Birthday, my love—forever I choose you.",
  },
  Inspirational: {
    Mom: "Happy Birthday! Your strength, grace, and endless love have shaped me into who I am today. May this year bring you as much joy as you've given to everyone around you. You deserve the world!",
    Dad: "Happy Birthday! You've taught me that true success is measured in kindness, integrity, and love. Thank you for being my greatest teacher and role model. Here's to celebrating all that you are!",
    Bestie: "Happy Birthday! Your courage to chase your dreams inspires me every single day. Never stop being the incredible, unstoppable force that you are. The best is yet to come!",
    Friend: "Happy Birthday! Watching you overcome challenges and embrace life with such positivity is truly inspiring. May this year bring you closer to all your dreams. You've got this!",
    Sibling: "Happy Birthday! You've shown me that family means always having someone who believes in you. Thank you for your unwavering support and love. Let's make this year your best one yet!",
    Partner: "Happy Birthday, my love! You inspire me every day to be better, dream bigger, and love deeper. Together, there's nothing we can't achieve. Here's to a year filled with endless possibilities!",
  },
}

interface GenerateRequest {
  recipientName?: string
  relationship: string
  vibe: string
}

export async function POST(request: Request) {
  // Apply rate limiting for AI generation
  return withRateLimit(
    request,
    async () => {
      try {
        const body: GenerateRequest = await request.json()
        const { recipientName, relationship, vibe } = body

        // Validate inputs
        if (!relationship || !vibe) {
          return NextResponse.json(
            { success: false, error: 'Relationship and vibe are required' },
            { status: 400 }
          )
        }

        // Strict Type Guards - ✅ NO 'any' types
        const isValidRelationship = (r: string): r is RelationshipType => 
          AI_CONSTANTS.RELATIONSHIPS.includes(r as RelationshipType)
          
        const isValidVibe = (v: string): v is VibeType => 
          AI_CONSTANTS.VIBES.includes(v as VibeType)

        // Validate against allowed values with proper type guards
        if (!isValidRelationship(relationship)) {
          return NextResponse.json(
            { success: false, error: 'Invalid relationship value' },
            { status: 400 }
          )
        }

        if (!isValidVibe(vibe)) {
          return NextResponse.json(
            { success: false, error: 'Invalid vibe value' },
            { status: 400 }
          )
        }

        const apiKey = process.env.GEMINI_API_KEY

        // If no API key, return mock response
        if (!apiKey) {
          console.warn('⚠️ GEMINI_API_KEY not found, using mock response')
          const mockMessage = MOCK_RESPONSES[vibe]?.[relationship] || 
            "Happy Birthday! Wishing you a day filled with joy, laughter, and wonderful memories. You deserve all the happiness in the world!"
          
          return NextResponse.json({
            success: true,
            message: mockMessage,
            isMock: true,
          })
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: AI_CONSTANTS.MODEL })

        // Craft the prompt
        const nameContext = recipientName ? `for ${recipientName}` : ''
        const prompt = `Write a heartfelt birthday message ${nameContext} from the perspective of their ${relationship}. 
        
The message should be:
- ${vibe} in tone
- 3-4 sentences maximum
- Warm, genuine, and personal
- Appropriate for a digital birthday card
- NO generic corporate language
- Start directly with the message (don't include greetings like "Dear" as those are added separately)

Relationship: ${relationship}
Tone: ${vibe}
${recipientName ? `Recipient: ${recipientName}` : ''}

Generate ONLY the birthday message text, nothing else.`

        // Generate content with timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), AI_CONSTANTS.GENERATION_TIMEOUT_MS)

        try {
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: AI_CONSTANTS.MAX_TOKENS,
              temperature: AI_CONSTANTS.TEMPERATURE,
            },
          })

          clearTimeout(timeoutId)

          const response = result.response
          const generatedText = response.text()

          if (!generatedText || generatedText.trim().length < 10) {
            throw new Error('Generated text is too short or empty')
          }

          return NextResponse.json({
            success: true,
            message: generatedText.trim(),
            isMock: false,
          })
        } catch (genError) {
          clearTimeout(timeoutId)
          
          // If generation fails, fallback to mock
          console.error('❌ AI generation failed, using fallback:', genError)
          const mockMessage = MOCK_RESPONSES[vibe]?.[relationship] || 
            "Happy Birthday! Wishing you a day filled with joy, laughter, and wonderful memories. You deserve all the happiness in the world!"
          
          return NextResponse.json({
            success: true,
            message: mockMessage,
            isMock: true,
            fallbackReason: genError instanceof Error ? genError.message : 'Generation failed',
          })
        }
      } catch (error) {
        console.error('❌ Error in AI generation endpoint:', error)
        return NextResponse.json(
          {
            success: false,
            error: ERROR_MESSAGES.AI_GENERATION_FAILED,
            details: error instanceof Error && process.env.NODE_ENV === 'development' 
              ? error.message 
              : undefined,
          },
          { status: 500 }
        )
      }
    },
    rateLimiters.public // Use public rate limiter (10 per minute)
  )
}