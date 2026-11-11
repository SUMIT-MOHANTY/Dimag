import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Loader2, GraduationCap, BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/lib/constants'
import type { UserRole } from '@/types/auth'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'instructor'] as const),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms of service',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const { addToast } = useUIStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
      agreeToTerms: false,
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const result = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
      })

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Account created!',
          message: 'Please check your email to verify your account.',
        })
        navigate(ROUTES.AUTH.VERIFY_EMAIL, { state: { email: data.email } })
      } else {
        addToast({
          type: 'error',
          title: 'Registration failed',
          message: result.error || 'Something went wrong. Please try again.',
        })
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Registration failed',
        message: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-primary-foreground">O</span>
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-2">Start your learning journey today</p>
        </div>

        {/* Register Form */}
        <div className="bg-card border rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-colors ${
                    selectedRole === 'student'
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-accent'
                  }`}
                >
                  <GraduationCap className={`h-6 w-6 ${selectedRole === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${selectedRole === 'student' ? 'text-primary' : ''}`}>Learn</span>
                  <input
                    {...register('role')}
                    type="radio"
                    value="student"
                    className="sr-only"
                  />
                </label>
                <label
                  className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center gap-2 transition-colors ${
                    selectedRole === 'instructor'
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-accent'
                  }`}
                >
                  <BookOpen className={`h-6 w-6 ${selectedRole === 'instructor' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${selectedRole === 'instructor' ? 'text-primary' : ''}`}>Teach</span>
                  <input
                    {...register('role')}
                    type="radio"
                    value="instructor"
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  {...register('agreeToTerms')}
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to={ROUTES.AUTH.LOGIN} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to={ROUTES.HOME} className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
