import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const ADMIN_EMAIL = 'agarwalnaveen9001@gmail.com'

/**
 * Check if the current session user is the blog admin.
 * Returns the session if authorized, null otherwise.
 */
export async function requireBlogAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  if (session.user.email !== ADMIN_EMAIL) {
    return null
  }

  return session
}
