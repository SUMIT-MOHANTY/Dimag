import { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { api } from '@/lib/api'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/lib/constants'

export function VerifyEmailPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { addToast } = useUIStore()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle')
  const [isResending, setIsResending] = useState(false)
  
  const token = searchParams.get('token')
  const email = location.state?.email || searchParams.get('email') || ''

  useEffect(() => {
    if (token && status === 'idle') {
      verifyEmail(token)
    }
  }, [token, status])

  const verifyEmail = async (verificationToken: string) => {
    setStatus('loading')
    try {
      await api.post('/auth/verify-email', { token: verificationToken })
      setStatus('success')
      addToast({
        type: 'success',
        title: 'Email verified!',
        message: 'Your email has been verified successfully.',
      })
    } catch (error) {
      setStatus('error')
      addToast({
        type: 'error',
        title: 'Verification failed',
        message: 'The verification link is invalid or has expired.',
      })
    }
  }

  const resendVerification = async () => {
    if (!email) {
      addToast({
        type: 'error',
        title: 'Email required',
        message: 'Please provide an email address.',
      })
      return
    }

    setIsResending(true)
    try {
      await api.post('/auth/resend-verification', { email })
      addToast({
        type: 'success',
        title: 'Email sent',
        message: 'Verification email has been resent.',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to resend',
        message: 'Unable to resend verification email. Please try again.',
      })
    } finally {
      setIsResending(false)
    }
  }

  // Auto-verification in progress
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verifying your email...</h1>
          <p className="text-muted-foreground">Please wait while we verify your email address.</p>
        </div>
      </div>
    )
  }

  // Verification successful
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Email verified!</h1>
            <p className="text-muted-foreground mb-6">
              Your email has been verified successfully. You can now sign in to your account.
            </p>
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Verification failed
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification failed</h1>
            <p className="text-muted-foreground mb-6">
              The verification link is invalid or has expired. Please request a new verification email.
            </p>
            <div className="space-y-3">
              <button
                onClick={resendVerification}
                disabled={isResending}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend verification email'}
              </button>
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="block w-full py-3 px-4 border rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Waiting for verification (no token in URL)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
          <p className="text-muted-foreground mb-2">
            We've sent a verification email to:
          </p>
          <p className="font-medium mb-6">{email || 'your email address'}</p>
          <p className="text-sm text-muted-foreground mb-6">
            Please check your inbox and click the verification link to complete your registration.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resendVerification}
              disabled={isResending}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="block w-full py-3 px-4 border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Back to login
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  )
}
