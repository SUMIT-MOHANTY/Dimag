export type NotificationType = 
  | 'course_published'
  | 'course_updated'
  | 'enrollment_confirmed'
  | 'lesson_completed'
  | 'quiz_graded'
  | 'certificate_earned'
  | 'discussion_reply'
  | 'announcement'
  | 'reminder'

export type NotificationChannel = 'email' | 'push' | 'in_app'

export interface Notification {
  id: string
  recipientId: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  data?: Record<string, unknown>
  createdAt: string
  readAt?: string
}

export interface NotificationPreference {
  userId: string
  type: NotificationType
  emailEnabled: boolean
  pushEnabled: boolean
  inAppEnabled: boolean
}

export interface NotificationUpdatePayload {
  isRead: boolean
}

export interface NotificationPreferencesPayload {
  preferences: Partial<NotificationPreference>[]
}

export interface NotificationSummary {
  total: number
  unread: number
  recent: Notification[]
}
