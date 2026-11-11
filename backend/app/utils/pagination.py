"""
Pagination utilities for API responses.
"""
from typing import Generic, TypeVar

from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import Select

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Pagination query parameters."""

    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")

    @property
    def offset(self) -> int:
        """Calculate SQL offset."""
        return (self.page - 1) * self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response model."""

    items: list[T] = Field(description="List of items")
    total: int = Field(description="Total number of items")
    page: int = Field(description="Current page number")
    page_size: int = Field(description="Items per page")
    total_pages: int = Field(description="Total number of pages")
    has_next: bool = Field(description="Whether there is a next page")
    has_prev: bool = Field(description="Whether there is a previous page")

    @classmethod
    def create(
        cls,
        items: list[T],
        total: int,
        page: int,
        page_size: int,
    ) -> "PaginatedResponse[T]":
        """Create paginated response with calculated fields."""
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        )


async def paginate_query(
    session: AsyncSession,
    query: Select,
    page: int,
    page_size: int,
) -> tuple[list, int]:
    """
    Execute paginated query and return items with total count.
    
    Args:
        session: Database session
        query: SQLAlchemy select query
        page: Page number (1-indexed)
        page_size: Items per page
    
    Returns:
        Tuple of (items list, total count)
    """
    # Get total count
    count_query = query.with_only_columns(func.count())
    total_result = await session.execute(count_query)
    total = total_result.scalar() or 0

    # Get paginated items
    offset = (page - 1) * page_size
    paginated_query = query.offset(offset).limit(page_size)
    result = await session.execute(paginated_query)
    items = result.scalars().all()

    return list(items), total
