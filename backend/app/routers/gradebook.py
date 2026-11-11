"""
Gradebook router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/gradebook", tags=["Gradebook"])


@router.get("/courses/{course_id}/grades", response_model=MessageResponse)
async def list_course_grades(course_id: str):
    """List all grades for a course (instructor only)."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/students/{student_id}/grades", response_model=MessageResponse)
async def get_student_course_grades(course_id: str, student_id: str):
    """Get grades for a specific student in a course."""
    return {"message": "not implemented"}


@router.get("/my-grades", response_model=MessageResponse)
async def list_my_grades():
    """List current user's grades."""
    return {"message": "not implemented"}


@router.get("/entries/{entry_id}", response_model=MessageResponse)
async def get_gradebook_entry(entry_id: str):
    """Get gradebook entry details."""
    return {"message": "not implemented"}


@router.patch("/entries/{entry_id}", response_model=MessageResponse)
async def update_gradebook_entry(entry_id: str):
    """Update gradebook entry (instructor only)."""
    return {"message": "not implemented"}


@router.post("/entries/{entry_id}/override", response_model=MessageResponse)
async def override_grade(entry_id: str):
    """Manually override a grade (instructor only)."""
    return {"message": "not implemented"}


@router.get("/courses/{course_id}/export", response_model=MessageResponse)
async def export_course_grades(course_id: str):
    """Export course grades as CSV (instructor only)."""
    return {"message": "not implemented"}
