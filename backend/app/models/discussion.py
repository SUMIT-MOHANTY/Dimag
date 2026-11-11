"""
Discussion forum models: threads, comments, and votes.
"""
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.course import Course
    from app.models.content import Lesson


class DiscussionThread(Base, TimestampMixin):
    """Discussion thread in a course."""
    
    __tablename__ = "discussion_threads"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    course_id: Mapped[UUID] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    lesson_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("lessons.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    author_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    is_pinned: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    is_locked: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
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
    comments: Mapped[List["DiscussionComment"]] = relationship(
        "DiscussionComment",
        back_populates="thread",
        cascade="all, delete-orphan",
    )


class DiscussionComment(Base, TimestampMixin):
    """Comment/reply in a discussion thread."""
    
    __tablename__ = "discussion_comments"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    thread_id: Mapped[UUID] = mapped_column(
        ForeignKey("discussion_threads.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    author_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    parent_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("discussion_comments.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )
    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
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
    upvote_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    
    # Relationships
    thread: Mapped["DiscussionThread"] = relationship("DiscussionThread", back_populates="comments")
    replies: Mapped[List["DiscussionComment"]] = relationship(
        "DiscussionComment",
        back_populates="parent",
        cascade="all, delete-orphan",
    )
    parent: Mapped[Optional["DiscussionComment"]] = relationship(
        "DiscussionComment",
        remote_side="DiscussionComment.id",
        back_populates="replies",
    )
    upvotes: Mapped[List["CommentUpvote"]] = relationship(
        "CommentUpvote",
        back_populates="comment",
        cascade="all, delete-orphan",
    )


class CommentUpvote(Base, TimestampMixin):
    """Upvote on a comment."""
    
    __tablename__ = "comment_upvotes"
    
    __table_args__ = (
        UniqueConstraint("comment_id", "user_id", name="uq_comment_upvote_comment_user"),
    )
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    comment_id: Mapped[UUID] = mapped_column(
        ForeignKey("discussion_comments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    
    # Relationships
    comment: Mapped["DiscussionComment"] = relationship("DiscussionComment", back_populates="upvotes")
