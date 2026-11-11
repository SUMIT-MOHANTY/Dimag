"""
User-related Pydantic schemas.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.core.constants import UserRole


class UserResponse(BaseModel):
    """User response model."""
    id: UUID
    email: EmailStr
    full_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    role: UserRole
    is_active: bool
    is_email_verified: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    """User profile update request."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    bio: Optional[str] = Field(None, max_length=2000)


class PasswordChangeRequest(BaseModel):
    """Password change request."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)


class AvatarUploadResponse(BaseModel):
    """Avatar upload response."""
    avatar_url: str
