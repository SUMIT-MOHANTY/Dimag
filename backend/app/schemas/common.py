"""
Common Pydantic schemas used across the application.
"""
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str


class ErrorDetail(BaseModel):
    """Error detail for field-level validation errors."""
    field: Optional[str] = None
    message: str


class ErrorResponse(BaseModel):
    """Standardized error response."""
    error: str
    message: str
    details: Optional[List[ErrorDetail]] = None


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response wrapper."""
    items: List[T]
    total: int = Field(..., description="Total number of items")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Number of items per page")
    total_pages: int = Field(..., description="Total number of pages")
    has_next: bool = Field(..., description="Whether there is a next page")
    has_prev: bool = Field(..., description="Whether there is a previous page")
