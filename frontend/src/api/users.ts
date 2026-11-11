import api from '@/lib/api'
import type { 
  AuthUser, 
  UserUpdatePayload, 
  PasswordChangePayload,
  MessageResponse,
  Notification,
  NotificationPreference,
  NotificationUpdatePayload,
  NotificationPreferencesPayload
} from '@/types/auth'
import type { PaginatedResponse } from '@/types/common'

export const usersApi = {
  getCurrentUser: async (): Promise<AuthUser> => {
    const response = await api.get('/users/me')
    return response.data
  },

  updateCurrentUser: async (payload: UserUpdatePayload): Promise<AuthUser> => {
    const response = await api.patch('/users/me', payload)
    return response.data
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteAvatar: async (): Promise<MessageResponse> => {
    const response = await api.delete('/users/me/avatar')
    return response.data
  },

  changePassword: async (payload: PasswordChangePayload): Promise<MessageResponse> => {
    const response = await api.post('/users/me/change-password', payload)
    return response.data
  },

  // Notifications
  getNotifications: async (page = 1, limit = 20): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get('/users/me/notifications', {
      params: { page, limit },
    })
    return response.data
  },

  markNotificationRead: async (notificationId: string): Promise<MessageResponse> => {
    const response = await api.patch(`/users/me/notifications/${notificationId}/read`)
    return response.data
  },

  markAllNotificationsRead: async (): Promise<MessageResponse> => {
    const response = await api.post('/users/me/notifications/read-all')
    return response.data
  },

  getNotificationPreferences: async (): Promise<NotificationPreference[]> => {
    const response = await api.get('/users/me/notification-preferences')
    return response.data
  },

  updateNotificationPreferences: async (payload: NotificationPreferencesPayload): Promise<NotificationPreference[]> => {
    const response = await api.put('/users/me/notification-preferences', payload)
    return response.data
  },
}
