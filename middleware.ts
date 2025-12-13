import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * 🌸 WishBloom Middleware - Edge-Level Route Protection
 * 
 * This middleware runs at the edge before every request is processed.
 * It protects authenticated routes and handles redirects for unauthorized access.
 * 
 * Phase 1 Security Enhancement - Part of Production Hardening
 */

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/privacy',
  '/terms',
  '/offline',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/create',
]

// Define routes that require authentication
const protectedRoutes = [
  
  '/dashboard',
]

/**
 * Check if a path matches any of the route patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    if (route === pathname) return true
    if (route.endsWith('*') && pathname.startsWith(route.slice(0, -1))) return true
    return false
  })
}

/**
 * Main middleware function
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Allow all API routes to handle their own auth
    if (pathname.startsWith('/api')) {
      return NextResponse.next()
    }

    // Allow all public static files
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/fonts') ||
      pathname.startsWith('/icons') ||
      pathname.startsWith('/audio') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // If accessing protected route without authentication, redirect to signin
    if (isProtectedRoute && !token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Allow the request to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      // This callback is called before the middleware function
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow all public routes
        if (matchesRoute(pathname, publicRoutes)) {
          return true
        }

        // Allow all API routes (they handle their own auth)
        if (pathname.startsWith('/api')) {
          return true
        }

        // Allow public static files
        if (
          pathname.startsWith('/_next') ||
          pathname.startsWith('/fonts') ||
          pathname.startsWith('/icons') ||
          pathname.startsWith('/audio') ||
          pathname.includes('.')
        ) {
          return true
        }

        // For WishBloom view pages (e.g., /xyz123), allow public access
        // These are dynamic routes that should be publicly accessible via shared links
        if (pathname.match(/^\/[a-zA-Z0-9_-]{8,}$/)) {
          return true
        }

        // For protected routes, require authentication
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
        if (isProtectedRoute) {
          return !!token
        }

        // Default: allow
        return true
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
)

/**
 * Configure which routes this middleware should run on
 * 
 * We use a matcher to avoid running middleware on static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)',
  ],
}
