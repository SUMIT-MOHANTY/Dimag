import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
  pageSizeOptions?: number[]
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  previousPage: () => void
  resetPagination: () => void
  pageSizeOptions: number[]
  queryParams: { page: number; page_size: number }
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
  } = options

  const [page, setPageState] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.max(1, newPage))
  }, [])

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize)
    setPageState(1) // Reset to first page when changing page size
  }, [])

  const nextPage = useCallback(() => {
    setPageState((prev) => prev + 1)
  }, [])

  const previousPage = useCallback(() => {
    setPageState((prev) => Math.max(1, prev - 1))
  }, [])

  const resetPagination = useCallback(() => {
    setPageState(initialPage)
    setPageSizeState(initialPageSize)
  }, [initialPage, initialPageSize])

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    resetPagination,
    pageSizeOptions,
    queryParams: { page, page_size: pageSize },
  }
}
