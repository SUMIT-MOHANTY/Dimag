"""
Gradebook-related Pydantic schemas.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class GradebookEntryResponse(BaseModel):
    """Gradebook entry response model."""
    id: UUID
    student_id: UUID
    course_id: UUID
    quiz_submission_id: Optional[UUID] = None
    raw_score: Decimal
    adjusted_score: Optional[Decimal] = None
    letter_grade: Optional[str] = None
    grader_id: Optional[UUID] = None
    instructor_notes: Optional[str] = None
    is_manually_overridden: bool
    graded_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class GradeOverrideRequest(BaseModel):
    """Grade override request."""
    adjusted_score: Decimal
    letter_grade: Optional[str] = None
    instructor_notes: Optional[str] = None
