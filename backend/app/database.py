"""
Database session factory and engine configuration.
Supports both SQLite (aiosqlite) and PostgreSQL (asyncpg).

This module re-exports from app.db.session for backward compatibility.
"""
from app.db.session import (
    async_engine,
    AsyncSessionLocal,
    get_db,
    init_db,
)

__all__ = [
    "async_engine",
    "AsyncSessionLocal",
    "get_db",
    "init_db",
]
