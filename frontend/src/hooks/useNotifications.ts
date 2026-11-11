import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Notification } from '@/types/notification'

const NOTIFICATIONS_QUERY_KEY = ['notifications']

export function useNotifications() {
  const queryClient = useQueryClient()

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get('/users/me/notifications')
      return response.data as Notification[]
    },
    staleTime: 60000, // 1 minute
  })

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length
  const unreadNotifications = notifications.filter((n) => !n.isRead)

  // Mark single notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      await api.patch(`/users/me/notifications/${notificationId}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      await api.post('/users/me/notifications/read-all')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
  })

  return {
    notifications,
    unreadCount,
    unreadNotifications,
    isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
  }
}
