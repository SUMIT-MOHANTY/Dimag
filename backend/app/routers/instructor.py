"""
Instructor dashboard router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/instructor", tags=["Instructor"])


@router.get("/dashboard", response_model=MessageResponse)
async def get_dashboard():
    """Get instructor dashboard statistics."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/stats", response_model=MessageResponse)
async def get_course_stats(course_id: str):
    """Get statistics for a specific course."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/students", response_model=MessageResponse)
async def list_course_students(course_id: str):
    """List students enrolled in a course."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/enrollments", response_model=MessageResponse)
async def list_course_enrollments(course_id: str):
    """List enrollments for a course."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/progress", response_model=MessageResponse)
async def get_course_progress_stats(course_id: str):
    """Get progress statistics for a course."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/quizzes/{quiz_id}/submissions", response_model=MessageResponse)
async def list_quiz_submissions(course_id: str, quiz_id: str):
    """List all submissions for a quiz."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/reviews", response_model=MessageResponse)
async def list_course_reviews(course_id: str):
    """List reviews for a course."""
    return {"message": "not implemented"}


@router.get("/earnings", response_model=MessageResponse)
async def get_earnings():
    """Get instructor earnings summary."""
    return {"message": "not implemented"}


@router.get("/earnings/courses/{course_id}", response_model=MessageResponse)
async def get_course_earnings(course_id: str):
    """Get earnings for a specific course."""
    return {"message": "not implemented"}
