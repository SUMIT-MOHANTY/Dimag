"""
SQLAlchemy declarative base and timestamp mixin.
"""
from datetime import datetime
from typing import Any
from uuid import uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.types import String


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    
    # Use appropriate UUID type based on dialect
    type_annotation_map = {
        # UUID will be handled per-model for cross-database compatibility
    }


class TimestampMixin:
    """Mixin that adds created_at and updated_at columns."""
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )


def generate_uuid() -> str:
    """Generate a UUID string."""
    return str(uuid4())
