export interface DiscussionThread {
  id: string
  courseId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  title: string
  content: string
  isPinned: boolean
  isLocked: boolean
  upvoteCount: number
  commentCount: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface DiscussionComment {
  id: string
  threadId: string
  parentId?: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  upvoteCount: number
  isAccepted: boolean
  replies: DiscussionComment[]
  createdAt: string
  updatedAt: string
}

export interface CommentUpvote {
  commentId: string
  userId: string
  createdAt: string
}

export interface ThreadCreatePayload {
  courseId: string
  title: string
  content: string
  tags?: string[]
}

export interface CommentCreatePayload {
  threadId: string
  parentId?: string
  content: string
}

export interface ThreadUpdatePayload {
  title?: string
  content?: string
  tags?: string[]
}

export interface CommentUpdatePayload {
  content: string
}
