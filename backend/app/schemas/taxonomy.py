"""
Taxonomy-related Pydantic schemas (categories, tags).
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CategoryCreateRequest(BaseModel):
    """Category creation request."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    parent_id: Optional[UUID] = None


class CategoryResponse(BaseModel):
    """Category response model."""
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TagCreateRequest(BaseModel):
    """Tag creation request."""
    name: str = Field(..., min_length=1, max_length=50)


class TagResponse(BaseModel):
    """Tag response model."""
    id: UUID
    name: str
    slug: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
