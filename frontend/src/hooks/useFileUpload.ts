import { useState, useCallback } from 'react'
import { api } from '@/lib/api'

interface UseFileUploadOptions {
  maxSize?: number // in bytes
  acceptedTypes?: string[]
  onUploadProgress?: (progress: number) => void
}

interface UseFileUploadReturn {
  file: File | null
  preview: string | null
  progress: number
  error: string | null
  isUploading: boolean
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void
  clearFile: () => void
  upload: (endpoint: string, fieldName?: string) => Promise<string | null>
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const { maxSize = 10 * 1024 * 1024, acceptedTypes, onUploadProgress } = options

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = useCallback((selectedFile: File): boolean => {
    setError(null)

    if (maxSize && selectedFile.size > maxSize) {
      setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`)
      return false
    }

    if (acceptedTypes && acceptedTypes.length > 0) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.includes('*')) {
          return selectedFile.type.startsWith(type.replace('/*', ''))
        }
        return selectedFile.type === type
      })
      
      if (!isAccepted) {
        setError(`File type must be: ${acceptedTypes.join(', ')}`)
        return false
      }
    }

    return true
  }, [maxSize, acceptedTypes])

  const processFile = useCallback((selectedFile: File) => {
    if (!validateFile(selectedFile)) return

    setFile(selectedFile)

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }, [validateFile])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }, [processFile])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }, [processFile])

  const clearFile = useCallback(() => {
    setFile(null)
    setPreview(null)
    setProgress(0)
    setError(null)
  }, [])

  const upload = useCallback(async (endpoint: string, fieldName: string = 'file'): Promise<string | null> => {
    if (!file) {
      setError('No file selected')
      return null
    }

    setIsUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append(fieldName, file)

    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(percentCompleted)
            onUploadProgress?.(percentCompleted)
          }
        },
      })

      setIsUploading(false)
      return response.data.url || response.data.id
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Upload failed')
      setIsUploading(false)
      return null
    }
  }, [file, onUploadProgress])

  return {
    file,
    preview,
    progress,
    error,
    isUploading,
    handleFileSelect,
    handleDrop,
    clearFile,
    upload,
  }
}
