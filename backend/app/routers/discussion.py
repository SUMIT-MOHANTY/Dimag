"""
Discussion router.
"""
from fastapi import APIRouter, status

from app.schemas import MessageResponse

router = APIRouter(prefix="/api/discussions", tags=["Discussions"])


@router.get("/courses/{course_id}/threads", response_model=MessageResponse)
async def list_threads(course_id: str):
    """List discussion threads for a course."""
    return {"message": "not implemented"}


@router.post("/courses/{course_id}/threads", response_model=MessageResponse)
async def create_thread(course_id: str):
    """Create a new discussion thread."""
    return {"message": "not implemented"}


@router.get("/threads/{thread_id}", response_model=MessageResponse)
async def get_thread(thread_id: str):
    """Get thread details with comments."""
    return {"message": "not implemented"}


@router.patch("/threads/{thread_id}", response_model=MessageResponse)
async def update_thread(thread_id: str):
    """Update a thread."""
    return {"message": "not implemented"}


@router.delete("/threads/{thread_id}", response_model=MessageResponse)
async def delete_thread(thread_id: str):
    """Delete a thread."""
    return {"message": "not implemented"}


@router.post("/threads/{thread_id}/pin", response_model=MessageResponse)
async def pin_thread(thread_id: str):
    """Pin a thread (instructor/admin only)."""
    return {"message": "not implemented"}


@router.post("/threads/{thread_id}/lock", response_model=MessageResponse)
async def lock_thread(thread_id: str):
    """Lock a thread (instructor/admin only)."""
    return {"message": "not implemented"}


@router.post("/threads/{thread_id}/comments", response_model=MessageResponse)
async def create_comment(thread_id: str):
    """Add a comment to a thread."""
    return {"message": "not implemented"}


@router.get("/comments/{comment_id}", response_model=MessageResponse)
async def get_comment(comment_id: str):
    """Get comment details."""
    return {"message": "not implemented"}


@router.patch("/comments/{comment_id}", response_model=MessageResponse)
async def update_comment(comment_id: str):
    """Update a comment."""
    return {"message": "not implemented"}


@router.delete("/comments/{comment_id}", response_model=MessageResponse)
async def delete_comment(comment_id: str):
    """Delete a comment."""
    return {"message": "not implemented"}


@router.post("/comments/{comment_id}/upvote", response_model=MessageResponse)
async def upvote_comment(comment_id: str):
    """Upvote a comment."""
    return {"message": "not implemented"}


@router.delete("/comments/{comment_id}/upvote", response_model=MessageResponse)
async def remove_upvote(comment_id: str):
    """Remove upvote from a comment."""
    return {"message": "not implemented"}
