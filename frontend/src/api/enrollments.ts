import api from '@/lib/api'
import type { 
  Enrollment, 
  EnrollmentProgress,
  EnrollmentCreatePayload,
  EnrollmentUpdatePayload,
  ProgressUpdatePayload
} from '@/types/enrollment'
import type { PaginatedResponse, PaginationParams } from '@/types/common'

export const enrollmentsApi = {
  createEnrollment: async (payload: EnrollmentCreatePayload): Promise<Enrollment> => {
    const response = await api.post('/enrollments', payload)
    return response.data
  },

  listEnrollments: async (params?: PaginationParams): Promise<PaginatedResponse<Enrollment>> => {
    const response = await api.get('/enrollments', { params })
    return response.data
  },

  getEnrollment: async (enrollmentId: string): Promise<Enrollment> => {
    const response = await api.get(`/enrollments/${enrollmentId}`)
    return response.data
  },

  updateEnrollment: async (enrollmentId: string, payload: EnrollmentUpdatePayload): Promise<Enrollment> => {
    const response = await api.patch(`/enrollments/${enrollmentId}`, payload)
    return response.data
  },

  dropEnrollment: async (enrollmentId: string): Promise<Enrollment> => {
    const response = await api.post(`/enrollments/${enrollmentId}/drop`)
    return response.data
  },

  getEnrollmentProgress: async (enrollmentId: string): Promise<EnrollmentProgress> => {
    const response = await api.get(`/enrollments/${enrollmentId}/progress`)
    return response.data
  },

  getCourseProgress: async (courseId: string): Promise<EnrollmentProgress> => {
    const response = await api.get(`/enrollments/course/${courseId}/progress`)
    return response.data
  },

  updateLessonProgress: async (enrollmentId: string, payload: ProgressUpdatePayload): Promise<void> => {
    await api.post(`/enrollments/${enrollmentId}/progress`, payload)
  },
}
