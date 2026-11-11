import { Link } from 'react-router-dom'
import { Star, Users, Clock, BookOpen } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import type { Course, CourseListItem } from '@/types/course'

interface CourseCardProps {
  course: Course | CourseListItem
  className?: string
  showInstructor?: boolean
}

export function CourseCard({ course, className, showInstructor = true }: CourseCardProps) {
  const isFree = course.isFree || course.price === 0

  return (
    <Link
      to={`/courses/${course.slug}`}
      className={cn(
        'group block bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-2 left-2">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            course.level === 'beginner' && 'bg-green-100 text-green-700',
            course.level === 'intermediate' && 'bg-blue-100 text-blue-700',
            course.level === 'advanced' && 'bg-purple-100 text-purple-700'
          )}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            isFree ? 'bg-green-100 text-green-700' : 'bg-primary text-primary-foreground'
          )}>
            {isFree ? 'Free' : formatCurrency(course.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        {showInstructor && (
          <p className="text-sm text-muted-foreground mt-1">
            {course.instructorName}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{course.avgRating.toFixed(1)}</span>
            <span>({course.ratingCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.enrollmentCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Categories */}
        {course.categories && course.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {course.categories.slice(0, 2).map(category => (
              <span
                key={category}
                className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
