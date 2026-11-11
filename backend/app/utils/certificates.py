"""
Certificate generation utilities.
"""
import secrets
import string


def generate_verification_code(length: int = 12) -> str:
    """
    Generate a unique verification code for certificates.
    
    Args:
        length: Length of the code (default 12)
    
    Returns:
        Uppercase alphanumeric verification code
    """
    # Use uppercase letters and digits
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def generate_certificate_url(verification_code: str, frontend_url: str) -> str:
    """
    Generate the public certificate verification URL.
    
    Args:
        verification_code: The certificate verification code
        frontend_url: Base URL of the frontend application
    
    Returns:
        Full URL to verify the certificate
    """
    # Remove trailing slash from frontend_url if present
    base_url = frontend_url.rstrip("/")
    return f"{base_url}/certificates/{verification_code}"
