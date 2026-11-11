"""
Cache adapter interface with in-memory and Redis implementations.
"""
import json
import logging
from abc import ABC, abstractmethod
from typing import Any, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class CacheAdapter(ABC):
    """Abstract cache adapter interface."""

    @abstractmethod
    async def get(self, key: str) -> Any | None:
        """Get value from cache."""
        pass

    @abstractmethod
    async def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Set value in cache with TTL."""
        pass

    @abstractmethod
    async def delete(self, key: str) -> None:
        """Delete key from cache."""
        pass

    @abstractmethod
    async def clear(self) -> None:
        """Clear all cache entries."""
        pass


class InMemoryCacheAdapter(CacheAdapter):
    """In-memory cache using TTLCache for development."""

    def __init__(self, maxsize: int = 1000, ttl: int = 300):
        from cachetools import TTLCache

        self._cache: TTLCache = TTLCache(maxsize=maxsize, ttl=ttl)

    async def get(self, key: str) -> Any | None:
        """Get value from in-memory cache."""
        value = self._cache.get(key)
        if value is not None:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None

    async def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Set value in in-memory cache."""
        from cachetools import TTLCache

        serialized = json.dumps(value)
        # Create new cache with updated TTL if needed
        if ttl_seconds != self._cache.ttl:
            self._cache = TTLCache(maxsize=self._cache.maxsize, ttl=ttl_seconds)
        self._cache[key] = serialized

    async def delete(self, key: str) -> None:
        """Delete key from in-memory cache."""
        self._cache.pop(key, None)

    async def clear(self) -> None:
        """Clear in-memory cache."""
        self._cache.clear()


class RedisCacheAdapter(CacheAdapter):
    """Redis cache adapter for production."""

    def __init__(self, redis_url: str):
        self.redis_url = redis_url
        self._client = None

    def _get_client(self):
        """Lazy load Redis client."""
        if self._client is None:
            import redis.asyncio as redis

            self._client = redis.from_url(self.redis_url, decode_responses=True)
        return self._client

    async def get(self, key: str) -> Any | None:
        """Get value from Redis."""
        client = self._get_client()
        value = await client.get(key)
        if value is not None:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None

    async def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Set value in Redis with TTL."""
        client = self._get_client()
        serialized = json.dumps(value)
        await client.setex(key, ttl_seconds, serialized)

    async def delete(self, key: str) -> None:
        """Delete key from Redis."""
        client = self._get_client()
        await client.delete(key)

    async def clear(self) -> None:
        """Clear all Redis cache entries (use with caution)."""
        client = self._get_client()
        await client.flushdb()


def get_cache_adapter() -> CacheAdapter:
    """Factory function to get appropriate cache adapter."""
    if settings.REDIS_URL:
        logger.info("Using Redis cache adapter")
        return RedisCacheAdapter(settings.REDIS_URL)

    if settings.ENVIRONMENT != "development":
        logger.critical(
            "CRITICAL: Falling back to in-memory cache adapter in non-development environment. "
            "This is not recommended for production use as cache will not be shared across instances."
        )
    else:
        logger.info("Using in-memory cache adapter for development")

    return InMemoryCacheAdapter()
