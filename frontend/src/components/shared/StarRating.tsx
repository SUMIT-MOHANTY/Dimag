import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  max?: number
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: number) => void
  className?: string
}

export function StarRating({
  value,
  max = 5,
  readOnly = true,
  size = 'md',
  onChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  }

  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1)
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, index) => {
        const filled = index < Math.floor(value)
        const halfFilled = !filled && index < value

        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(index)}
            className={cn(
              'relative',
              !readOnly && 'cursor-pointer hover:scale-110 transition-transform'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
              )}
            />
            {halfFilled && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star
                  className={cn(
                    sizeClasses[size],
                    'fill-amber-400 text-amber-400'
                  )}
                />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
