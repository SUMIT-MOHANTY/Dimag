export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'pending'

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  status: EnrollmentStatus
  completionPercentage: number
  enrolledAt: string
  completedAt?: string
  droppedAt?: string
  lastAccessedAt?: string
  course?: {
    id: string
    title: string
    slug: string
    thumbnailUrl?: string
    instructorName: string
  }
}

export interface EnrollmentProgress {
  enrollmentId: string
  courseId: string
  courseTitle: string
  totalLessons: number
  completedLessons: number
  completionPercentage: number
  currentLessonId?: string
  currentLessonTitle?: string
  sections: SectionProgress[]
}

export interface SectionProgress {
  sectionId: string
  sectionTitle: string
  position: number
  lessons: LessonProgress[]
}

export interface LessonProgress {
  lessonId: string
  lessonTitle: string
  type: 'video' | 'text' | 'quiz' | 'file'
  duration?: number
  position: number
  isCompleted: boolean
  isLocked: boolean
  completedAt?: string
}

export interface EnrollmentCreatePayload {
  courseId: string
}

export interface EnrollmentUpdatePayload {
  status?: EnrollmentStatus
  completionPercentage?: number
}

export interface ProgressUpdatePayload {
  lessonId: string
  isCompleted: boolean
}
