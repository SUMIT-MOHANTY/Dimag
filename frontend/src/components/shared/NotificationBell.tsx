import { useState, useRef, useEffect } from 'react'
import { Bell, Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = () => {
    markAllAsRead()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-accent rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <Link
                  key={notification.id}
                  to={notification.actionUrl || ROUTES.STUDENT.NOTIFICATIONS}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id)
                    }
                    setIsOpen(false)
                  }}
                  className={cn(
                    'block p-4 border-b last:border-b-0 hover:bg-accent/50 transition-colors',
                    !notification.isRead && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                      notification.isRead ? 'bg-muted' : 'bg-primary'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm',
                        !notification.isRead && 'font-medium'
                      )}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.body}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="p-3 border-t">
            <Link
              to={ROUTES.STUDENT.NOTIFICATIONS}
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-primary hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}
