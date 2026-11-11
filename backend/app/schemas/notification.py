"""
Notification-related Pydantic schemas.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.core.constants import NotificationChannel, NotificationType


class NotificationResponse(BaseModel):
    """Notification response model."""
    id: UUID
    recipient_id: UUID
    notification_type: NotificationType
    channel: NotificationChannel
    title: str
    body: str
    entity_type: Optional[str] = None
    entity_id: Optional[UUID] = None
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NotificationPreferenceUpdate(BaseModel):
    """Notification preference update request."""
    notification_type: NotificationType
    in_app_enabled: bool = True
    email_enabled: bool = True
