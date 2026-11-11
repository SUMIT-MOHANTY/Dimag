import { useEffect, useState } from 'react'
import { useParams, useNavigate, Outlet, Link } from 'react-router-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  FileText, 
  Lock,
  Menu,
  X,
  BookOpen,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/lib/constants'
import { mockCourses, mockSections } from '@/mocks/mockData'
import type { Course, Section } from '@/types/course'
import type { Lesson } from '@/types/course'

export function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const [course, setCourse] = useState<Course | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [overallProgress, setOverallProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))

      const foundCourse = mockCourses.find(c => c.id === courseId)
      if (foundCourse) {
        setCourse(foundCourse)
        const courseSections = mockSections.filter(s => s.courseId === courseId)
        setSections(courseSections)
        setExpandedSections(courseSections.map(s => s.id))
        
        // Mock completed lessons
        const completed = new Set<string>()
        courseSections.forEach(section => {
          section.lessons.forEach((lesson, i) => {
            if (i === 0) completed.add(lesson.id) // First lesson completed
          })
        })
        setCompletedLessons(completed)
        
        // Calculate progress
        const totalLessons = courseSections.reduce((acc, s) => acc + s.lessons.length, 0)
        setOverallProgress(Math.round((completed.size / totalLessons) * 100))
      }
      setIsLoading(false)
    }

    loadCourse()
  }, [courseId])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const getLessonIcon = (lesson: Lesson) => {
    if (completedLessons.has(lesson.id)) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    if (lesson.isPreview) {
      return <PlayCircle className="h-4 w-4 text-primary" />
    }
    return <Circle className="h-4 w-4 text-muted-foreground" />
  }

  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate(ROUTES.STUDENT.MY_COURSES)}>
            Back to My Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-card border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.STUDENT.MY_COURSES)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="hidden md:block">
              <h1 className="font-semibold line-clamp-1">{course.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">{overallProgress}%</span>
              <div className="w-32">
                <ProgressBar value={overallProgress} size="sm" showLabel={false} />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Curriculum Navigation */}
        <aside 
          className={`fixed inset-y-0 left-0 z-30 w-80 bg-card border-r transform transition-transform duration-200 ease-in-out md:relative md:transform-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
          style={{ top: '57px' }}
        >
          <div className="h-full overflow-y-auto">
            {/* Course Progress Header */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedLessons.size}/{totalLessons} lessons
                </span>
              </div>
              <ProgressBar value={overallProgress} size="sm" />
            </div>

            {/* Sections & Lessons */}
            <div className="divide-y">
              {sections.map((section, sectionIndex) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Section {sectionIndex + 1}
                      </span>
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                    {expandedSections.includes(section.id) ? (
                      <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-90" />
                    ) : (
                      <ChevronLeft className="h-4 w-4 text-muted-foreground -rotate-90" />
                    )}
                  </button>

                  {expandedSections.includes(section.id) && (
                    <div className="bg-muted/20">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <Link
                          key={lesson.id}
                          to={`/student/courses/${courseId}/lessons/${lesson.id}`}
                          className="flex items-center gap-3 p-3 pl-6 hover:bg-muted transition-colors"
                        >
                          {getLessonIcon(lesson)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {lesson.contentType === 'video' ? 'Video' : 'Reading'} • {lesson.duration}
                            </p>
                          </div>
                          {lesson.isPreview && (
                            <span className="text-xs text-primary">Preview</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-57px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default CoursePlayerPage
