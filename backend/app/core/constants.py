"""
Application-wide constants and enumerations.
"""
from enum import Enum
from typing import Final


class UserRole(str, Enum):
    """User role enumeration."""
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"


class CourseStatus(str, Enum):
    """Course lifecycle status enumeration."""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class EnrollmentStatus(str, Enum):
    """Enrollment state machine enumeration."""
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    DROPPED = "dropped"


class ContentType(str, Enum):
    """Lesson content type enumeration."""
    TEXT = "text"
    VIDEO = "video"
    FILE = "file"


class NotificationType(str, Enum):
    """Notification type enumeration."""
    ENROLLMENT_CONFIRMATION = "enrollment_confirmation"
    GRADE_RELEASE = "grade_release"
    COURSE_ANNOUNCEMENT = "course_announcement"
    PASSWORD_RESET = "password_reset"
    EMAIL_VERIFICATION = "email_verification"
    ENROLLMENT_REMINDER = "enrollment_reminder"
    COURSE_COMPLETION = "course_completion"
    CERTIFICATE_ISSUED = "certificate_issued"


class NotificationChannel(str, Enum):
    """Notification delivery channel enumeration."""
    IN_APP = "in_app"
    EMAIL = "email"


class QuestionType(str, Enum):
    """Quiz question type enumeration."""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    MULTIPLE_SELECT = "multiple_select"


class GradingStatus(str, Enum):
    """Quiz submission grading status enumeration."""
    PENDING = "pending"
    GRADED = "graded"
    MANUALLY_OVERRIDDEN = "manually_overridden"


class VideoProvider(str, Enum):
    """Video hosting provider enumeration."""
    YOUTUBE = "youtube"
    VIMEO = "vimeo"
    SELF_HOSTED = "self_hosted"


# Application constants
MAX_SLUG_LENGTH: Final[int] = 200
MAX_EMAIL_LENGTH: Final[int] = 255
MAX_NAME_LENGTH: Final[int] = 100
MAX_TITLE_LENGTH: Final[int] = 255
MAX_DESCRIPTION_LENGTH: Final[int] = 5000
MAX_BIO_LENGTH: Final[int] = 2000

# Pagination defaults
DEFAULT_PAGE_SIZE: Final[int] = 20
MAX_PAGE_SIZE: Final[int] = 100
DEFAULT_PAGE: Final[int] = 1

# Token constants
EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS: Final[int] = 24
PASSWORD_RESET_TOKEN_EXPIRY_HOURS: Final[int] = 1
IDEMPOTENCY_KEY_EXPIRY_HOURS: Final[int] = 24

# File upload constants
ALLOWED_IMAGE_TYPES: Final[list] = ["image/jpeg", "image/png", "image/webp"]
ALLOWED_VIDEO_TYPES: Final[list] = ["video/mp4", "video/webm", "video/ogg"]
ALLOWED_DOCUMENT_TYPES: Final[list] = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
]
MAX_THUMBNAIL_SIZE_MB: Final[int] = 5
MAX_VIDEO_SIZE_MB: Final[int] = 500
MAX_DOCUMENT_SIZE_MB: Final[int] = 50

# Cache TTL constants (in seconds)
CACHE_TTL_CATALOG: Final[int] = 300  # 5 minutes
CACHE_TTL_USER: Final[int] = 600  # 10 minutes
CACHE_TTL_COURSE: Final[int] = 300  # 5 minutes
CACHE_TTL_GRADES: Final[int] = 60  # 1 minute

# Discussion constants
MAX_COMMENT_DEPTH: Final[int] = 3
MAX_COMMENT_LENGTH: Final[int] = 5000

# Review constants
MIN_RATING: Final[int] = 1
MAX_RATING: Final[int] = 5

# Certificate constants
CERTIFICATE_CODE_LENGTH: Final[int] = 12
