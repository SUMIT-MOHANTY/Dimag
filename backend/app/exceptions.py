"""
Application exceptions - re-export from core.exceptions for backward compatibility.
"""
from app.core.exceptions import (
    AppException,
    NotFoundError,
    ForbiddenError,
    UnauthorizedError,
    ConflictError,
    ValidationError,
    RateLimitError,
    BadRequestError,
    app_exception_handler,
    http_exception_handler,
    generic_exception_handler,
    register_exception_handlers,
)

__all__ = [
    "AppException",
    "NotFoundError",
    "ForbiddenError",
    "UnauthorizedError",
    "ConflictError",
    "ValidationError",
    "RateLimitError",
    "BadRequestError",
    "app_exception_handler",
    "http_exception_handler",
    "generic_exception_handler",
    "register_exception_handlers",
]
