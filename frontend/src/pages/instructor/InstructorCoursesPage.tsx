import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageHeader } from '@/components/layout/PageHeader'
import { CourseStatusBadge } from '@/components/shared/CourseStatusBadge'
import { StarRating } from '@/components/shared/StarRating'
import { SearchInput } from '@/components/shared/SearchInput'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/lib/constants'
import { mockCourses } from '@/mocks/mockData'
import type { Course, CourseStatus } from '@/types/course'

export function InstructorCoursesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'all'>('all')

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Filter courses by current instructor
      const instructorCourses = mockCourses.filter(
        c => c.instructorName === user?.fullName
      )
      
      setCourses(instructorCourses)
      setFilteredCourses(instructorCourses)
      setIsLoading(false)
    }
    
    loadCourses()
  }, [user])

  useEffect(() => {
    let filtered = courses
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.shortDescription.toLowerCase().includes(query)
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }
    
    setFilteredCourses(filtered)
  }, [searchQuery, statusFilter, courses])

  const handleCreateCourse = () => {
    navigate(ROUTES.INSTRUCTOR_CREATE_COURSE)
  }

  const handleEditCourse = (courseId: string) => {
    navigate(`/instructor/courses/${courseId}/edit`)
  }

  const handleViewCourse = (courseId: string) => {
    navigate(`/instructor/courses/${courseId}`)
  }

  const handleViewAnalytics = (courseId: string) => {
    navigate(`${ROUTES.INSTRUCTOR_ANALYTICS}?course=${courseId}`)
  }

  const handleDeleteCourse = (courseId: string) => {
    addToast({
      type: 'success',
      title: 'Course Deleted',
      message: 'The course has been moved to trash.',
    })
  }

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700'
      case 'draft': return 'bg-yellow-100 text-yellow-700'
      case 'archived': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="My Courses"
        description="Manage your courses and track their performance"
        action={
          <Button onClick={handleCreateCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        }
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[280px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search your courses..."
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('published')}
            >
              Published
            </Button>
            <Button
              variant={statusFilter === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('draft')}
            >
              Drafts
            </Button>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredCourses.length}</span> courses
          </p>
        </div>
        
        {/* Course Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
                <div className="aspect-video rounded bg-muted" />
                <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden group">
                {/* Thumbnail */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <CourseStatusBadge status={course.status} />
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.shortDescription}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <StarRating value={course.avgRating} readOnly size="sm" />
                      <span className="text-sm text-muted-foreground">
                        ({course.ratingCount})
                      </span>
                    </div>
                    <span className="font-semibold">
                      {course.isFree ? 'Free' : `$${course.price.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{course.enrollmentCount.toLocaleString()} students</span>
                    <span className="capitalize">{course.level}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewCourse(course.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewAnalytics(course.id)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first course.'}
            </p>
            <Button onClick={handleCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorCoursesPage
