import api from '@/lib/api'
import type { 
  Notification, 
  NotificationPreference,
  NotificationPreferencesPayload
} from '@/types/notification'
import type { PaginatedResponse, PaginationParams, MessageResponse } from '@/types/common'

export const notificationsApi = {
  getNotifications: async (params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get('/users/me/notifications', { params })
    return response.data
  },

  markAsRead: async (notificationId: string): Promise<MessageResponse> => {
    const response = await api.patch(`/users/me/notifications/${notificationId}/read`)
    return response.data
  },

  markAllAsRead: async (): Promise<MessageResponse> => {
    const response = await api.post('/users/me/notifications/read-all')
    return response.data
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/users/me/notifications/unread-count')
    return response.data
  },

  getPreferences: async (): Promise<NotificationPreference[]> => {
    const response = await api.get('/users/me/notification-preferences')
    return response.data
  },

  updatePreferences: async (payload: NotificationPreferencesPayload): Promise<NotificationPreference[]> => {
    const response = await api.put('/users/me/notification-preferences', payload)
    return response.data
  },
}
