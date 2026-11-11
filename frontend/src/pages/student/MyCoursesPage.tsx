import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, PlayCircle, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseCard } from '@/components/shared/CourseCard'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { EnrollmentStatusBadge } from '@/components/shared/EnrollmentStatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { ROUTES } from '@/lib/constants'
import { mockCourses, mockEnrollments } from '@/mocks/mockData'
import type { EnrollmentStatus } from '@/types/enrollment'
import type { Course } from '@/types/course'

interface EnrolledCourse extends Course {
  enrollmentId: string
  status: EnrollmentStatus
  progress: number
  enrolledAt: string
  lastAccessed?: string
}

export function MyCoursesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<EnrollmentStatus>('active')
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock enrolled courses
      const enrolled: EnrolledCourse[] = mockCourses
        .filter(c => c.status === 'published')
        .slice(0, 6)
        .map((c, i) => ({
          ...c,
          enrollmentId: `e${i + 1}`,
          status: i < 3 ? 'active' : i < 5 ? 'completed' : 'dropped',
          progress: i < 3 ? [25, 65, 45][i] : i < 5 ? 100 : 10,
          enrolledAt: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastAccessed: i < 3 ? new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString() : undefined,
        }))

      setCourses(enrolled)
      setIsLoading(false)
    }

    loadCourses()
  }, [])

  const filteredCourses = courses.filter(c => c.status === activeTab)

  const getStatusIcon = (status: EnrollmentStatus) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-5 w-5" />
      case 'completed':
        return <CheckCircle2 className="h-5 w-5" />
      case 'dropped':
        return <XCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="My Courses"
        description="Manage your learning journey"
        breadcrumbs={[
          { label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD },
          { label: 'My Courses', href: ROUTES.STUDENT.MY_COURSES },
        ]}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as EnrollmentStatus)}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active ({courses.filter(c => c.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({courses.filter(c => c.status === 'completed').length})
            </TabsTrigger>
            <TabsTrigger value="dropped">
              Dropped ({courses.filter(c => c.status === 'dropped').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
                    <div className="aspect-video rounded bg-muted mb-4" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden group">
                    <div className="aspect-video relative overflow-hidden">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <EnrollmentStatusBadge status={course.status} />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.instructorName}
                      </p>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <ProgressBar value={course.progress} size="sm" showLabel={false} />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => navigate(`/student/courses/${course.id}/player`)}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No active courses"
                description="You don't have any active courses. Browse our catalog to start learning!"
                action={{
                  label: "Browse Courses",
                  onClick: () => navigate(ROUTES.COURSES)
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {filteredCourses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden group">
                    <div className="aspect-video relative overflow-hidden">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <EnrollmentStatusBadge status={course.status} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <span className="text-white font-medium flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Completed
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.instructorName}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1" 
                          size="sm"
                          onClick={() => navigate(`/student/courses/${course.id}/player`)}
                        >
                          Review Course
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="No completed courses yet"
                description="Keep learning! Your completed courses will appear here."
              />
            )}
          </TabsContent>

          <TabsContent value="dropped" className="mt-0">
            {filteredCourses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden opacity-75">
                    <div className="aspect-video relative overflow-hidden">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover grayscale"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <EnrollmentStatusBadge status={course.status} />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.instructorName}
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                      >
                        Re-enroll
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={XCircle}
                title="No dropped courses"
                description="You haven't dropped any courses."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default MyCoursesPage
