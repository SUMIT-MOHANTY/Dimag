"""
Rate limiting middleware using slowapi.
"""
from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import settings

# Create limiter instance
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100/minute"],
    storage_uri=settings.REDIS_URL if settings.REDIS_URL else "memory://",
)


def add_rate_limit_middleware(app: FastAPI) -> None:
    """
    Add rate limiting middleware to the FastAPI application.
    
    Configures slowapi limiter with Redis or in-memory storage.
    """
    # Initialize limiter state
    app.state.limiter = limiter
    
    # Add exception handler for rate limit exceeded
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
