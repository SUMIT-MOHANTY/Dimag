import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  toasts: Toast[]
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      theme: 'system',
      toasts: [],
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleTheme: () => {
        const currentTheme = get().theme
        const newTheme = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'system' : 'light'
        set({ theme: newTheme })
        applyTheme(newTheme)
      },
      
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      
      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast: Toast = { ...toast, id, duration: toast.duration || 5000 }
        set((state) => ({ toasts: [...state.toasts, newToast] }))
        
        // Auto-remove toast after duration
        setTimeout(() => {
          get().removeToast(id)
        }, newToast.duration)
      },
      
      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      },
      
      clearToasts: () => set({ toasts: [] }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)

function applyTheme(theme: 'light' | 'dark' | 'system') {
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

// Toast container component
export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-2 ${
            toast.variant === 'destructive'
              ? 'border-destructive bg-destructive text-destructive-foreground'
              : toast.variant === 'success'
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-border bg-card text-card-foreground'
          }`}
        >
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {toast.title && <h4 className="font-semibold">{toast.title}</h4>}
              {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-sm opacity-70 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default useUIStore
