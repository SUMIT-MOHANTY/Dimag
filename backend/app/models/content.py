"""
Content models: sections, lessons, and attachments.
"""
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import ContentType
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.enrollment import LessonProgress


class Section(Base, TimestampMixin):
    """Course section (chapter/module)."""
    
    __tablename__ = "sections"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    course_id: Mapped[UUID] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Relationships
    course: Mapped["Course"] = relationship("Course", back_populates="sections")
    lessons: Mapped[List["Lesson"]] = relationship(
        "Lesson",
        back_populates="section",
        cascade="all, delete-orphan",
        order_by="Lesson.position",
    )


class Lesson(Base, TimestampMixin):
    """Lesson within a section."""
    
    __tablename__ = "lessons"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    section_id: Mapped[UUID] = mapped_column(
        ForeignKey("sections.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    content_type: Mapped[ContentType] = mapped_column(
        String(20),
        nullable=False,
    )
    text_content: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    video_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    video_provider: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    video_duration_seconds: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    is_preview: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    
    # Relationships
    section: Mapped["Section"] = relationship("Section", back_populates="lessons")
    attachments: Mapped[List["LessonAttachment"]] = relationship(
        "LessonAttachment",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )
    progress_records: Mapped[List["LessonProgress"]] = relationship(
        "LessonProgress",
        back_populates="lesson",
        cascade="all, delete-orphan",
    )


class LessonAttachment(Base, TimestampMixin):
    """File attachments for lessons."""
    
    __tablename__ = "lesson_attachments"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    lesson_id: Mapped[UUID] = mapped_column(
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    file_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    file_size_bytes: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    mime_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )
    
    # Relationships
    lesson: Mapped["Lesson"] = relationship("Lesson", back_populates="attachments")
