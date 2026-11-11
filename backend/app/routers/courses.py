"""
Courses router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/courses", tags=["Courses"])


@router.get("", response_model=MessageResponse)
async def list_courses():
    """List all published courses with pagination."""
    return {"message": "not implemented"}


@router.post("", response_model=MessageResponse)
async def create_course():
    """Create a new course (instructor only)."""
    return {"message": "not implemented"}


@router.get("/my-courses", response_model=MessageResponse)
async def list_my_courses():
    """List courses created by current instructor."""
    return {"message": "not implemented"}


@router.get("/enrolled", response_model=MessageResponse)
async def list_enrolled_courses():
    """List courses current user is enrolled in."""
    return {"message": "not implemented"}


@router.get("/{course_id}", response_model=MessageResponse)
async def get_course(course_id: str):
    """Get course details by ID."""
    return {"message": "not implemented"}


@router.patch("/{course_id}", response_model=MessageResponse)
async def update_course(course_id: str):
    """Update course details."""
    return {"message": "not implemented"}


@router.delete("/{course_id}", response_model=MessageResponse)
async def delete_course(course_id: str):
    """Soft delete a course."""
    return {"message": "not implemented"}


@router.post("/{course_id}/publish", response_model=MessageResponse)
async def publish_course(course_id: str):
    """Publish a draft course."""
    return {"message": "not implemented"}


@router.post("/{course_id}/archive", response_model=MessageResponse)
async def archive_course(course_id: str):
    """Archive a published course."""
    return {"message": "not implemented"}


@router.get("/{course_id}/reviews", response_model=MessageResponse)
async def get_course_reviews(course_id: str):
    """Get reviews for a course."""
    return {"message": "not implemented"}


@router.post("/{course_id}/reviews", response_model=MessageResponse)
async def create_course_review(course_id: str):
    """Create a review for a course."""
    return {"message": "not implemented"}
