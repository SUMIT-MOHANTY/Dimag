import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Clock, Users, Star, CheckCircle, PlayCircle, 
  FileText, Lock, ChevronDown, ChevronUp, Award,
  ArrowLeft, Share2, Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CourseStatusBadge } from '@/components/shared/CourseStatusBadge'
import { StarRating } from '@/components/shared/StarRating'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'
import { mockCourses, mockSections, getCourseBySlug } from '@/mocks/mockData'
import type { Course, CourseLevel } from '@/types/course'

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundCourse = getCourseBySlug(slug || '')
      if (foundCourse) {
        setCourse(foundCourse)
        // Check if user is enrolled (mock check)
        setIsEnrolled(false) // Would check actual enrollment
      }
      setIsLoading(false)
    }
    
    loadCourse()
  }, [slug])

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: `/courses/${slug}` } })
      return
    }
    // Handle enrollment logic
    setIsEnrolled(true)
  }

  const handleStartLearning = () => {
    if (!course) return
    if (user?.role === 'student') {
      navigate(`/student/courses/${course.id}/player`)
    }
  }

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const courseSections = mockSections.filter(s => s.courseId === course?.id)
  const totalLessons = courseSections.reduce((acc, s) => acc + s.lessons.length, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-64 bg-muted" />
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 w-1/3 bg-muted rounded mb-4" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(ROUTES.COURSES)}>
            Browse Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Course Hero */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate(ROUTES.COURSES)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <CourseStatusBadge status={course.status} />
                <Badge variant="secondary" className={getLevelColor(course.level)}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Badge>
                {course.isFree ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Free</Badge>
                ) : (
                  <Badge variant="secondary">Paid</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
              
              <p className="text-lg text-muted-foreground">{course.shortDescription}</p>
              
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <StarRating value={course.avgRating} readOnly size="sm" />
                  <span className="font-medium">{course.avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.ratingCount} ratings)</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollmentCount.toLocaleString()} students enrolled</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {course.instructorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{course.instructorName}</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
              </div>
            </div>
            
            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border bg-card p-6 shadow-lg">
                <div className="aspect-video rounded-lg bg-muted mb-4 overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  {course.isFree ? (
                    <span className="text-3xl font-bold text-green-600">Free</span>
                  ) : (
                    <span className="text-3xl font-bold">${course.price.toFixed(2)}</span>
                  )}
                </div>
                
                {isEnrolled ? (
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleStartLearning}
                  >
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Start Learning
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleEnroll}
                  >
                    {course.isFree ? 'Enroll for Free' : 'Enroll Now'}
                  </Button>
                )}
                
                <p className="text-sm text-muted-foreground text-center mt-3">
                  30-day money-back guarantee
                </p>
                
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{totalLessons} lessons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Full lifetime access</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">About this course</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {course.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {course.learningOutcomes?.map((outcome, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{outcome}</span>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Master core concepts and fundamentals</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Build real-world projects</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Learn best practices and patterns</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Prepare for professional certification</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {course.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    )) || (
                      <>
                        <li>Basic computer skills</li>
                        <li>Internet connection</li>
                        <li>Willingness to learn</li>
                      </>
                    )}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Course Content</h3>
                    <p className="text-sm text-muted-foreground">
                      {courseSections.length} sections • {totalLessons} lessons
                    </p>
                  </div>
                  
                  <Accordion type="multiple" className="w-full">
                    {courseSections.map((section, sectionIndex) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 text-left">
                            <span className="text-sm text-muted-foreground">
                              Section {sectionIndex + 1}
                            </span>
                            <span className="font-medium">{section.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.isPreview ? (
                                    <PlayCircle className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="text-sm text-muted-foreground">
                                    {lessonIndex + 1}.
                                  </span>
                                  <span className="text-sm">{lesson.title}</span>
                                  {lesson.isPreview && (
                                    <Badge variant="secondary" className="text-xs">Preview</Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="space-y-6">
                  <div className="flex items-center gap-8 p-6 bg-muted/50 rounded-xl">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{course.avgRating.toFixed(1)}</p>
                      <StarRating value={course.avgRating} readOnly size="sm" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.ratingCount} ratings
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm w-8">{star} star</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sample Reviews */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Student Reviews</h4>
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">U{review}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">User {review}</p>
                            <StarRating value={5 - review * 0.5} readOnly size="sm" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Great course! The instructor explains concepts clearly and the projects are very practical.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <div className="rounded-xl border bg-card p-6">
                <h4 className="font-semibold mb-4">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {course.categories.map((cat) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="rounded-xl border bg-card p-6">
                <h4 className="font-semibold mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="rounded-xl border bg-card p-6">
                <h4 className="font-semibold mb-4">Course Info</h4>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Language</dt>
                    <dd className="font-medium">{course.language}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Level</dt>
                    <dd className="font-medium capitalize">{course.level}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Updated</dt>
                    <dd className="font-medium">
                      {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
