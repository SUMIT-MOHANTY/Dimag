import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  progress,
  size = 'md',
  showLabel = true,
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  const getColorClass = (value: number) => {
    if (value < 30) return 'bg-red-500'
    if (value < 70) return 'bg-amber-500'
    return 'bg-green-500'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', getColorClass(clampedProgress))}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
          {Math.round(clampedProgress)}%
        </span>
      )}
    </div>
  )
}
