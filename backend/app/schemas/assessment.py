"""
Assessment-related Pydantic schemas (quizzes, questions, submissions).
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.core.constants import GradingStatus, QuestionType


class AnswerOptionRequest(BaseModel):
    """Answer option for question creation."""
    option_text: str
    is_correct: bool = False
    explanation: Optional[str] = None
    position: int = 0


class QuestionCreateRequest(BaseModel):
    """Question creation request."""
    question_text: str
    question_type: QuestionType
    media_url: Optional[str] = None
    points: Decimal = Field(default=Decimal("1.00"), ge=0)
    position: int = 0
    answer_options: List[AnswerOptionRequest] = []


class QuestionResponse(BaseModel):
    """Question response model."""
    id: UUID
    quiz_id: UUID
    question_text: str
    question_type: QuestionType
    media_url: Optional[str] = None
    points: Decimal
    position: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuizCreateRequest(BaseModel):
    """Quiz creation request."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    time_limit_seconds: Optional[int] = Field(None, ge=0)
    max_attempts: int = Field(default=1, ge=1)
    passing_score: Decimal = Field(default=Decimal("70.00"), ge=0, le=100)
    shuffle_questions: bool = False
    shuffle_answers: bool = False
    show_answers_after_submission: bool = True
    is_published: bool = False


class QuizResponse(BaseModel):
    """Quiz response model."""
    id: UUID
    course_id: UUID
    lesson_id: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    time_limit_seconds: Optional[int] = None
    max_attempts: int
    passing_score: Decimal
    shuffle_questions: bool
    shuffle_answers: bool
    show_answers_after_submission: bool
    is_published: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SubmissionCreateRequest(BaseModel):
    """Quiz submission creation request."""
    answers: List["AnswerSubmission"]


class AnswerSubmission(BaseModel):
    """Single answer submission."""
    question_id: UUID
    selected_option_id: Optional[UUID] = None
    text_answer: Optional[str] = None


class SubmissionResponse(BaseModel):
    """Quiz submission response model."""
    id: UUID
    quiz_id: UUID
    student_id: UUID
    attempt_number: int
    score: Optional[Decimal] = None
    passed: Optional[bool] = None
    grading_status: GradingStatus
    started_at: datetime
    submitted_at: Optional[datetime] = None
    time_spent_seconds: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuizResultResponse(BaseModel):
    """Quiz result with answers."""
    submission: SubmissionResponse
    answers: List["AnswerResponse"]
    total_questions: int
    correct_answers: int


class AnswerResponse(BaseModel):
    """Answer response with correctness."""
    id: UUID
    question_id: UUID
    selected_option_id: Optional[UUID] = None
    text_answer: Optional[str] = None
    is_correct: Optional[bool] = None
    points_earned: Optional[Decimal] = None
