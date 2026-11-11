import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  Download,
  MessageSquare,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import { PageHeader } from '@/components/layout/PageHeader'
import { mockSections, mockCourses } from '@/mocks/mockData'
import type { Lesson, Section } from '@/types/course'

export function LessonViewPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [section, setSection] = useState<Section | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null)
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const loadLesson = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))

      // Find lesson across all sections
      const courseSections = mockSections.filter(s => s.courseId === courseId)
      let foundLesson: Lesson | null = null
      let foundSection: Section | null = null
      let lessonIndex = -1
      let sectionIndex = -1

      for (let i = 0; i < courseSections.length; i++) {
        const s = courseSections[i]
        const idx = s.lessons.findIndex(l => l.id === lessonId)
        if (idx !== -1) {
          foundLesson = s.lessons[idx]
          foundSection = s
          lessonIndex = idx
          sectionIndex = i
          break
        }
      }

      if (foundLesson && foundSection) {
        setLesson(foundLesson)
        setSection(foundSection)
        setIsCompleted(lessonIndex === 0) // First lesson is completed

        // Find next lesson
        if (lessonIndex < foundSection.lessons.length - 1) {
          setNextLesson(foundSection.lessons[lessonIndex + 1])
        } else if (sectionIndex < courseSections.length - 1) {
          setNextLesson(courseSections[sectionIndex + 1].lessons[0])
        }

        // Find prev lesson
        if (lessonIndex > 0) {
          setPrevLesson(foundSection.lessons[lessonIndex - 1])
        } else if (sectionIndex > 0) {
          const prevSection = courseSections[sectionIndex - 1]
          setPrevLesson(prevSection.lessons[prevSection.lessons.length - 1])
        }
      }

      setIsLoading(false)
    }

    loadLesson()
  }, [courseId, lessonId])

  const handleMarkComplete = () => {
    setIsCompleted(true)
    // In real app, would call API to update progress
  }

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/student/courses/${courseId}/lessons/${nextLesson.id}`)
    }
  }

  const handlePrevLesson = () => {
    if (prevLesson) {
      navigate(`/student/courses/${courseId}/lessons/${prevLesson.id}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson || !section) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Lesson Not Found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      {/* Lesson Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{section.title}</span>
          <ChevronRight className="h-4 w-4" />
          <span>Lesson {section.lessons.findIndex(l => l.id === lessonId) + 1}</span>
        </div>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
      </div>

      {/* Lesson Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Video Content */}
          {lesson.contentType === 'video' && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <VideoPlayer 
                src={lesson.videoUrl || ''} 
                poster={lesson.thumbnailUrl}
              />
            </div>
          )}

          {/* Text Content */}
          {lesson.contentType === 'text' && (
            <Card>
              <CardContent className="p-6 prose max-w-none">
                <div 
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: lesson.content || '<p>No content available for this lesson.</p>' 
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* PDF/Document Content */}
          {lesson.contentType === 'pdf' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">PDF Document</p>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lesson Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevLesson}
                disabled={!prevLesson}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </Button>
            </div>

            <div className="flex gap-2">
              {!isCompleted ? (
                <Button onClick={handleMarkComplete}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Completed
                </Button>
              )}
              
              <Button
                onClick={handleNextLesson}
                disabled={!nextLesson}
              >
                Next Lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Discussion Link */}
          <Card className="bg-muted/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Have questions?</p>
                  <p className="text-sm text-muted-foreground">
                    Join the discussion for this lesson
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LessonViewPage
