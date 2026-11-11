"""
Content-related Pydantic schemas (sections, lessons, attachments).
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.constants import ContentType


class SectionCreateRequest(BaseModel):
    """Section creation request."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    position: int = Field(default=0, ge=0)


class SectionResponse(BaseModel):
    """Section response model."""
    id: UUID
    course_id: UUID
    title: str
    description: Optional[str] = None
    position: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LessonCreateRequest(BaseModel):
    """Lesson creation request."""
    title: str = Field(..., min_length=1, max_length=255)
    content_type: ContentType
    text_content: Optional[str] = None
    video_url: Optional[str] = Field(None, max_length=500)
    video_provider: Optional[str] = Field(None, max_length=50)
    video_duration_seconds: Optional[int] = Field(None, ge=0)
    position: int = Field(default=0, ge=0)
    is_preview: bool = False
    is_published: bool = True


class LessonResponse(BaseModel):
    """Lesson response model."""
    id: UUID
    section_id: UUID
    title: str
    content_type: ContentType
    text_content: Optional[str] = None
    video_url: Optional[str] = None
    video_provider: Optional[str] = None
    video_duration_seconds: Optional[int] = None
    position: int
    is_preview: bool
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AttachmentResponse(BaseModel):
    """Lesson attachment response model."""
    id: UUID
    lesson_id: UUID
    file_name: str
    file_url: str
    file_size_bytes: Optional[int] = None
    mime_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
