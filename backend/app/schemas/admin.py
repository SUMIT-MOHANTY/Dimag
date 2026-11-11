"""
Admin-related Pydantic schemas.
"""
from datetime import datetime
from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.constants import UserRole


class UserAdminResponse(BaseModel):
    """User admin view response model."""
    id: UUID
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    is_email_verified: bool
    is_deleted: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserAdminUpdateRequest(BaseModel):
    """User admin update request."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_email_verified: Optional[bool] = None


class PlatformSettingResponse(BaseModel):
    """Platform setting response model."""
    id: UUID
    key: str
    value: str
    value_type: str
    description: Optional[str] = None
    updated_by: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PlatformSettingUpdateRequest(BaseModel):
    """Platform setting update request."""
    value: str
    value_type: Optional[str] = None
    description: Optional[str] = None


class AuditLogResponse(BaseModel):
    """Audit log entry response model."""
    id: UUID
    user_id: Optional[UUID] = None
    action: str
    entity_type: str
    entity_id: Optional[UUID] = None
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PlatformStatsResponse(BaseModel):
    """Platform statistics response."""
    total_users: int
    total_courses: int
    total_enrollments: int
    total_completions: int
    active_users_today: int
    new_users_today: int
    new_enrollments_today: int
    average_course_rating: float
