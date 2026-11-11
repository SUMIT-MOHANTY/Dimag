export type QuestionType = 'multiple_choice' | 'multiple_select' | 'true_false' | 'short_answer'

export interface Quiz {
  id: string
  courseId: string
  title: string
  description?: string
  timeLimitSeconds?: number
  maxAttempts: number
  passingScore: number
  isPublished: boolean
  questionCount: number
  totalPoints: number
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  quizId: string
  type: QuestionType
  text: string
  explanation?: string
  points: number
  position: number
  options: AnswerOption[]
}

export interface AnswerOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizSubmission {
  quizId: string
  startedAt: string
  completedAt?: string
  answers: SubmissionAnswer[]
}

export interface SubmissionAnswer {
  questionId: string
  selectedOptionIds: string[]
  textAnswer?: string
}

export interface QuizResult {
  id: string
  quizId: string
  quizTitle: string
  studentId: string
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  attemptNumber: number
  timeSpentSeconds: number
  submittedAt: string
  questionResults: QuestionResult[]
}

export interface QuestionResult {
  questionId: string
  questionText: string
  questionType: QuestionType
  points: number
  earnedPoints: number
  isCorrect: boolean
  selectedOptions: string[]
  correctOptions: string[]
  explanation?: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentId: string
  attemptNumber: number
  startedAt: string
  completedAt?: string
  score?: number
  maxScore: number
  status: 'in_progress' | 'completed' | 'timed_out'
}
