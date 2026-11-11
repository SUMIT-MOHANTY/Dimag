import api from '@/lib/api'
import type { 
  Quiz, 
  Question, 
  QuizSubmission,
  QuizResult,
  QuizAttempt
} from '@/types/assessment'
import type { PaginatedResponse, PaginationParams } from '@/types/common'

export interface SubmissionPayload {
  answers: Array<{
    questionId: string
    selectedOptionIds: string[]
    textAnswer?: string
  }>
}

export const assessmentsApi = {
  // Quiz management (instructor)
  listQuizzes: async (courseId: string): Promise<Quiz[]> => {
    const response = await api.get(`/assessments/courses/${courseId}/quizzes`)
    return response.data
  },

  createQuiz: async (courseId: string, payload: Partial<Quiz>): Promise<Quiz> => {
    const response = await api.post(`/assessments/courses/${courseId}/quizzes`, payload)
    return response.data
  },

  getQuiz: async (quizId: string): Promise<Quiz> => {
    const response = await api.get(`/assessments/quizzes/${quizId}`)
    return response.data
  },

  updateQuiz: async (quizId: string, payload: Partial<Quiz>): Promise<Quiz> => {
    const response = await api.patch(`/assessments/quizzes/${quizId}`, payload)
    return response.data
  },

  deleteQuiz: async (quizId: string): Promise<void> => {
    await api.delete(`/assessments/quizzes/${quizId}`)
  },

  publishQuiz: async (quizId: string): Promise<Quiz> => {
    const response = await api.post(`/assessments/quizzes/${quizId}/publish`)
    return response.data
  },

  // Question management
  listQuestions: async (quizId: string): Promise<Question[]> => {
    const response = await api.get(`/assessments/quizzes/${quizId}/questions`)
    return response.data
  },

  createQuestion: async (quizId: string, payload: Partial<Question>): Promise<Question> => {
    const response = await api.post(`/assessments/quizzes/${quizId}/questions`, payload)
    return response.data
  },

  getQuestion: async (questionId: string): Promise<Question> => {
    const response = await api.get(`/assessments/questions/${questionId}`)
    return response.data
  },

  updateQuestion: async (questionId: string, payload: Partial<Question>): Promise<Question> => {
    const response = await api.patch(`/assessments/questions/${questionId}`, payload)
    return response.data
  },

  deleteQuestion: async (questionId: string): Promise<void> => {
    await api.delete(`/assessments/questions/${questionId}`)
  },

  // Quiz taking (student)
  startQuiz: async (quizId: string): Promise<QuizAttempt> => {
    const response = await api.post(`/assessments/quizzes/${quizId}/start`)
    return response.data
  },

  submitQuiz: async (quizId: string, payload: SubmissionPayload): Promise<QuizResult> => {
    const response = await api.post(`/assessments/quizzes/${quizId}/submit`, payload)
    return response.data
  },

  getSubmission: async (submissionId: string): Promise<QuizSubmission> => {
    const response = await api.get(`/assessments/submissions/${submissionId}`)
    return response.data
  },

  listQuizSubmissions: async (quizId: string, params?: PaginationParams): Promise<PaginatedResponse<QuizSubmission>> => {
    const response = await api.get(`/assessments/quizzes/${quizId}/submissions`, { params })
    return response.data
  },

  listMySubmissions: async (params?: PaginationParams): Promise<PaginatedResponse<QuizSubmission>> => {
    const response = await api.get('/assessments/my-submissions', { params })
    return response.data
  },
}
