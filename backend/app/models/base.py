"""
SQLAlchemy base models - re-export from db.base for backward compatibility.
"""
from app.db.base import Base, TimestampMixin, generate_uuid

__all__ = ["Base", "TimestampMixin", "generate_uuid"]
