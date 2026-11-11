export type CourseStatus = 'published' | 'draft' | 'archived'

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Course {
  id: string
  slug: string
  title: string
  shortDescription: string
  description?: string
  thumbnailUrl?: string
  instructorId: string
  instructorName: string
  instructorAvatar?: string
  status: CourseStatus
  level: CourseLevel
  language: string
  price: number
  isFree: boolean
  avgRating: number
  ratingCount: number
  enrollmentCount: number
  tags: string[]
  categories: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface CourseListItem {
  id: string
  slug: string
  title: string
  shortDescription: string
  thumbnailUrl?: string
  instructorName: string
  status: CourseStatus
  level: CourseLevel
  price: number
  isFree: boolean
  avgRating: number
  ratingCount: number
  enrollmentCount: number
  tags: string[]
  categories: string[]
}

export interface CourseDetail extends Course {
  sections: Section[]
  reviews?: CourseReview[]
  isEnrolled?: boolean
  enrollmentId?: string
}

export interface CourseCreatePayload {
  title: string
  shortDescription: string
  description?: string
  level: CourseLevel
  language?: string
  price?: number
  isFree?: boolean
  tags?: string[]
  categories?: string[]
}

export interface CourseUpdatePayload {
  title?: string
  shortDescription?: string
  description?: string
  level?: CourseLevel
  language?: string
  price?: number
  isFree?: boolean
  tags?: string[]
  categories?: string[]
  status?: CourseStatus
}

export interface Section {
  id: string
  courseId: string
  title: string
  position: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  sectionId: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'file'
  content?: string
  videoUrl?: string
  fileUrl?: string
  duration?: number
  position: number
  isPreview?: boolean
}

export interface LessonAttachment {
  id: string
  lessonId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: string
}

export interface CourseReview {
  id: string
  courseId: string
  studentId: string
  studentName: string
  studentAvatar?: string
  rating: number
  review: string
  createdAt: string
  updatedAt: string
}
