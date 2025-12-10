import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from './mongodb-client'
import { env } from './env'
import bcrypt from 'bcryptjs'
import dbConnect from './mongodb'
import User from '@/models/User'

// Proper type definitions instead of `any`
interface ExtendedUser {
  id: string
  email: string
  name: string
  role?: string
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        await dbConnect()
        // ✅ FIX: Explicitly select hashedPassword field (it has select: false in schema)
        const user = await User.findOne({ email: credentials.email }).select('+hashedPassword')

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // ✅ Part 8: 7 days (more secure than 30)
    updateAge: 24 * 60 * 60, // ✅ Refresh every 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const extendedUser = user as ExtendedUser
        token.id = extendedUser.id
        token.role = extendedUser.role || 'user'
      }

      if (trigger === 'update' && session) {
        token.name = session.name
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const extendedSession = session as typeof session & {
          user: ExtendedUser
        }
        extendedSession.user.id = token.id as string
        extendedSession.user.role = token.role as string
      }
      return session
    },
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === 'development',
}

// Helper functions
export async function getCurrentUser(): Promise<ExtendedUser | null> {
  // This will be used in API routes later
  // NextAuth session handling for App Router
  return null // Placeholder - implement with headers
}

export async function requireAuth(): Promise<ExtendedUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin(): Promise<ExtendedUser> {
  const user = await requireAuth()
  if (!user || user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required')
  }
  return user
}