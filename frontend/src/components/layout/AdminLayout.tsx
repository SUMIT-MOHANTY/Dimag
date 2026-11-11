import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  Shield,
  Menu,
  LogOut,
  ChevronRight,
  GraduationCap,
  FileText,
  BarChart3,
} from 'lucide-react'
import { useState } from 'react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAuthStore, selectUser } from '@/store/authStore'
import { NotificationBell } from '@/components/shared/NotificationBell'

const navItems = [
  { path: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.ADMIN.USERS, label: 'Users', icon: Users },
  { path: ROUTES.ADMIN.COURSES, label: 'Courses', icon: BookOpen },
  { path: ROUTES.ADMIN.SETTINGS, label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore(selectUser)
  const logout = useAuthStore(state => state.logout)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b bg-primary/5">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold">Open LMS</span>
                <span className="block text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                              (item.path !== ROUTES.ADMIN.DASHBOARD && location.pathname.startsWith(item.path))
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.fullName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b bg-card/50 backdrop-blur flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Breadcrumb pathname={location.pathname} />
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length <= 1) return null

  return (
    <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
      <span className="capitalize">{segments[0]}</span>
      {segments.length > 1 && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="capitalize">{segments[segments.length - 1].replace(/-/g, ' ')}</span>
        </>
      )}
    </nav>
  )
}
