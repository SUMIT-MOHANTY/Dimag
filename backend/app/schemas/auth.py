"""
Authentication-related Pydantic schemas.
"""
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """User registration request."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=1, max_length=255)


class LoginRequest(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response after successful authentication."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Access token expiry in seconds")


class RefreshRequest(BaseModel):
    """Token refresh request."""
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    """Password reset request."""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Password reset confirmation."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)


class EmailVerificationRequest(BaseModel):
    """Email verification request."""
    token: str
