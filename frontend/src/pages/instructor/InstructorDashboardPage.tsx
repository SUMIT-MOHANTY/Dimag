import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, Users, Star, DollarSign, TrendingUp, 
  Plus, BarChart3, Award, Clock, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'
import { mockCourses, mockUsers } from '@/mocks/mockData'

interface DashboardStats {
  totalStudents: number
  totalCourses: number
  averageRating: number
  totalRevenue: number
  monthlyRevenue: number
}

interface CoursePerformance {
  id: string
  title: string
  enrollmentCount: number
  completionRate: number
  revenue: number
  rating: number
}

export function InstructorDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [courses, setCourses] = useState<CoursePerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock stats
      setStats({
        totalStudents: 1248,
        totalCourses: 8,
        averageRating: 4.7,
        totalRevenue: 45280,
        monthlyRevenue: 5230,
      })
      
      // Mock course performance
      const instructorCourses = mockCourses
        .filter(c => c.instructorName === user?.fullName)
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          title: c.title,
          enrollmentCount: c.enrollmentCount,
          completionRate: Math.floor(Math.random() * 40) + 50, // 50-90%
          revenue: c.enrollmentCount * (c.isFree ? 0 : c.price * 0.7), // 70% instructor share
          rating: c.avgRating,
        }))
      
      setCourses(instructorCourses)
      setIsLoading(false)
    }
    
    loadDashboard()
  }, [user])

  const handleCreateCourse = () => {
    navigate(ROUTES.INSTRUCTOR_CREATE_COURSE)
  }

  const handleViewCourse = (courseId: string) => {
    navigate(`/instructor/courses/${courseId}`)
  }

  const handleViewAnalytics = (courseId: string) => {
    navigate(`${ROUTES.INSTRUCTOR_ANALYTICS}?course=${courseId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 bg-muted rounded" />
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="Instructor Dashboard"
        description={`Welcome back, ${user?.fullName || 'Instructor'}!`}
        action={
          <Button onClick={handleCreateCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
          </Button>
        }
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{stats?.totalStudents.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold">{stats?.totalCourses}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm">
                <span className="text-muted-foreground">3 published</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">5 drafts</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-bold">{stats?.averageRating.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm">
                <span className="text-muted-foreground">From 234 reviews</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">${stats?.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">+${stats?.monthlyRevenue.toLocaleString()}</span>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Course Performance */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Course Performance
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.INSTRUCTOR_COURSES)}>
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Course</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Students</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Completion</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Rating</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">ID: {course.id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {course.enrollmentCount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <ProgressBar progress={course.completionRate} size="sm" className="w-20" />
                          <span className="text-sm">{course.completionRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${course.revenue.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewCourse(course.id)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewAnalytics(course.id)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={handleCreateCourse}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Create New Course</h3>
                  <p className="text-sm text-muted-foreground">Start building your next course</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(ROUTES.INSTRUCTOR_GRADEBOOK)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Gradebook</h3>
                  <p className="text-sm text-muted-foreground">Review student submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate(ROUTES.INSTRUCTOR_ANALYTICS)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View detailed insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InstructorDashboardPage
