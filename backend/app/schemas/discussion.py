"""
Discussion-related Pydantic schemas.
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ThreadCreateRequest(BaseModel):
    """Discussion thread creation request."""
    title: str = Field(..., min_length=1, max_length=255)
    body: str = Field(..., min_length=1)
    lesson_id: Optional[UUID] = None


class ThreadResponse(BaseModel):
    """Discussion thread response model."""
    id: UUID
    course_id: UUID
    lesson_id: Optional[UUID] = None
    author_id: UUID
    title: str
    body: str
    is_pinned: bool
    is_locked: bool
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CommentCreateRequest(BaseModel):
    """Comment creation request."""
    body: str = Field(..., min_length=1)
    parent_id: Optional[UUID] = None


class CommentResponse(BaseModel):
    """Comment response model."""
    id: UUID
    thread_id: UUID
    author_id: UUID
    parent_id: Optional[UUID] = None
    body: str
    is_deleted: bool
    upvote_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
