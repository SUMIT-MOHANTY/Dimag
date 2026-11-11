"""
Token blacklist model - re-export from user module for backward compatibility.
"""
from app.models.user import TokenBlacklist

__all__ = ["TokenBlacklist"]
