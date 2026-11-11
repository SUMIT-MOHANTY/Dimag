"""
Slug generation utilities.
"""
import re
import unicodedata


def slugify(text: str) -> str:
    """
    Convert text to URL-friendly slug.
    
    - Lowercase
    - Strip accents
    - Replace non-alphanumeric with hyphens
    - Collapse consecutive hyphens
    - Strip leading/trailing hyphens
    """
    # Normalize unicode to decompose accents
    text = unicodedata.normalize("NFKD", text)
    
    # Remove accents (keep only ASCII)
    text = text.encode("ascii", "ignore").decode("ascii")
    
    # Lowercase
    text = text.lower()
    
    # Replace non-alphanumeric with hyphens
    text = re.sub(r"[^a-z0-9]+", "-", text)
    
    # Collapse consecutive hyphens
    text = re.sub(r"-+", "-", text)
    
    # Strip leading/trailing hyphens
    text = text.strip("-")
    
    return text


def unique_slugify(text: str, existing_slugs: list[str]) -> str:
    """
    Generate a unique slug by appending numbers if needed.
    
    Args:
        text: Base text to slugify
        existing_slugs: List of existing slugs to check against
    
    Returns:
        Unique slug string
    """
    base_slug = slugify(text)
    
    if base_slug not in existing_slugs:
        return base_slug
    
    # Find next available number
    counter = 2
    while f"{base_slug}-{counter}" in existing_slugs:
        counter += 1
    
    return f"{base_slug}-{counter}"
