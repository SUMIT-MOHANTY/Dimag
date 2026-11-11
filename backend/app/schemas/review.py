"""
Review-related Pydantic schemas.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ReviewCreateRequest(BaseModel):
    """Course review creation request."""
    rating: int = Field(..., ge=1, le=5)
    review_text: Optional[str] = Field(None, max_length=2000)


class ReviewResponse(BaseModel):
    """Course review response model."""
    id: UUID
    course_id: UUID
    student_id: UUID
    enrollment_id: UUID
    rating: int
    review_text: Optional[str] = None
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
