import api from '@/lib/api'
import type { 
  AdminUser, 
  PlatformSetting,
  AuditLog,
  PlatformStats,
  UserAdminUpdatePayload,
  PlatformSettingUpdatePayload
} from '@/types/admin'
import type { Course } from '@/types/course'
import type { Enrollment } from '@/types/enrollment'
import type { PaginatedResponse, PaginationParams, MessageResponse } from '@/types/common'

export const adminApi = {
  // User management
  listUsers: async (params?: PaginationParams & { role?: string; search?: string }): Promise<PaginatedResponse<AdminUser>> => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  getUser: async (userId: string): Promise<AdminUser> => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },

  updateUser: async (userId: string, payload: UserAdminUpdatePayload): Promise<AdminUser> => {
    const response = await api.patch(`/admin/users/${userId}`, payload)
    return response.data
  },

  deleteUser: async (userId: string): Promise<MessageResponse> => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  restoreUser: async (userId: string): Promise<AdminUser> => {
    const response = await api.post(`/admin/users/${userId}/restore`)
    return response.data
  },

  changeUserRole: async (userId: string, role: string): Promise<AdminUser> => {
    const response = await api.post(`/admin/users/${userId}/role`, { role })
    return response.data
  },

  // Course moderation
  listAllCourses: async (params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<Course>> => {
    const response = await api.get('/admin/courses', { params })
    return response.data
  },

  // Enrollment management
  listAllEnrollments: async (params?: PaginationParams): Promise<PaginatedResponse<Enrollment>> => {
    const response = await api.get('/admin/enrollments', { params })
    return response.data
  },

  // Audit logs
  listAuditLogs: async (params?: PaginationParams & { action?: string; entityType?: string }): Promise<PaginatedResponse<AuditLog>> => {
    const response = await api.get('/admin/audit-logs', { params })
    return response.data
  },

  // Platform settings
  getSettings: async (): Promise<PlatformSetting[]> => {
    const response = await api.get('/admin/settings')
    return response.data
  },

  getSetting: async (key: string): Promise<PlatformSetting> => {
    const response = await api.get(`/admin/settings/${key}`)
    return response.data
  },

  updateSetting: async (key: string, payload: PlatformSettingUpdatePayload): Promise<PlatformSetting> => {
    const response = await api.put(`/admin/settings/${key}`, payload)
    return response.data
  },

  // Stats
  getPlatformStats: async (): Promise<PlatformStats> => {
    const response = await api.get('/admin/stats')
    return response.data
  },
}
