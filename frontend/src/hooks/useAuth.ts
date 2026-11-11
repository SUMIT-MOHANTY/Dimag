import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { api } from '@/lib/api'
import { ROUTES } from '@/lib/constants'
import type { UserRole, AuthUser, RegisterPayload } from '@/types/auth'

interface LoginResult {
  success: boolean
  redirectTo: string
  error?: string
}

interface RegisterResult {
  success: boolean
  error?: string
}

export function useAuth() {
  const navigate = useNavigate()
  const { addToast } = useUIStore()
  const { 
    user, 
    accessToken, 
    isAuthenticated, 
    isLoading, 
    login: storeLogin, 
    logout: storeLogout,
    setUser,
    setToken 
  } = useAuthStore()

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, access_token, refresh_token } = response.data

      // Store tokens
      localStorage.setItem('refresh_token', refresh_token)
      storeLogin(user, access_token)

      // Determine redirect based on role
      let redirectTo = ROUTES.HOME
      switch (user.role) {
        case 'student':
          redirectTo = ROUTES.STUDENT.DASHBOARD
          break
        case 'instructor':
          redirectTo = ROUTES.INSTRUCTOR.DASHBOARD
          break
        case 'admin':
          redirectTo = ROUTES.ADMIN.DASHBOARD
          break
      }

      return { success: true, redirectTo }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Invalid credentials'
      return { success: false, redirectTo: ROUTES.AUTH.LOGIN, error: message }
    }
  }, [storeLogin])

  const register = useCallback(async (payload: RegisterPayload): Promise<RegisterResult> => {
    try {
      await api.post('/auth/register', payload)
      return { success: true }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed'
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('refresh_token')
      storeLogout()
      navigate(ROUTES.AUTH.LOGIN)
      addToast({
        type: 'success',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
      })
    }
  }, [storeLogout, navigate, addToast])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem('refresh_token')
    if (!refreshTokenValue) {
      storeLogout()
      return false
    }

    try {
      const response = await api.post('/auth/refresh', { refresh_token: refreshTokenValue })
      const { access_token } = response.data
      setToken(access_token)
      return true
    } catch (error) {
      localStorage.removeItem('refresh_token')
      storeLogout()
      return false
    }
  }, [setToken, storeLogout])

  // Role helpers
  const isStudent = user?.role === 'student'
  const isInstructor = user?.role === 'instructor'
  const isAdmin = user?.role === 'admin'

  return {
    // State
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    currentUser: user,
    
    // Actions
    login,
    logout,
    register,
    refreshToken,
    setUser,
    setToken,
    
    // Role helpers
    isStudent,
    isInstructor,
    isAdmin,
  }
}
