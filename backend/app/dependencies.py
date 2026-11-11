"""
FastAPI dependency injection utilities.
"""
from typing import Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.constants import UserRole
from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Extract and validate JWT token, returning the current user.
    
    Returns None if no token is provided (for optional auth endpoints).
    Raises UnauthorizedError if token is invalid.
    """
    if not token:
        return None
    
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedError("Invalid token: missing subject")
        
        # Query user from database
        from sqlalchemy import select
        result = await db.execute(select(User).where(User.id == UUID(user_id)))
        user = result.scalar_one_or_none()
        
        if not user:
            raise UnauthorizedError("User not found")
        
        if not user.is_active:
            raise UnauthorizedError("User account is deactivated")
        
        if user.is_deleted:
            raise UnauthorizedError("User account has been deleted")
        
        return user
        
    except UnauthorizedError:
        raise
    except Exception as e:
        raise UnauthorizedError(f"Could not validate credentials: {str(e)}")


async def get_current_active_user(
    user: Optional[User] = Depends(get_current_user),
) -> User:
    """
    Get current active user, requiring authentication.
    
    Raises UnauthorizedError if user is not authenticated.
    """
    if not user:
        raise UnauthorizedError("Authentication required")
    return user


async def get_optional_user(
    user: Optional[User] = Depends(get_current_user),
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise None.
    
    For public endpoints that optionally read auth.
    """
    return user


def require_role(*roles: UserRole):
    """
    Dependency factory for role-based access control.
    
    Usage:
        @router.get("/admin-only")
        async def admin_endpoint(
            user: User = Depends(require_role(UserRole.ADMIN)),
        ):
            ...
    """
    async def role_checker(
        user: User = Depends(get_current_active_user),
    ) -> User:
        if user.role not in [r.value for r in roles]:
            raise ForbiddenError(
                f"Access denied. Required role: {', '.join(r.value for r in roles)}"
            )
        return user
    
    return role_checker


# Common dependency aliases for convenience
require_admin = require_role(UserRole.ADMIN)
require_instructor = require_role(UserRole.INSTRUCTOR, UserRole.ADMIN)
require_student = require_role(UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN)
