"""
Idempotency key model for preventing duplicate requests.

This model stores idempotency keys to ensure that identical requests
are not processed multiple times, which is important for payment operations
and other sensitive actions.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class IdempotencyKey(Base, TimestampMixin):
    """
    Idempotency key storage for preventing duplicate requests.
    
    When a client sends a request with an idempotency key, the server
    checks if this key has been used before. If so, it returns the
    cached response instead of reprocessing the request.
    """
    
    __tablename__ = "idempotency_keys"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    idempotency_key: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="The idempotency key provided by the client",
    )
    user_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
        comment="User who made the request (if authenticated)",
    )
    request_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="API path that was called",
    )
    request_method: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        comment="HTTP method used",
    )
    request_body_hash: Mapped[Optional[str]] = mapped_column(
        String(64),
        nullable=True,
        comment="SHA-256 hash of the request body for verification",
    )
    response_status: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="HTTP status code of the response",
    )
    response_body: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        comment="Cached response body",
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        comment="When this idempotency key expires and can be cleaned up",
    )
    
    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="idempotency_keys")


# Add relationship to User model (forward reference)
# This is handled via back_populates in the User model if needed
