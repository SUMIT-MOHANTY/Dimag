"""
Notification models.
"""
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import NotificationChannel, NotificationType
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User


class Notification(Base, TimestampMixin):
    """User notification."""
    
    __tablename__ = "notifications"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    recipient_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    notification_type: Mapped[NotificationType] = mapped_column(
        String(50),
        nullable=False,
    )
    channel: Mapped[NotificationChannel] = mapped_column(
        String(20),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    entity_type: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    entity_id: Mapped[Optional[UUID]] = mapped_column(
        nullable=True,
    )
    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    read_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Relationships
    recipient: Mapped["User"] = relationship("User", back_populates="notifications")


class NotificationPreference(Base, TimestampMixin):
    """User notification preferences."""
    
    __tablename__ = "notification_preferences"
    
    __table_args__ = (
        UniqueConstraint("user_id", "notification_type", name="uq_notification_pref_user_type"),
    )
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    notification_type: Mapped[NotificationType] = mapped_column(
        String(50),
        nullable=False,
    )
    in_app_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    email_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notification_preferences")
