"""
Content router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/content", tags=["Content"])


@router.get("/courses/{course_id}/sections", response_model=MessageResponse)
async def list_sections(course_id: str):
    """List all sections in a course."""
    return {"message": "not implemented"}


@router.post("/courses/{course_id}/sections", response_model=MessageResponse)
async def create_section(course_id: str):
    """Create a new section in a course."""
    return {"message": "not implemented"}


@router.get("/sections/{section_id}", response_model=MessageResponse)
async def get_section(section_id: str):
    """Get section details."""
    return {"message": "not implemented"}


@router.patch("/sections/{section_id}", response_model=MessageResponse)
async def update_section(section_id: str):
    """Update section details."""
    return {"message": "not implemented"}


@router.delete("/sections/{section_id}", response_model=MessageResponse)
async def delete_section(section_id: str):
    """Delete a section."""
    return {"message": "not implemented"}


@router.get("/sections/{section_id}/lessons", response_model=MessageResponse)
async def list_lessons(section_id: str):
    """List all lessons in a section."""
    return {"message": "not implemented"}


@router.post("/sections/{section_id}/lessons", response_model=MessageResponse)
async def create_lesson(section_id: str):
    """Create a new lesson in a section."""
    return {"message": "not implemented"}


@router.get("/lessons/{lesson_id}", response_model=MessageResponse)
async def get_lesson(lesson_id: str):
    """Get lesson details."""
    return {"message": "not implemented"}


@router.patch("/lessons/{lesson_id}", response_model=MessageResponse)
async def update_lesson(lesson_id: str):
    """Update lesson details."""
    return {"message": "not implemented"}


@router.delete("/lessons/{lesson_id}", response_model=MessageResponse)
async def delete_lesson(lesson_id: str):
    """Delete a lesson."""
    return {"message": "not implemented"}


@router.post("/lessons/{lesson_id}/complete", response_model=MessageResponse)
async def mark_lesson_complete(lesson_id: str):
    """Mark lesson as completed for current user."""
    return {"message": "not implemented"}


@router.get("/lessons/{lesson_id}/attachments", response_model=MessageResponse)
async def list_attachments(lesson_id: str):
    """List attachments for a lesson."""
    return {"message": "not implemented"}


@router.post("/lessons/{lesson_id}/attachments", response_model=MessageResponse)
async def create_attachment(lesson_id: str):
    """Add attachment to a lesson."""
    return {"message": "not implemented"}


@router.delete("/attachments/{attachment_id}", response_model=MessageResponse)
async def delete_attachment(attachment_id: str):
    """Delete an attachment."""
    return {"message": "not implemented"}
