"""
Course review model.
"""
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.course import Course
    from app.models.enrollment import Enrollment


class CourseReview(Base, TimestampMixin):
    """Student review of a course."""
    
    __tablename__ = "course_reviews"
    
    __table_args__ = (
        UniqueConstraint("course_id", "student_id", name="uq_review_course_student"),
        CheckConstraint("rating BETWEEN 1 AND 5", name="ck_review_rating_range"),
    )
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    course_id: Mapped[UUID] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    enrollment_id: Mapped[UUID] = mapped_column(
        ForeignKey("enrollments.id", ondelete="CASCADE"),
        nullable=False,
    )
    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    review_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Relationships
    course: Mapped["Course"] = relationship("Course", back_populates="reviews")
