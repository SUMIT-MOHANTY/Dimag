import api from '@/lib/api'
import type { 
  LoginCredentials, 
  RegisterPayload, 
  TokenResponse, 
  AuthUser,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  MessageResponse
} from '@/types/auth'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (payload: RegisterPayload): Promise<MessageResponse> => {
    const response = await api.post('/auth/register', payload)
    return response.data
  },

  logout: async (): Promise<MessageResponse> => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  verifyEmail: async (payload: VerifyEmailPayload): Promise<MessageResponse> => {
    const response = await api.post('/auth/verify-email', payload)
    return response.data
  },

  resendVerification: async (email: string): Promise<MessageResponse> => {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<MessageResponse> => {
    const response = await api.post('/auth/forgot-password', payload)
    return response.data
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<MessageResponse> => {
    const response = await api.post('/auth/reset-password', payload)
    return response.data
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get('/users/me')
    return response.data
  },
}
