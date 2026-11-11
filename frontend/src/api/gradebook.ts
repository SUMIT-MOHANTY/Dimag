import api from '@/lib/api'
import type { 
  GradebookEntry, 
  GradeOverridePayload,
  StudentGradeSummary,
  CourseGradeStats
} from '@/types/gradebook'
import type { PaginatedResponse, PaginationParams } from '@/types/common'

export const gradebookApi = {
  // Instructor gradebook
  listCourseGrades: async (courseId: string, params?: PaginationParams): Promise<PaginatedResponse<GradebookEntry>> => {
    const response = await api.get(`/gradebook/courses/${courseId}/grades`, { params })
    return response.data
  },

  getStudentCourseGrades: async (courseId: string, studentId: string): Promise<StudentGradeSummary> => {
    const response = await api.get(`/gradebook/courses/${courseId}/students/${studentId}/grades`)
    return response.data
  },

  getGradebookEntry: async (entryId: string): Promise<GradebookEntry> => {
    const response = await api.get(`/gradebook/entries/${entryId}`)
    return response.data
  },

  updateGradebookEntry: async (entryId: string, payload: Partial<GradebookEntry>): Promise<GradebookEntry> => {
    const response = await api.patch(`/gradebook/entries/${entryId}`, payload)
    return response.data
  },

  overrideGrade: async (entryId: string, payload: GradeOverridePayload): Promise<GradebookEntry> => {
    const response = await api.post(`/gradebook/entries/${entryId}/override`, payload)
    return response.data
  },

  exportCourseGrades: async (courseId: string, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> => {
    const response = await api.get(`/gradebook/courses/${courseId}/grades/export`, {
      params: { format },
      responseType: 'blob',
    })
    return response.data
  },

  // Student gradebook
  listMyGrades: async (params?: PaginationParams): Promise<PaginatedResponse<GradebookEntry>> => {
    const response = await api.get('/gradebook/my-grades', { params })
    return response.data
  },

  getMyCourseGrades: async (courseId: string): Promise<StudentGradeSummary> => {
    const response = await api.get(`/gradebook/courses/${courseId}/my-grades`)
    return response.data
  },
}
