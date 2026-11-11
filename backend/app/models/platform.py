"""
Platform settings and audit logging models.
"""
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class PlatformSetting(Base, TimestampMixin):
    """Platform-wide configuration settings."""
    
    __tablename__ = "platform_settings"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    key: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )
    value: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    value_type: Mapped[str] = mapped_column(
        String(20),
        default="string",
        nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    updated_by_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    
    # Relationships
    updated_by: Mapped[Optional["User"]] = relationship("User")


class AuditLog(Base, TimestampMixin):
    """Audit log for tracking system changes."""
    
    __tablename__ = "audit_logs"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    entity_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )
    entity_id: Mapped[Optional[UUID]] = mapped_column(
        nullable=True,
        index=True,
    )
    old_values: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
    )
    new_values: Mapped[Optional[dict]] = mapped_column(
        JSON,
        nullable=True,
    )
    ip_address: Mapped[Optional[str]] = mapped_column(
        String(45),
        nullable=True,
    )
    user_agent: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    
    # Relationships
    user: Mapped[Optional["User"]] = relationship("User")
