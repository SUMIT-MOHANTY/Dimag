"""
Application constants - re-export from core.constants for backward compatibility.
"""
from app.core.constants import (
    UserRole,
    CourseStatus,
    EnrollmentStatus,
    ContentType,
    NotificationType,
    NotificationChannel,
    QuestionType,
    GradingStatus,
)

__all__ = [
    "UserRole",
    "CourseStatus",
    "EnrollmentStatus",
    "ContentType",
    "NotificationType",
    "NotificationChannel",
    "QuestionType",
    "GradingStatus",
]
