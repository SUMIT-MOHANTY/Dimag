"""
Course model and related taxonomy tables.
"""
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import CourseStatus
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.content import Section
    from app.models.enrollment import Enrollment
    from app.models.assessment import Quiz
    from app.models.review import CourseReview


# Association tables for many-to-many relationships
course_tag_map = Base.metadata.tables.get("course_tag_map") or None
if course_tag_map is None:
    from sqlalchemy import Table, Column
    course_tag_map = Table(
        "course_tag_map",
        Base.metadata,
        Column("course_id", ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True),
        Column("tag_id", ForeignKey("course_tags.id", ondelete="CASCADE"), primary_key=True),
    )

course_category_map = Base.metadata.tables.get("course_category_map") or None
if course_category_map is None:
    from sqlalchemy import Table, Column
    course_category_map = Table(
        "course_category_map",
        Base.metadata,
        Column("course_id", ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True),
        Column("category_id", ForeignKey("course_categories.id", ondelete="CASCADE"), primary_key=True),
    )


class CourseCategory(Base, TimestampMixin):
    """Course category taxonomy."""
    
    __tablename__ = "course_categories"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )
    slug: Mapped[str] = mapped_column(
        String(200),
        unique=True,
        nullable=False,
        index=True,
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    parent_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("course_categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    
    # Relationships
    parent: Mapped[Optional["CourseCategory"]] = relationship(
        "CourseCategory",
        remote_side="CourseCategory.id",
        back_populates="children",
    )
    children: Mapped[List["CourseCategory"]] = relationship(
        "CourseCategory",
        back_populates="parent",
    )
    courses: Mapped[List["Course"]] = relationship(
        "Course",
        secondary="course_category_map",
        back_populates="categories",
    )


class CourseTag(Base, TimestampMixin):
    """Course tag taxonomy."""
    
    __tablename__ = "course_tags"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )
    
    # Relationships
    courses: Mapped[List["Course"]] = relationship(
        "Course",
        secondary="course_tag_map",
        back_populates="tags",
    )


class Course(Base, TimestampMixin):
    """Course model."""
    
    __tablename__ = "courses"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    slug: Mapped[str] = mapped_column(
        String(200),
        unique=True,
        nullable=False,
        index=True,
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    short_description: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    thumbnail_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    instructor_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status: Mapped[CourseStatus] = mapped_column(
        String(20),
        default=CourseStatus.DRAFT,
        nullable=False,
        index=True,
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
    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0.00,
        nullable=False,
    )
    is_free: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    language: Mapped[str] = mapped_column(
        String(10),
        default="en",
        nullable=False,
    )
    level: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    avg_rating: Mapped[float] = mapped_column(
        Numeric(3, 2),
        default=0.00,
        nullable=False,
    )
    rating_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    enrollment_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    
    # Relationships
    instructor: Mapped["User"] = relationship("User", back_populates="courses_created")
    sections: Mapped[List["Section"]] = relationship(
        "Section",
        back_populates="course",
        cascade="all, delete-orphan",
    )
    tags: Mapped[List["CourseTag"]] = relationship(
        "CourseTag",
        secondary="course_tag_map",
        back_populates="courses",
    )
    categories: Mapped[List["CourseCategory"]] = relationship(
        "CourseCategory",
        secondary="course_category_map",
        back_populates="courses",
    )
    enrollments: Mapped[List["Enrollment"]] = relationship(
        "Enrollment",
        back_populates="course",
        cascade="all, delete-orphan",
    )
    reviews: Mapped[List["CourseReview"]] = relationship(
        "CourseReview",
        back_populates="course",
        cascade="all, delete-orphan",
    )
    quizzes: Mapped[List["Quiz"]] = relationship(
        "Quiz",
        back_populates="course",
        cascade="all, delete-orphan",
    )
