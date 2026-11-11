"""
Pydantic schemas for request/response validation.
"""
from app.schemas.common import MessageResponse, ErrorResponse, PaginatedResponse
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    EmailVerificationRequest,
)
from app.schemas.user import (
    UserResponse,
    UserUpdateRequest,
    PasswordChangeRequest,
    AvatarUploadResponse,
)
from app.schemas.course import (
    CourseCreateRequest,
    CourseUpdateRequest,
    CourseResponse,
    CourseListResponse,
    CoursePublishRequest,
)
from app.schemas.content import (
    SectionCreateRequest,
    SectionResponse,
    LessonCreateRequest,
    LessonResponse,
    AttachmentResponse,
)
from app.schemas.enrollment import (
    EnrollmentResponse,
    LessonProgressResponse,
    EnrollmentProgressResponse,
)
from app.schemas.assessment import (
    QuizCreateRequest,
    QuizResponse,
    QuestionCreateRequest,
    QuestionResponse,
    AnswerOptionRequest,
    SubmissionCreateRequest,
    SubmissionResponse,
    QuizResultResponse,
)
from app.schemas.gradebook import (
    GradebookEntryResponse,
    GradeOverrideRequest,
)
from app.schemas.discussion import (
    ThreadCreateRequest,
    ThreadResponse,
    CommentCreateRequest,
    CommentResponse,
)
from app.schemas.review import (
    ReviewCreateRequest,
    ReviewResponse,
)
from app.schemas.notification import (
    NotificationResponse,
    NotificationPreferenceUpdate,
)
from app.schemas.taxonomy import (
    CategoryResponse,
    TagResponse,
    CategoryCreateRequest,
    TagCreateRequest,
)
from app.schemas.admin import (
    UserAdminResponse,
    UserAdminUpdateRequest,
    PlatformSettingResponse,
    PlatformSettingUpdateRequest,
    AuditLogResponse,
    PlatformStatsResponse,
)

__all__ = [
    # Common
    "MessageResponse",
    "ErrorResponse",
    "PaginatedResponse",
    # Auth
    "RegisterRequest",
    "LoginRequest",
    "TokenResponse",
    "RefreshRequest",
    "ForgotPasswordRequest",
    "ResetPasswordRequest",
    "EmailVerificationRequest",
    # User
    "UserResponse",
    "UserUpdateRequest",
    "PasswordChangeRequest",
    "AvatarUploadResponse",
    # Course
    "CourseCreateRequest",
    "CourseUpdateRequest",
    "CourseResponse",
    "CourseListResponse",
    "CoursePublishRequest",
    # Content
    "SectionCreateRequest",
    "SectionResponse",
    "LessonCreateRequest",
    "LessonResponse",
    "AttachmentResponse",
    # Enrollment
    "EnrollmentResponse",
    "LessonProgressResponse",
    "EnrollmentProgressResponse",
    # Assessment
    "QuizCreateRequest",
    "QuizResponse",
    "QuestionCreateRequest",
    "QuestionResponse",
    "AnswerOptionRequest",
    "SubmissionCreateRequest",
    "SubmissionResponse",
    "QuizResultResponse",
    # Gradebook
    "GradebookEntryResponse",
    "GradeOverrideRequest",
    # Discussion
    "ThreadCreateRequest",
    "ThreadResponse",
    "CommentCreateRequest",
    "CommentResponse",
    # Review
    "ReviewCreateRequest",
    "ReviewResponse",
    # Notification
    "NotificationResponse",
    "NotificationPreferenceUpdate",
    # Taxonomy
    "CategoryResponse",
    "TagResponse",
    "CategoryCreateRequest",
    "TagCreateRequest",
    # Admin
    "UserAdminResponse",
    "UserAdminUpdateRequest",
    "PlatformSettingResponse",
    "PlatformSettingUpdateRequest",
    "AuditLogResponse",
    "PlatformStatsResponse",
]
