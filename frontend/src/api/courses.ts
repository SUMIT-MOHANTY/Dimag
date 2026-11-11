import api from '@/lib/api'
import type { 
  Course, 
  CourseListItem, 
  CourseDetail,
  CourseCreatePayload,
  CourseUpdatePayload,
  Section,
  Lesson
} from '@/types/course'
import type { PaginatedResponse, PaginationParams } from '@/types/common'

export interface CourseFilters {
  category?: string
  level?: string
  search?: string
  isFree?: boolean
}

export const coursesApi = {
  // Public course endpoints
  listCourses: async (params: PaginationParams & CourseFilters): Promise<PaginatedResponse<CourseListItem>> => {
    const response = await api.get('/courses', { params })
    return response.data
  },

  getCourseBySlug: async (slug: string): Promise<CourseDetail> => {
    const response = await api.get(`/courses/${slug}`)
    return response.data
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  // Instructor course endpoints
  listMyCourses: async (params?: PaginationParams): Promise<PaginatedResponse<Course>> => {
    const response = await api.get('/courses/my-courses', { params })
    return response.data
  },

  listEnrolledCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses/enrolled')
    return response.data
  },

  createCourse: async (payload: CourseCreatePayload): Promise<Course> => {
    const response = await api.post('/courses', payload)
    return response.data
  },

  updateCourse: async (id: string, payload: CourseUpdatePayload): Promise<Course> => {
    const response = await api.patch(`/courses/${id}`, payload)
    return response.data
  },

  deleteCourse: async (id: string): Promise<void> => {
    await api.delete(`/courses/${id}`)
  },

  publishCourse: async (id: string): Promise<Course> => {
    const response = await api.post(`/courses/${id}/publish`)
    return response.data
  },

  // Content management
  getCourseSections: async (courseId: string): Promise<Section[]> => {
    const response = await api.get(`/content/courses/${courseId}/sections`)
    return response.data
  },

  createSection: async (courseId: string, title: string, position: number): Promise<Section> => {
    const response = await api.post(`/content/courses/${courseId}/sections`, { title, position })
    return response.data
  },

  updateSection: async (sectionId: string, title: string, position: number): Promise<Section> => {
    const response = await api.patch(`/content/sections/${sectionId}`, { title, position })
    return response.data
  },

  deleteSection: async (sectionId: string): Promise<void> => {
    await api.delete(`/content/sections/${sectionId}`)
  },

  getSectionLessons: async (sectionId: string): Promise<Lesson[]> => {
    const response = await api.get(`/content/sections/${sectionId}/lessons`)
    return response.data
  },

  createLesson: async (sectionId: string, payload: Partial<Lesson>): Promise<Lesson> => {
    const response = await api.post(`/content/sections/${sectionId}/lessons`, payload)
    return response.data
  },

  getLesson: async (lessonId: string): Promise<Lesson> => {
    const response = await api.get(`/content/lessons/${lessonId}`)
    return response.data
  },

  updateLesson: async (lessonId: string, payload: Partial<Lesson>): Promise<Lesson> => {
    const response = await api.patch(`/content/lessons/${lessonId}`, payload)
    return response.data
  },

  deleteLesson: async (lessonId: string): Promise<void> => {
    await api.delete(`/content/lessons/${lessonId}`)
  },
}
