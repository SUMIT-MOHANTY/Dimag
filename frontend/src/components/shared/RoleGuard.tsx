import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, selectUser } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'
import type { UserRole } from '@/types/auth'

interface RoleGuardProps {
  allowedRoles: UserRole[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = useAuthStore(selectUser)

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'student':
        return <Navigate to={ROUTES.STUDENT.DASHBOARD} replace />
      case 'instructor':
        return <Navigate to={ROUTES.INSTRUCTOR.DASHBOARD} replace />
      case 'admin':
        return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
      default:
        return <Navigate to={ROUTES.HOME} replace />
    }
  }

  return <Outlet />
}
