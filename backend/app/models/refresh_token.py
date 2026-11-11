"""
Refresh token model - re-export from user module for backward compatibility.
"""
from app.models.user import RefreshToken

__all__ = ["RefreshToken"]
