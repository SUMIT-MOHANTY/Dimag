import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Users, Award, ArrowRight, Play, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/shared/CourseCard'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'
import { mockCourses } from '@/mocks/mockData'
import type { CourseListItem } from '@/types/course'

export function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [featuredCourses, setFeaturedCourses] = useState<CourseListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    const loadCourses = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      // Get first 6 published courses
      const courses = mockCourses
        .filter(c => c.status === 'published')
        .slice(0, 6)
        .map(c => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          shortDescription: c.shortDescription,
          thumbnailUrl: c.thumbnailUrl,
          instructorName: c.instructorName,
          status: c.status,
          avgRating: c.avgRating,
          ratingCount: c.ratingCount,
          enrollmentCount: c.enrollmentCount,
          price: c.price,
          isFree: c.isFree,
          level: c.level,
          categories: c.categories,
          tags: c.tags,
        }))
      setFeaturedCourses(courses)
      setIsLoading(false)
    }
    loadCourses()
  }, [])

  const handleBrowseCourses = () => {
    navigate(ROUTES.COURSES)
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect based on role
      switch (user?.role) {
        case 'student':
          navigate(ROUTES.STUDENT_DASHBOARD)
          break
        case 'instructor':
          navigate(ROUTES.INSTRUCTOR_DASHBOARD)
          break
        case 'admin':
          navigate(ROUTES.ADMIN_DASHBOARD)
          break
        default:
          navigate(ROUTES.COURSES)
      }
    } else {
      navigate(ROUTES.REGISTER)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Star className="h-4 w-4 fill-primary" />
                <span>Trusted by 10,000+ learners worldwide</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Learn Without{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Limits
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Discover world-class courses taught by expert instructors. 
                Advance your career, learn new skills, and achieve your goals with Open LMS.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={handleBrowseCourses}
                  className="gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Browse Courses
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleGetStarted}
                  className="gap-2"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Free courses available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Expert instructors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Certificate on completion</span>
                </div>
              </div>
            </div>
            
            <div className="relative lg:pl-8">
              <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
                <div className="rounded-xl bg-card p-6 shadow-2xl">
                  <div className="aspect-video rounded-lg bg-muted flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                    <Play className="h-16 w-16 text-primary/50" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              </div>
              
              {/* Floating stats cards */}
              <div className="absolute -bottom-4 -left-4 rounded-lg bg-card p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">10K+</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 rounded-lg bg-card p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary/10 p-2">
                    <BookOpen className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10,000+</p>
              <p className="text-sm text-muted-foreground mt-1">Active Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Quality Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground mt-1">Expert Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">95%</p>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Courses</h2>
              <p className="text-muted-foreground mt-2">Hand-picked courses to get you started</p>
            </div>
            <Button variant="outline" onClick={handleBrowseCourses}>
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
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
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Why Choose Open LMS?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Courses</h3>
              <p className="text-sm text-muted-foreground">
                Instructors can easily create and manage engaging courses with our intuitive tools.
              </p>
            </div>
            
            <div className="rounded-xl border bg-card p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your learning journey with detailed progress tracking and analytics.
              </p>
            </div>
            
            <div className="rounded-xl border bg-card p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Earn Certificates</h3>
              <p className="text-sm text-muted-foreground">
                Get recognized for your achievements with verified certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary p-8 lg:p-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of learners and start your journey today. 
              Whether you want to learn a new skill or teach others, Open LMS has you covered.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleGetStarted}
              >
                Get Started for Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={handleBrowseCourses}
              >
                Browse Courses
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
