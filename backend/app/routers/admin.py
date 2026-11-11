"""
Admin router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/users", response_model=MessageResponse)
async def list_users():
    """List all users (admin only)."""
    return {"message": "not implemented"}


@router.get("/users/{user_id}", response_model=MessageResponse)
async def get_user(user_id: str):
    """Get user details (admin only)."""
    return {"message": "not implemented"}


@router.patch("/users/{user_id}", response_model=MessageResponse)
async def update_user(user_id: str):
    """Update user (admin only)."""
    return {"message": "not implemented"}


@router.delete("/users/{user_id}", response_model=MessageResponse)
async def delete_user(user_id: str):
    """Soft delete user (admin only)."""
    return {"message": "not implemented"}


@router.post("/users/{user_id}/restore", response_model=MessageResponse)
async def restore_user(user_id: str):
    """Restore soft-deleted user (admin only)."""
    return {"message": "not implemented"}


@router.post("/users/{user_id}/role", response_model=MessageResponse)
async def change_user_role(user_id: str):
    """Change user role (admin only)."""
    return {"message": "not implemented"}


@router.get("/courses", response_model=MessageResponse)
async def list_all_courses():
    """List all courses including unpublished (admin only)."""
    return {"message": "not implemented"}


@router.get("/enrollments", response_model=MessageResponse)
async def list_all_enrollments():
    """List all enrollments (admin only)."""
    return {"message": "not implemented"}


@router.get("/audit-logs", response_model=MessageResponse)
async def list_audit_logs():
    """List audit logs (admin only)."""
    return {"message": "not implemented"}


@router.get("/stats", response_model=MessageResponse)
async def get_platform_stats():
    """Get platform statistics (admin only)."""
    return {"message": "not implemented"}


@router.get("/settings", response_model=MessageResponse)
async def list_platform_settings():
    """List platform settings (admin only)."""
    return {"message": "not implemented"}


@router.get("/settings/{key}", response_model=MessageResponse)
async def get_platform_setting(key: str):
    """Get platform setting (admin only)."""
    return {"message": "not implemented"}


@router.put("/settings/{key}", response_model=MessageResponse)
async def update_platform_setting(key: str):
    """Update platform setting (admin only)."""
    return {"message": "not implemented"}
