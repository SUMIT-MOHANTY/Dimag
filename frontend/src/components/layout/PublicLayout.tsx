import { Outlet, Link, useLocation } from 'react-router-dom'
import { BookOpen, Menu, X, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  const isAuthPage = location.pathname.startsWith('/auth') || 
                     location.pathname === '/login' || 
                     location.pathname === '/register'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Open LMS</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to={ROUTES.COURSES}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Courses
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  to={ROUTES.STUDENT.DASHBOARD}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-4 py-4 space-y-3">
              <Link
                to={ROUTES.COURSES}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium"
              >
                Browse Courses
              </Link>
              {!isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  to={ROUTES.STUDENT.DASHBOARD}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Open LMS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Open LMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
