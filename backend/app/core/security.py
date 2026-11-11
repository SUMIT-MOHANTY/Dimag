"""
Security utilities for password hashing, JWT token creation/verification,
and token generation.
"""
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Tuple
from uuid import UUID, uuid4

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.exceptions import UnauthorizedError

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Args:
        plain_password: The plain text password to hash.
        
    Returns:
        The hashed password string.
    """
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.
    
    Args:
        plain_password: The plain text password to verify.
        hashed_password: The hashed password to compare against.
        
    Returns:
        True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Dictionary containing token claims (e.g., sub, role).
        expires_delta: Optional custom expiration time. Defaults to settings.ACCESS_TOKEN_EXPIRE_MINUTES.
        
    Returns:
        The encoded JWT token string.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add standard claims
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": str(uuid4()),  # Unique token ID for blacklisting
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def create_refresh_token(user_id: UUID) -> Tuple[str, str]:
    """
    Create a refresh token and its hash for database storage.
    
    Args:
        user_id: The user ID to associate with the refresh token.
        
    Returns:
        Tuple of (raw_token, token_hash).
    """
    # Generate a secure random token
    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_token(raw_token)
    
    return raw_token, token_hash


def decode_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    
    Args:
        token: The JWT token string to decode.
        
    Returns:
        The decoded token payload as a dictionary.
        
    Raises:
        UnauthorizedError: If the token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise UnauthorizedError(f"Invalid or expired token: {str(e)}")


def generate_verification_token() -> str:
    """
    Generate a secure email verification token.
    
    Returns:
        A URL-safe token string.
    """
    return secrets.token_urlsafe(32)


def generate_reset_token() -> str:
    """
    Generate a secure password reset token.
    
    Returns:
        A URL-safe token string.
    """
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    """
    Hash a token using SHA-256 for database storage.
    
    Args:
        token: The token string to hash.
        
    Returns:
        The SHA-256 hex digest of the token.
    """
    return hashlib.sha256(token.encode()).hexdigest()


def generate_secure_password(length: int = 16) -> str:
    """
    Generate a secure random password.
    
    Args:
        length: The length of the password to generate.
        
    Returns:
        A secure random password string.
    """
    # Use alphanumeric characters plus some special characters
    alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))
