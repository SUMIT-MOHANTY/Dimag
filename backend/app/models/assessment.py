"""
Assessment models: quizzes, questions, submissions, and certificates.
"""
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import GradingStatus, QuestionType
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.course import Course
    from app.models.content import Lesson
    from app.models.enrollment import Enrollment


class Quiz(Base, TimestampMixin):
    """Quiz/assessment model."""
    
    __tablename__ = "quizzes"
    
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
        ForeignKey("lessons.id", ondelete="SET NULL"),
        nullable=True,
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
    time_limit_seconds: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    max_attempts: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )
    passing_score: Mapped[float] = mapped_column(
        Numeric(5, 2),
        default=70.00,
        nullable=False,
    )
    shuffle_questions: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    shuffle_answers: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    show_answers_after_submission: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    
    # Relationships
    course: Mapped["Course"] = relationship("Course", back_populates="quizzes")
    questions: Mapped[List["Question"]] = relationship(
        "Question",
        back_populates="quiz",
        cascade="all, delete-orphan",
        order_by="Question.position",
    )
    submissions: Mapped[List["QuizSubmission"]] = relationship(
        "QuizSubmission",
        back_populates="quiz",
        cascade="all, delete-orphan",
    )


class Question(Base, TimestampMixin):
    """Quiz question model."""
    
    __tablename__ = "questions"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    quiz_id: Mapped[UUID] = mapped_column(
        ForeignKey("quizzes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    question_type: Mapped[QuestionType] = mapped_column(
        String(20),
        nullable=False,
    )
    media_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    points: Mapped[float] = mapped_column(
        Numeric(5, 2),
        default=1.00,
        nullable=False,
    )
    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Relationships
    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="questions")
    answer_options: Mapped[List["AnswerOption"]] = relationship(
        "AnswerOption",
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="AnswerOption.position",
    )


class AnswerOption(Base, TimestampMixin):
    """Answer options for multiple choice questions."""
    
    __tablename__ = "answer_options"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    question_id: Mapped[UUID] = mapped_column(
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    option_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    explanation: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    
    # Relationships
    question: Mapped["Question"] = relationship("Question", back_populates="answer_options")


class QuizSubmission(Base, TimestampMixin):
    """Student quiz submission."""
    
    __tablename__ = "quiz_submissions"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    quiz_id: Mapped[UUID] = mapped_column(
        ForeignKey("quizzes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    student_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    attempt_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    score: Mapped[Optional[float]] = mapped_column(
        Numeric(5, 2),
        nullable=True,
    )
    passed: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True,
    )
    grading_status: Mapped[GradingStatus] = mapped_column(
        String(20),
        default=GradingStatus.PENDING,
        nullable=False,
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    submitted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    time_spent_seconds: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    
    # Relationships
    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="submissions")
    answers: Mapped[List["SubmissionAnswer"]] = relationship(
        "SubmissionAnswer",
        back_populates="submission",
        cascade="all, delete-orphan",
    )


class SubmissionAnswer(Base, TimestampMixin):
    """Individual answers within a submission."""
    
    __tablename__ = "submission_answers"
    
    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )
    submission_id: Mapped[UUID] = mapped_column(
        ForeignKey("quiz_submissions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id: Mapped[UUID] = mapped_column(
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    selected_option_id: Mapped[Optional[UUID]] = mapped_column(
        ForeignKey("answer_options.id", ondelete="SET NULL"),
        nullable=True,
    )
    text_answer: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    is_correct: Mapped[Optional[bool]] = mapped_column(
        Boolean,
        nullable=True,
    )
    points_earned: Mapped[Optional[float]] = mapped_column(
        Numeric(5, 2),
        nullable=True,
    )
    
    # Relationships
    submission: Mapped["QuizSubmission"] = relationship("QuizSubmission", back_populates="answers")


class Certificate(Base, TimestampMixin):
    """Course completion certificate."""
    
    __tablename__ = "certificates"
    
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
    )
    completion_id: Mapped[UUID] = mapped_column(
        ForeignKey("course_completions.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    verification_code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )
    certificate_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
