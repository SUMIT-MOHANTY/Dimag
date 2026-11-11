"""
Database session factory and engine configuration.
Supports both SQLite (aiosqlite) and PostgreSQL (asyncpg).
"""
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.db.base import Base

# Configure engine based on database URL
if settings.is_sqlite:
    # SQLite configuration with aiosqlite
    async_engine = create_async_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=settings.is_development,
    )
else:
    # PostgreSQL configuration with asyncpg
    async_engine = create_async_engine(
        settings.DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=settings.is_development,
    )

# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def get_db() -> AsyncSession:
    """
    Dependency that provides a database session.
    
    Yields:
        AsyncSession: Database session.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    Initialize database tables.
    Only used in development/testing. Production should use Alembic migrations.
    """
    if settings.is_production:
        return
    
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
