"""
API routers package.
"""
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.courses import router as courses_router
from app.routers.content import router as content_router
from app.routers.enrollment import router as enrollment_router
from app.routers.assessment import router as assessment_router
from app.routers.gradebook import router as gradebook_router
from app.routers.discussion import router as discussion_router
from app.routers.taxonomy import router as taxonomy_router
from app.routers.instructor import router as instructor_router
from app.routers.admin import router as admin_router
from app.routers.system import router as system_router

__all__ = [
    "auth_router",
    "users_router",
    "courses_router",
    "content_router",
    "enrollment_router",
    "assessment_router",
    "gradebook_router",
    "discussion_router",
    "taxonomy_router",
    "instructor_router",
    "admin_router",
    "system_router",
]
