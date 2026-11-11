import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="mx-auto w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertTriangle className="h-16 w-16 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-destructive font-bold text-sm">404</span>
          </div>
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or never existed.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg"
            onClick={() => navigate(ROUTES.HOME)}
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>
        
        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something else?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.COURSES)}>
              <Search className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
              Sign In
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
              Get Started
            </Button>
          </div>
        </div>
        
        {/* Error Code */}
        <p className="mt-8 text-xs text-muted-foreground">
          Error Code: 404 | If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage
