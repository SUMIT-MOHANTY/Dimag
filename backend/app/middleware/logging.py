"""
Request/response logging middleware.
"""
import logging
import time
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("app.middleware.logging")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for logging HTTP requests and responses.
    
    Logs method, path, status code, and duration for each request.
    Excludes health check endpoints to reduce noise.
    """
    
    EXCLUDED_PATHS = {"/api/health", "/api/version", "/docs", "/openapi.json", "/redoc"}
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Skip logging for excluded paths
        if request.url.path in self.EXCLUDED_PATHS:
            return await call_next(request)
        
        start_time = time.time()
        
        # Log request
        logger.info(
            "→ %s %s",
            request.method,
            request.url.path,
            extra={
                "method": request.method,
                "path": request.url.path,
                "query": str(request.query_params),
                "client_ip": request.client.host if request.client else None,
            },
        )
        
        try:
            response = await call_next(request)
        except Exception as exc:
            duration_ms = (time.time() - start_time) * 1000
            logger.error(
                "✗ %s %s → ERROR (%dms) - %s",
                request.method,
                request.url.path,
                duration_ms,
                str(exc),
                exc_info=True,
            )
            raise
        
        duration_ms = (time.time() - start_time) * 1000
        
        # Log response
        logger.info(
            "← %s %s → %d (%dms)",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration_ms": duration_ms,
            },
        )
        
        return response
