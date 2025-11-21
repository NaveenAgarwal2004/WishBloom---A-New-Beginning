import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { z } from 'zod'
import { AUTH_CONSTANTS } from '@/config/constants'

/**
 * POST /api/auth/signup
 * Create a new user account with email and password
 */

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`),
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Validate input
    const validationResult = signupSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data

    // Connect to database
    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with this email already exists' 
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, AUTH_CONSTANTS.PASSWORD_HASH_ROUNDS)

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      hashedPassword,
      role: 'user',
    })

    // Return success (don't include sensitive data)
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create account. Please try again.' 
      },
      { status: 500 }
    )
  }
}
