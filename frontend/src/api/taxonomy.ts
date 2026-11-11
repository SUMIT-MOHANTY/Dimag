import api from '@/lib/api'
import type { 
  Category, 
  Tag,
  CategoryCreatePayload,
  TagCreatePayload,
  CategoryTreeItem
} from '@/types/taxonomy'
import type { PaginatedResponse, PaginationParams } from '@/types/common'

export const taxonomyApi = {
  // Categories
  listCategories: async (params?: PaginationParams): Promise<PaginatedResponse<Category>> => {
    const response = await api.get('/taxonomy/categories', { params })
    return response.data
  },

  getCategoryTree: async (): Promise<CategoryTreeItem[]> => {
    const response = await api.get('/taxonomy/categories/tree')
    return response.data
  },

  createCategory: async (payload: CategoryCreatePayload): Promise<Category> => {
    const response = await api.post('/taxonomy/categories', payload)
    return response.data
  },

  getCategory: async (categoryId: string): Promise<Category> => {
    const response = await api.get(`/taxonomy/categories/${categoryId}`)
    return response.data
  },

  updateCategory: async (categoryId: string, payload: Partial<CategoryCreatePayload>): Promise<Category> => {
    const response = await api.patch(`/taxonomy/categories/${categoryId}`, payload)
    return response.data
  },

  deleteCategory: async (categoryId: string): Promise<void> => {
    await api.delete(`/taxonomy/categories/${categoryId}`)
  },

  // Tags
  listTags: async (params?: PaginationParams): Promise<PaginatedResponse<Tag>> => {
    const response = await api.get('/taxonomy/tags', { params })
    return response.data
  },

  createTag: async (payload: TagCreatePayload): Promise<Tag> => {
    const response = await api.post('/taxonomy/tags', payload)
    return response.data
  },

  getTag: async (tagId: string): Promise<Tag> => {
    const response = await api.get(`/taxonomy/tags/${tagId}`)
    return response.data
  },

  updateTag: async (tagId: string, payload: TagCreatePayload): Promise<Tag> => {
    const response = await api.patch(`/taxonomy/tags/${tagId}`, payload)
    return response.data
  },

  deleteTag: async (tagId: string): Promise<void> => {
    await api.delete(`/taxonomy/tags/${tagId}`)
  },

  searchTags: async (query: string): Promise<Tag[]> => {
    const response = await api.get('/taxonomy/tags/search', { params: { q: query } })
    return response.data
  },
}
