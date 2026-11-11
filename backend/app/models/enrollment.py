"""
Enrollment and progress tracking models.
"""
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import EnrollmentStatus
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.course import Course
    from app.models.content import Lesson


class Enrollment(Base, TimestampMixin):
    """Student enrollment in a course."""
    
    __tablename__ = "enrollments"
    
    __table_args__ = (
        UniqueConstraint("student_id", "course_id", name="uq_enrollment_student_course"),
    )
    
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
    status: Mapped[EnrollmentStatus] = mapped_column(
        String(20),
        default=EnrollmentStatus.PENDING,
        nullable=False,
    )
    completion_percentage: Mapped[float] = mapped_column(
        Numeric(5, 2),
        default=0.00,
        nullable=False,
    )
    enrolled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    dropped_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Relationships
    student: Mapped["User"] = relationship("User", back_populates="enrollments")
    course: Mapped["Course"] = relationship("Course", back_populates="enrollments")
    lesson_progress: Mapped[list["LessonProgress"]] = relationship(
        "LessonProgress",
        back_populates="enrollment",
        cascade="all, delete-orphan",
    )
    completion: Mapped[Optional["CourseCompletion"]] = relationship(
        "CourseCompletion",
        back_populates="enrollment",
        uselist=False,
        cascade="all, delete-orphan",
    )


class LessonProgress(Base, TimestampMixin):
    """Progress tracking for individual lessons."""
    
    __tablename__ = "lesson_progress"
    
    __table_args__ = (
        UniqueConstraint("enrollment_id", "lesson_id", name="uq_lesson_progress_enrollment_lesson"),
    )
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    enrollment_id: Mapped[UUID] = mapped_column(
        ForeignKey("enrollments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    lesson_id: Mapped[UUID] = mapped_column(
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    is_completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    watch_time_seconds: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    
    # Relationships
    enrollment: Mapped["Enrollment"] = relationship("Enrollment", back_populates="lesson_progress")
    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="progress_records")


class CourseCompletion(Base, TimestampMixin):
    """Records when a student completes a course."""
    
    __tablename__ = "course_completions"
    
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
    enrollment_id: Mapped[UUID] = mapped_column(
        ForeignKey("enrollments.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    
    # Relationships
    enrollment: Mapped["Enrollment"] = relationship("Enrollment", back_populates="completion")
