'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Plus, LogIn, LogOut, User, Home } from 'lucide-react'
import { APP_CONFIG } from '@/config/constants'

/**
 * Navigation Header Component
 * Provides access to Dashboard, Create, and Auth
 * Includes mobile bottom navigation bar
 */
export default function Navigation() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const pathname = usePathname()

  return (
    <>
      {/* Top Navigation Bar (Desktop + Mobile) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-warmCream-50/95 backdrop-blur-sm border-b border-warmCream-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🌸</span>
            <span className="text-h5 font-heading font-bold text-sepiaInk">
              {APP_CONFIG.APP_NAME}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            {!isLoading && (
              <>
                {session ? (
                  <>
                    {/* Dashboard Link */}
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 font-heading"
                        data-testid="nav-dashboard-btn"
                      >
                        <LayoutDashboard size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                      </Button>
                    </Link>

                    {/* Create Link */}
                    <Link href="/create">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 font-heading bg-fadedGold/10 border-fadedGold text-sepiaInk hover:bg-fadedGold/20"
                        data-testid="nav-create-btn"
                      >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Create</span>
                      </Button>
                    </Link>

                    {/* User Menu */}
                    <div className="flex items-center gap-2 pl-2 border-l border-warmCream-300">
                      <div className="hidden md:flex items-center gap-2 text-body-sm text-warmCream-700">
                        <User size={16} />
                        <span>{session.user?.name || session.user?.email}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => signOut()}
                        className="gap-2 font-heading text-warmCream-600 hover:text-sepiaInk"
                        data-testid="nav-signout-btn"
                      >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Sign Out</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Sign In Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signIn()}
                      className="gap-2 font-heading"
                      data-testid="nav-signin-btn"
                    >
                      <LogIn size={18} />
                      Sign In
                    </Button>

                    {/* Create Button */}
                    <Link href="/create">
                      <Button
                        size="sm"
                        className="gap-2 font-heading bg-fadedGold hover:bg-fadedGold/90 text-white"
                        data-testid="nav-create-btn"
                      >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Create</span>
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-warmCream-50/95 backdrop-blur-sm border-t border-warmCream-200 pb-safe">
        <div className="grid grid-cols-3 gap-1 px-2 py-2">
          {/* Home */}
          <Link href="/">
            <button
              className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl transition-all ${
                pathname === '/'
                  ? 'bg-fadedGold/20 text-sepiaInk'
                  : 'text-warmCream-600 hover:bg-warmCream-200/50'
              }`}
              data-testid="bottom-nav-home"
            >
              <Home size={22} strokeWidth={pathname === '/' ? 2.5 : 2} />
              <span className="text-micro font-mono">Home</span>
            </button>
          </Link>

          {/* Create */}
          <Link href="/create">
            <button
              className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl transition-all ${
                pathname === '/create'
                  ? 'bg-fadedGold/20 text-sepiaInk'
                  : 'text-warmCream-600 hover:bg-warmCream-200/50'
              }`}
              data-testid="bottom-nav-create"
            >
              <Plus size={22} strokeWidth={pathname === '/create' ? 2.5 : 2} />
              <span className="text-micro font-mono">Create</span>
            </button>
          </Link>

          {/* Dashboard or Sign In */}
          {!isLoading && (
            <>
              {session ? (
                <Link href="/dashboard">
                  <button
                    className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl transition-all ${
                      pathname === '/dashboard'
                        ? 'bg-fadedGold/20 text-sepiaInk'
                        : 'text-warmCream-600 hover:bg-warmCream-200/50'
                    }`}
                    data-testid="bottom-nav-dashboard"
                  >
                    <LayoutDashboard size={22} strokeWidth={pathname === '/dashboard' ? 2.5 : 2} />
                    <span className="text-micro font-mono">Dashboard</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-xl text-warmCream-600 hover:bg-warmCream-200/50 transition-all"
                  data-testid="bottom-nav-signin"
                >
                  <LogIn size={22} strokeWidth={2} />
                  <span className="text-micro font-mono">Sign In</span>
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  )
}
