import { cn } from '@/lib/utils'
import type { CourseStatus } from '@/types/course'

interface CourseStatusBadgeProps {
  status: CourseStatus
  className?: string
}

export function CourseStatusBadge({ status, className }: CourseStatusBadgeProps) {
  const styles = {
    published: 'bg-green-100 text-green-700 border-green-200',
    draft: 'bg-amber-100 text-amber-700 border-amber-200',
    archived: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const labels = {
    published: 'Published',
    draft: 'Draft',
    archived: 'Archived',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  )
}
