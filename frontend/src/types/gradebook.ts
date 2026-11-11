export type GradeStatus = 'pending' | 'graded' | 'overridden'

export interface GradebookEntry {
  id: string
  courseId: string
  studentId: string
  studentName: string
  studentEmail: string
  quizId?: string
  quizTitle?: string
  assignmentId?: string
  assignmentTitle?: string
  score: number
  maxScore: number
  percentage: number
  status: GradeStatus
  feedback?: string
  gradedBy?: string
  gradedAt?: string
  createdAt: string
  updatedAt: string
}

export interface GradeOverridePayload {
  score: number
  feedback?: string
}

export interface StudentGradeSummary {
  studentId: string
  studentName: string
  courseId: string
  courseTitle: string
  overallGrade: number
  totalPoints: number
  maxPoints: number
  entries: GradebookEntry[]
}

export interface CourseGradeStats {
  courseId: string
  totalStudents: number
  averageGrade: number
  highestGrade: number
  lowestGrade: number
  passingRate: number
}
