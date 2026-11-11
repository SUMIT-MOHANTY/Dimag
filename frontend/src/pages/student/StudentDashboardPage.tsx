import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Bell,
  ChevronRight,
  PlayCircle,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseCard } from '@/components/shared/CourseCard'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'
import { mockCourses, mockEnrollments } from '@/mocks/mockData'
import type { CourseListItem, Enrollment } from '@/types/enrollment'

interface DashboardStats {
  coursesEnrolled: number
  coursesCompleted: number
  certificatesEarned: number
  hoursLearned: number
}

interface RecentActivity {
  id: string
  type: 'lesson_completed' | 'course_enrolled' | 'certificate_earned' | 'quiz_passed'
  title: string
  description: string
  timestamp: string
}

export function StudentDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    hoursLearned: 0,
  })
  const [enrolledCourses, setEnrolledCourses] = useState<CourseListItem[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))

      // Mock stats
      setStats({
        coursesEnrolled: 5,
        coursesCompleted: 2,
        certificatesEarned: 2,
        hoursLearned: 48,
      })

      // Mock enrolled courses with progress
      const enrolled = mockCourses
        .filter(c => c.status === 'published')
        .slice(0, 3)
        .map(c => ({
          ...c,
          progress: Math.floor(Math.random() * 100),
          lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        }))
      setEnrolledCourses(enrolled)

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'lesson_completed',
          title: 'Completed Lesson',
          description: 'Introduction to Python Basics',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'quiz_passed',
          title: 'Passed Quiz',
          description: 'JavaScript Fundamentals - Quiz 1',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'course_enrolled',
          title: 'Enrolled in Course',
          description: 'Advanced React Patterns',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          type: 'certificate_earned',
          title: 'Earned Certificate',
          description: 'Web Development Fundamentals',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ])

      setIsLoading(false)
    }

    loadDashboard()
  }, [])

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'lesson_completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'course_enrolled':
        return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'certificate_earned':
        return <Award className="h-4 w-4 text-yellow-500" />
      case 'quiz_passed':
        return <CheckCircle2 className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Student'}!`}
        description="Continue your learning journey"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
              <p className="text-xs text-muted-foreground">
                Active learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coursesCompleted}</div>
              <p className="text-xs text-muted-foreground">
                Finished courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.certificatesEarned}</div>
              <p className="text-xs text-muted-foreground">
                Achievements earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hoursLearned}</div>
              <p className="text-xs text-muted-foreground">
                Total study time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Continue Learning Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.STUDENT.MY_COURSES)}>
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
                    <div className="aspect-video rounded bg-muted mb-4" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm font-medium truncate">
                          {course.title}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{(course as any).progress || 0}%</span>
                        </div>
                        <ProgressBar 
                          value={(course as any).progress || 0} 
                          size="sm"
                          showLabel={false}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => navigate(`/student/courses/${course.id}/player`)}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continue
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by enrolling in a course
                </p>
                <Button onClick={() => navigate(ROUTES.COURSES)}>
                  Browse Courses
                </Button>
              </Card>
            )}

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="mt-1">{getActivityIcon(activity.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.COURSES)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Courses
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.STUDENT.NOTIFICATIONS)}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-primary">5</div>
                  <div>
                    <p className="font-medium">Day Streak!</p>
                    <p className="text-sm text-muted-foreground">
                      Keep learning daily to maintain your streak
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div
                      key={day + i}
                      className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
                        i < 5
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">First Certificate</p>
                    <p className="text-xs text-muted-foreground">Completed first course</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Quick Learner</p>
                    <p className="text-xs text-muted-foreground">5 lessons in one day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage
