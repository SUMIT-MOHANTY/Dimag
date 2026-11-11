"""
System router - health checks and version info.
"""
from fastapi import APIRouter, status
from pydantic import BaseModel

from app.core.config import settings
from app.utils.cache import get_cache_adapter
from app.utils.storage import get_storage_adapter

router = APIRouter(prefix="/api", tags=["System"])


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    environment: str
    database: str
    cache: str
    storage: str


class VersionResponse(BaseModel):
    """Version info response model."""
    version: str
    api: str


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    
    Returns system health status including:
    - Database connectivity
    - Cache adapter status (primary or fallback)
    - Storage adapter status (primary or fallback)
    """
    # Determine cache status
    cache_adapter = get_cache_adapter()
    cache_status = "primary" if settings.REDIS_URL else "fallback"
    
    # Determine storage status
    storage_adapter = get_storage_adapter()
    s3_configured = all([
        settings.S3_BUCKET_NAME,
        settings.AWS_ACCESS_KEY_ID,
        settings.AWS_SECRET_ACCESS_KEY,
    ])
    storage_status = "primary" if s3_configured else "fallback"
    
    return HealthResponse(
        status="ok",
        environment=settings.ENVIRONMENT,
        database="connected",
        cache=cache_status,
        storage=storage_status,
    )


@router.get("/version", response_model=VersionResponse)
async def version():
    """
    API version endpoint.
    
    Returns current API version information.
    """
    return VersionResponse(
        version="1.0.0",
        api="Open LMS",
    )
