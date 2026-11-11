import { cn } from '@/lib/utils'
import type { EnrollmentStatus } from '@/types/enrollment'

interface EnrollmentStatusBadgeProps {
  status: EnrollmentStatus
  className?: string
}

export function EnrollmentStatusBadge({ status, className }: EnrollmentStatusBadgeProps) {
  const styles = {
    active: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    dropped: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
  }

  const labels = {
    active: 'Active',
    completed: 'Completed',
    dropped: 'Dropped',
    pending: 'Pending',
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
