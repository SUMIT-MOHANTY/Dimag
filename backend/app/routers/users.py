"""
Users router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=MessageResponse)
async def get_current_user():
    """Get current authenticated user profile."""
    return {"message": "not implemented"}


@router.patch("/me", response_model=MessageResponse)
async def update_current_user():
    """Update current user profile."""
    return {"message": "not implemented"}


@router.post("/me/avatar", response_model=MessageResponse)
async def upload_avatar():
    """Upload user avatar image."""
    return {"message": "not implemented"}


@router.delete("/me/avatar", response_model=MessageResponse)
async def delete_avatar():
    """Delete user avatar."""
    return {"message": "not implemented"}


@router.post("/me/change-password", response_model=MessageResponse)
async def change_password():
    """Change user password."""
    return {"message": "not implemented"}


@router.get("/me/notifications", response_model=MessageResponse)
async def get_notifications():
    """Get user notifications."""
    return {"message": "not implemented"}


@router.patch("/me/notifications/{notification_id}/read", response_model=MessageResponse)
async def mark_notification_read(notification_id: str):
    """Mark notification as read."""
    return {"message": "not implemented"}


@router.post("/me/notifications/read-all", response_model=MessageResponse)
async def mark_all_notifications_read():
    """Mark all notifications as read."""
    return {"message": "not implemented"}


@router.get("/me/notification-preferences", response_model=MessageResponse)
async def get_notification_preferences():
    """Get notification preferences."""
    return {"message": "not implemented"}


@router.put("/me/notification-preferences", response_model=MessageResponse)
async def update_notification_preferences():
    """Update notification preferences."""
    return {"message": "not implemented"}
