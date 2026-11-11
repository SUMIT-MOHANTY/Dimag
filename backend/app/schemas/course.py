"""
Course-related Pydantic schemas.
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.constants import CourseStatus


class CourseCreateRequest(BaseModel):
    """Course creation request."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    price: Decimal = Field(default=Decimal("0.00"), ge=0)
    is_free: bool = True
    language: str = Field(default="en", max_length=10)
    level: Optional[str] = Field(None, max_length=20)
    category_ids: List[UUID] = []
    tag_ids: List[UUID] = []


class CourseUpdateRequest(BaseModel):
    """Course update request."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = Field(None, max_length=500)
    price: Optional[Decimal] = Field(None, ge=0)
    is_free: Optional[bool] = None
    language: Optional[str] = Field(None, max_length=10)
    level: Optional[str] = Field(None, max_length=20)
    category_ids: Optional[List[UUID]] = None
    tag_ids: Optional[List[UUID]] = None


class CourseResponse(BaseModel):
    """Course response model."""
    id: UUID
    title: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    instructor_id: UUID
    status: CourseStatus
    price: Decimal
    is_free: bool
    language: str
    level: Optional[str] = None
    avg_rating: Decimal
    rating_count: int
    enrollment_count: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CourseListResponse(BaseModel):
    """Course list item response."""
    id: UUID
    title: str
    slug: str
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    instructor_name: str
    status: CourseStatus
    price: Decimal
    is_free: bool
    avg_rating: Decimal
    enrollment_count: int
    created_at: datetime


class CoursePublishRequest(BaseModel):
    """Course publish request."""
    pass
