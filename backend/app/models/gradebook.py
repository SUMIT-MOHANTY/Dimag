"""
Gradebook model for storing grades.
"""
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.course import Course
    from app.models.assessment import QuizSubmission


class GradebookEntry(Base, TimestampMixin):
    """Gradebook entry for a student's assessment."""
    
    __tablename__ = "gradebook_entries"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    course_id: Mapped[UUID] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    quiz_submission_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("quiz_submissions.id", ondelete="CASCADE"),
        nullable=True,
    )
    raw_score: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
    )
    adjusted_score: Mapped[Optional[float]] = mapped_column(
        Numeric(5, 2),
        nullable=True,
    )
    letter_grade: Mapped[Optional[str]] = mapped_column(
        String(5),
        nullable=True,
    )
    grader_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    instructor_notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    is_manually_overridden: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    graded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    
    # Relationships
    student: Mapped["User"] = relationship(
        "User",
        foreign_keys=[student_id],
        back_populates="student_grades",
    )
    course: Mapped["Course"] = relationship("Course")
    grader: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[grader_id],
    )
