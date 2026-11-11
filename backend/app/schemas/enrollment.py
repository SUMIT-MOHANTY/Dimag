"""
Enrollment-related Pydantic schemas.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.core.constants import EnrollmentStatus


class EnrollmentResponse(BaseModel):
    """Enrollment response model."""
    id: UUID
    student_id: UUID
    course_id: UUID
    status: EnrollmentStatus
    completion_percentage: Decimal
    enrolled_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    dropped_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LessonProgressResponse(BaseModel):
    """Lesson progress response model."""
    id: UUID
    enrollment_id: UUID
    lesson_id: UUID
    is_completed: bool
    completed_at: Optional[datetime] = None
    watch_time_seconds: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EnrollmentProgressResponse(BaseModel):
    """Enrollment progress with lesson details."""
    enrollment: EnrollmentResponse
    lesson_progress: List[LessonProgressResponse]
    total_lessons: int
    completed_lessons: int
