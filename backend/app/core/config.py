"""
Application configuration using Pydantic BaseSettings.
Reads from environment variables with sensible defaults.
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, validator
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./app.db",
        description="Database connection URL. Supports SQLite and PostgreSQL."
    )
    
    # Security
    SECRET_KEY: str = Field(
        default="change-me-in-production-secret-key-32-chars-long",
        description="Secret key for JWT token signing. Must be at least 32 characters in production."
    )
    ALGORITHM: str = Field(
        default="HS256",
        description="JWT signing algorithm."
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=15,
        description="Access token expiration time in minutes."
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7,
        description="Refresh token expiration time in days."
    )
    
    # Redis / Cache
    REDIS_URL: Optional[str] = Field(
        default=None,
        description="Redis connection URL. If not set, in-memory cache is used."
    )
    
    # S3 / Storage
    S3_BUCKET_NAME: Optional[str] = Field(
        default=None,
        description="S3 bucket name for file storage."
    )
    AWS_ACCESS_KEY_ID: Optional[str] = Field(
        default=None,
        description="AWS access key ID for S3."
    )
    AWS_SECRET_ACCESS_KEY: Optional[str] = Field(
        default=None,
        description="AWS secret access key for S3."
    )
    AWS_REGION: Optional[str] = Field(
        default=None,
        description="AWS region for S3."
    )
    S3_ENDPOINT_URL: Optional[str] = Field(
        default=None,
        description="Custom S3 endpoint URL (for MinIO, etc.)."
    )
    
    # SMTP / Email
    SMTP_HOST: Optional[str] = Field(
        default=None,
        description="SMTP server hostname."
    )
    SMTP_PORT: int = Field(
        default=587,
        description="SMTP server port."
    )
    SMTP_USER: Optional[str] = Field(
        default=None,
        description="SMTP username."
    )
    SMTP_PASSWORD: Optional[str] = Field(
        default=None,
        description="SMTP password."
    )
    FROM_EMAIL: str = Field(
        default="noreply@openlms.dev",
        description="Default sender email address."
    )
    
    # Application
    FRONTEND_URL: str = Field(
        default="http://localhost:5173",
        description="Frontend application URL for email links."
    )
    ADMIN_EMAIL: Optional[str] = Field(
        default=None,
        description="Admin user email for seeding."
    )
    ADMIN_PASSWORD: Optional[str] = Field(
        default=None,
        description="Admin user password for seeding."
    )
    ENVIRONMENT: str = Field(
        default="development",
        description="Application environment: development, staging, production."
    )
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:5173"],
        description="CORS allowed origins."
    )
    MAX_UPLOAD_SIZE_MB: int = Field(
        default=100,
        description="Maximum upload file size in MB."
    )
    RATE_LIMIT_AUTH: str = Field(
        default="10/minute",
        description="Rate limit for authentication endpoints."
    )
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_allowed_origins(cls, v):
        """Parse ALLOWED_ORIGINS from JSON string or list."""
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [item.strip() for item in v.split(",")]
        return v
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.ENVIRONMENT.lower() == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def is_sqlite(self) -> bool:
        """Check if using SQLite database."""
        return self.DATABASE_URL.startswith("sqlite")
    
    @property
    def is_postgresql(self) -> bool:
        """Check if using PostgreSQL database."""
        return self.DATABASE_URL.startswith("postgresql")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
