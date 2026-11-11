"""
Storage adapter interface with local and S3 implementations.
"""
import os
import logging
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional
from uuid import uuid4

from app.core.config import settings

logger = logging.getLogger(__name__)


class StorageAdapter(ABC):
    """Abstract storage adapter interface."""

    @abstractmethod
    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> str:
        """Upload file and return URL."""
        pass

    @abstractmethod
    async def delete_file(self, file_url: str) -> None:
        """Delete file by URL."""
        pass

    @abstractmethod
    async def get_presigned_url(self, file_url: str, ttl_seconds: int = 3600) -> str:
        """Get presigned URL for file access."""
        pass


class LocalStorageAdapter(StorageAdapter):
    """Local filesystem storage adapter for development."""

    def __init__(self, upload_dir: str = "./uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.base_url = "/uploads"

    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> str:
        """Save file to local uploads directory."""
        # Generate unique filename
        ext = Path(filename).suffix
        unique_name = f"{uuid4().hex}{ext}"
        file_path = self.upload_dir / unique_name

        # Write file
        with open(file_path, "wb") as f:
            f.write(file_bytes)

        return f"{self.base_url}/{unique_name}"

    async def delete_file(self, file_url: str) -> None:
        """Delete file from local storage."""
        if not file_url.startswith(self.base_url):
            return

        filename = file_url.replace(f"{self.base_url}/", "")
        file_path = self.upload_dir / filename

        if file_path.exists():
            file_path.unlink()

    async def get_presigned_url(self, file_url: str, ttl_seconds: int = 3600) -> str:
        """Return direct URL for local files."""
        return file_url


class S3StorageAdapter(StorageAdapter):
    """S3-compatible storage adapter for production."""

    def __init__(
        self,
        bucket_name: str,
        access_key: str,
        secret_key: str,
        region: str,
        endpoint_url: Optional[str] = None,
    ):
        self.bucket_name = bucket_name
        self.access_key = access_key
        self.secret_key = secret_key
        self.region = region
        self.endpoint_url = endpoint_url
        self._client = None

    def _get_client(self):
        """Lazy load S3 client."""
        if self._client is None:
            try:
                import boto3
                from botocore.config import Config

                config = Config(
                    region_name=self.region,
                    signature_version="s3v4",
                )

                self._client = boto3.client(
                    "s3",
                    aws_access_key_id=self.access_key,
                    aws_secret_access_key=self.secret_key,
                    endpoint_url=self.endpoint_url,
                    config=config,
                )
            except ImportError:
                raise RuntimeError("boto3 is required for S3 storage")
        return self._client

    async def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
    ) -> str:
        """Upload file to S3 bucket."""
        import asyncio

        ext = Path(filename).suffix
        key = f"{uuid4().hex}{ext}"

        client = self._get_client()

        # Run sync boto3 in thread pool
        await asyncio.to_thread(
            client.put_object,
            Bucket=self.bucket_name,
            Key=key,
            Body=file_bytes,
            ContentType=content_type,
        )

        if self.endpoint_url:
            return f"{self.endpoint_url}/{self.bucket_name}/{key}"
        return f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{key}"

    async def delete_file(self, file_url: str) -> None:
        """Delete file from S3."""
        import asyncio

        # Extract key from URL
        if self.endpoint_url and self.endpoint_url in file_url:
            key = file_url.replace(f"{self.endpoint_url}/{self.bucket_name}/", "")
        else:
            # Standard S3 URL format
            key = file_url.split(f"/{self.bucket_name}/")[-1]

        client = self._get_client()
        await asyncio.to_thread(
            client.delete_object,
            Bucket=self.bucket_name,
            Key=key,
        )

    async def get_presigned_url(self, file_url: str, ttl_seconds: int = 3600) -> str:
        """Generate presigned URL for S3 object."""
        import asyncio

        # Extract key from URL
        if self.endpoint_url and self.endpoint_url in file_url:
            key = file_url.replace(f"{self.endpoint_url}/{self.bucket_name}/", "")
        else:
            key = file_url.split(f"/{self.bucket_name}/")[-1]

        client = self._get_client()
        url = await asyncio.to_thread(
            client.generate_presigned_url,
            "get_object",
            Params={"Bucket": self.bucket_name, "Key": key},
            ExpiresIn=ttl_seconds,
        )
        return url


def get_storage_adapter() -> StorageAdapter:
    """Factory function to get appropriate storage adapter."""
    # Check if S3 is configured
    if all([
        settings.S3_BUCKET_NAME,
        settings.AWS_ACCESS_KEY_ID,
        settings.AWS_SECRET_ACCESS_KEY,
        settings.AWS_REGION,
    ]):
        logger.info("Using S3 storage adapter")
        return S3StorageAdapter(
            bucket_name=settings.S3_BUCKET_NAME,
            access_key=settings.AWS_ACCESS_KEY_ID,
            secret_key=settings.AWS_SECRET_ACCESS_KEY,
            region=settings.AWS_REGION,
            endpoint_url=settings.S3_ENDPOINT_URL,
        )

    # Fall back to local storage
    if settings.ENVIRONMENT != "development":
        logger.critical(
            "CRITICAL: Falling back to local storage adapter in non-development environment. "
            "This is not recommended for production use."
        )
    else:
        logger.info("Using local storage adapter for development")

    return LocalStorageAdapter()
