"""
Enrollment router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/enrollments", tags=["Enrollments"])


@router.post("", response_model=MessageResponse)
async def create_enrollment():
    """Enroll current user in a course."""
    return {"message": "not implemented"}


@router.get("", response_model=MessageResponse)
async def list_enrollments():
    """List current user's enrollments."""
    return {"message": "not implemented"}


@router.get("/{enrollment_id}", response_model=MessageResponse)
async def get_enrollment(enrollment_id: str):
    """Get enrollment details."""
    return {"message": "not implemented"}


@router.patch("/{enrollment_id}", response_model=MessageResponse)
async def update_enrollment(enrollment_id: str):
    """Update enrollment status."""
    return {"message": "not implemented"}


@router.post("/{enrollment_id}/drop", response_model=MessageResponse)
async def drop_enrollment(enrollment_id: str):
    """Drop an enrollment."""
    return {"message": "not implemented"}


@router.get("/{enrollment_id}/progress", response_model=MessageResponse)
async def get_enrollment_progress(enrollment_id: str):
    """Get enrollment progress details."""
    return {"message": "not implemented"}


@router.get("/course/{course_id}/progress", response_model=MessageResponse)
async def get_course_progress(course_id: str):
    """Get current user's progress in a course."""
    return {"message": "not implemented"}
