"""
FastAPI application factory for Open LMS.

This module creates and configures the FastAPI application instance,
including middleware, routers, and lifespan management.
"""
import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.db.session import init_db
from app.middleware import add_cors_middleware, add_rate_limit_middleware, RequestLoggingMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "development" else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Import all routers
from app.routers import auth, users, courses, content, enrollment, assessment
from app.routers import gradebook, discussion, taxonomy, instructor, admin, system


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    
    Handles startup and shutdown events:
    - Startup: Initialize database, APScheduler
    - Shutdown: Cleanup resources
    """
    # Startup
    logger.info("Starting up Open LMS API...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Database URL: {settings.DATABASE_URL}")
    
    # Initialize database (create tables in dev/test only)
    await init_db()
    
    logger.info("Startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Open LMS API...")
    logger.info("Shutdown complete")


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application instance
    """
    app = FastAPI(
        title="Open LMS API",
        description="A modern Learning Management System API",
        version="1.0.0",
        openapi_url="/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )
    
    # Add middleware
    add_cors_middleware(app)
    add_rate_limit_middleware(app)
    app.add_middleware(RequestLoggingMiddleware)
    
    # Register exception handlers
    register_exception_handlers(app)
    
    # Mount static files for uploads
    uploads_dir = Path("./uploads")
    uploads_dir.mkdir(exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")
    
    # Include all routers
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(courses.router)
    app.include_router(content.router)
    app.include_router(enrollment.router)
    app.include_router(assessment.router)
    app.include_router(gradebook.router)
    app.include_router(discussion.router)
    app.include_router(taxonomy.router)
    app.include_router(instructor.router)
    app.include_router(admin.router)
    app.include_router(system.router)
    
    return app


# Create the application instance
app = create_application()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.ENVIRONMENT == "development",
    )
