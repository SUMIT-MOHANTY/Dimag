"""
Taxonomy router (categories and tags).
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/taxonomy", tags=["Taxonomy"])


@router.get("/categories", response_model=MessageResponse)
async def list_categories():
    """List all categories."""
    return {"message": "not implemented"}


@router.post("/categories", response_model=MessageResponse)
async def create_category():
    """Create a new category (admin only)."""
    return {"message": "not implemented"}


@router.get("/categories/{category_id}", response_model=MessageResponse)
async def get_category(category_id: str):
    """Get category details."""
    return {"message": "not implemented"}


@router.patch("/categories/{category_id}", response_model=MessageResponse)
async def update_category(category_id: str):
    """Update a category (admin only)."""
    return {"message": "not implemented"}


@router.delete("/categories/{category_id}", response_model=MessageResponse)
async def delete_category(category_id: str):
    """Delete a category (admin only)."""
    return {"message": "not implemented"}


@router.get("/tags", response_model=MessageResponse)
async def list_tags():
    """List all tags."""
    return {"message": "not implemented"}


@router.post("/tags", response_model=MessageResponse)
async def create_tag():
    """Create a new tag (admin only)."""
    return {"message": "not implemented"}


@router.get("/tags/{tag_id}", response_model=MessageResponse)
async def get_tag(tag_id: str):
    """Get tag details."""
    return {"message": "not implemented"}


@router.patch("/tags/{tag_id}", response_model=MessageResponse)
async def update_tag(tag_id: str):
    """Update a tag (admin only)."""
    return {"message": "not implemented"}


@router.delete("/tags/{tag_id}", response_model=MessageResponse)
async def delete_tag(tag_id: str):
    """Delete a tag (admin only)."""
    return {"message": "not implemented"}


@router.get("/categories/{category_id}/courses", response_model=MessageResponse)
async def list_courses_by_category(category_id: str):
    """List courses in a category."""
    return {"message": "not implemented"}


@router.get("/tags/{tag_id}/courses", response_model=MessageResponse)
async def list_courses_by_tag(tag_id: str):
    """List courses with a tag."""
    return {"message": "not implemented"}
