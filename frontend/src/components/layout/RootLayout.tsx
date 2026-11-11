import { ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { ToastContainer } from '@/store/uiStore'

interface RootLayoutProps {
  children: ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {children}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
}
