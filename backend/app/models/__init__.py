"""
ORM models package.
Re-exports all models for Alembic and other consumers.
"""
from app.db.base import Base

# Import all models to register them with SQLAlchemy
from app.models.user import User, RefreshToken, TokenBlacklist
from app.models.course import Course, CourseCategory, CourseTag, course_tag_map, course_category_map
from app.models.content import Section, Lesson, LessonAttachment
from app.models.enrollment import Enrollment, LessonProgress, CourseCompletion
from app.models.assessment import Quiz, Question, AnswerOption, QuizSubmission, SubmissionAnswer, Certificate
from app.models.gradebook import GradebookEntry
from app.models.discussion import DiscussionThread, DiscussionComment, CommentUpvote
from app.models.review import CourseReview
from app.models.notification import Notification, NotificationPreference
from app.models.platform import PlatformSetting, AuditLog

__all__ = [
    "Base",
    # User models
    "User",
    "RefreshToken",
    "TokenBlacklist",
    # Course models
    "Course",
    "CourseCategory",
    "CourseTag",
    "course_tag_map",
    "course_category_map",
    # Content models
    "Section",
    "Lesson",
    "LessonAttachment",
    # Enrollment models
    "Enrollment",
    "LessonProgress",
    "CourseCompletion",
    # Assessment models
    "Quiz",
    "Question",
    "AnswerOption",
    "QuizSubmission",
    "SubmissionAnswer",
    "Certificate",
    # Gradebook models
    "GradebookEntry",
    # Discussion models
    "DiscussionThread",
    "DiscussionComment",
    "CommentUpvote",
    # Review models
    "CourseReview",
    # Notification models
    "Notification",
    "NotificationPreference",
    # Platform models
    "PlatformSetting",
    "AuditLog",
]
