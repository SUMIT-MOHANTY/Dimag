export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
  statusCode: number
}

export interface MessageResponse {
  message: string
  success: boolean
}

export type UUID = string

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SortOption {
  label: string
  value: string
}

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}
