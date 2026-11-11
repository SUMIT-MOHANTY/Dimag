import api from '@/lib/api'
import type { 
  DiscussionThread, 
  DiscussionComment,
  ThreadCreatePayload,
  CommentCreatePayload,
  ThreadUpdatePayload
} from '@/types/discussion'
import type { PaginatedResponse, PaginationParams } from '@/types/common'

export const discussionsApi = {
  listThreads: async (courseId: string, params?: PaginationParams): Promise<PaginatedResponse<DiscussionThread>> => {
    const response = await api.get(`/discussions/courses/${courseId}/threads`, { params })
    return response.data
  },

  createThread: async (payload: ThreadCreatePayload): Promise<DiscussionThread> => {
    const response = await api.post('/discussions/threads', payload)
    return response.data
  },

  getThread: async (threadId: string): Promise<DiscussionThread> => {
    const response = await api.get(`/discussions/threads/${threadId}`)
    return response.data
  },

  updateThread: async (threadId: string, payload: ThreadUpdatePayload): Promise<DiscussionThread> => {
    const response = await api.patch(`/discussions/threads/${threadId}`, payload)
    return response.data
  },

  deleteThread: async (threadId: string): Promise<void> => {
    await api.delete(`/discussions/threads/${threadId}`)
  },

  pinThread: async (threadId: string, pinned: boolean): Promise<DiscussionThread> => {
    const response = await api.post(`/discussions/threads/${threadId}/pin`, { pinned })
    return response.data
  },

  lockThread: async (threadId: string, locked: boolean): Promise<DiscussionThread> => {
    const response = await api.post(`/discussions/threads/${threadId}/lock`, { locked })
    return response.data
  },

  // Comments
  listComments: async (threadId: string, params?: PaginationParams): Promise<PaginatedResponse<DiscussionComment>> => {
    const response = await api.get(`/discussions/threads/${threadId}/comments`, { params })
    return response.data
  },

  createComment: async (payload: CommentCreatePayload): Promise<DiscussionComment> => {
    const response = await api.post('/discussions/comments', payload)
    return response.data
  },

  updateComment: async (commentId: string, content: string): Promise<DiscussionComment> => {
    const response = await api.patch(`/discussions/comments/${commentId}`, { content })
    return response.data
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/discussions/comments/${commentId}`)
  },

  upvoteComment: async (commentId: string): Promise<DiscussionComment> => {
    const response = await api.post(`/discussions/comments/${commentId}/upvote`)
    return response.data
  },

  acceptAnswer: async (commentId: string): Promise<DiscussionComment> => {
    const response = await api.post(`/discussions/comments/${commentId}/accept`)
    return response.data
  },
}
