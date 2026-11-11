export type UserRole = 'student' | 'instructor' | 'admin'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl?: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  role: UserRole
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface AuthResponse {
  user: User
  tokens: TokenResponse
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export interface VerifyEmailPayload {
  token: string
}

export interface PasswordChangePayload {
  currentPassword: string
  newPassword: string
}

export interface UserUpdatePayload {
  fullName?: string
  email?: string
}
