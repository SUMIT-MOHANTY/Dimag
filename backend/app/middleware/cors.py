"""
CORS middleware configuration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


def add_cors_middleware(app: FastAPI) -> None:
    """
    Add CORS middleware to the FastAPI application.
    
    Configures allowed origins, methods, headers, and credentials
    based on application settings.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
    )
