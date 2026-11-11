import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'
import type { User, AuthState } from '@/types/auth'

interface AuthStore extends AuthState {
  login: (user: User, accessToken: string, refreshToken?: string) => void
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: (user, accessToken, refreshToken) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
        if (refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false })
      },
      
      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false })
      },
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        if (token) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
        } else {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        }
        set({ accessToken: token, isAuthenticated: !!token })
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({ user: state.user }),
    }
  )
)

export default useAuthStore
