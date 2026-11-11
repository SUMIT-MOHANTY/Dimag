import { ReactNode } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  breadcrumbs?: { label: string; path?: string }[]
}

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  const location = useLocation()
  
  // Auto-generate breadcrumbs if not provided
  const breadcrumbItems = breadcrumbs || generateBreadcrumbs(location.pathname)

  return (
    <div className="border-b bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        {breadcrumbItems.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link
              to={ROUTES.HOME}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
            </Link>
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                {item.path ? (
                  <Link
                    to={item.path}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  )
}

function generateBreadcrumbs(pathname: string): { label: string; path?: string }[] {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length <= 1) return []

  return segments.slice(1).map((segment, index) => ({
    label: segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase()),
    path: index < segments.length - 2 ? `/${segments.slice(0, index + 2).join('/')}` : undefined
  }))
}
