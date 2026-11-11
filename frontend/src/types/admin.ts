import type { UserRole } from './auth'
import type { CourseStatus } from './course'

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  isEmailVerified: boolean
  isActive: boolean
  avatarUrl?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  courseCount?: number
  enrollmentCount?: number
}

export interface PlatformSetting {
  key: string
  value: string
  description?: string
  isPublic: boolean
  updatedAt: string
  updatedBy?: string
}

export interface AuditLog {
  id: string
  userId?: string
  userEmail?: string
  action: string
  entityType: string
  entityId?: string
  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface PlatformStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalInstructors: number
  totalStudents: number
  activeUsersToday: number
  newUsersToday: number
  newEnrollmentsToday: number
  coursesByStatus: Record<CourseStatus, number>
  usersByRole: Record<UserRole, number>
  revenueThisMonth: number
  revenueLastMonth: number
}

export interface UserAdminUpdatePayload {
  fullName?: string
  role?: UserRole
  isActive?: boolean
}

export interface PlatformSettingUpdatePayload {
  value: string
  isPublic?: boolean
}
