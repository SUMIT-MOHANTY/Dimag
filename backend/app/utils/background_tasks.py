"""
Background task utilities for fire-and-forget operations.
"""
import logging
from typing import Any, Callable

from fastapi import BackgroundTasks

from app.utils.email import EmailAdapter

logger = logging.getLogger(__name__)


class BackgroundTaskManager:
    """Wrapper for FastAPI BackgroundTasks with error handling."""

    def __init__(self, background_tasks: BackgroundTasks):
        self.background_tasks = background_tasks

    def add_task(self, func: Callable, *args: Any, **kwargs: Any) -> None:
        """Add a task with automatic error handling."""
        async def wrapped_task():
            try:
                if callable(func):
                    result = func(*args, **kwargs)
                    # Handle async functions
                    if hasattr(result, "__await__"):
                        await result
            except Exception as e:
                logger.error("Background task failed: %s", str(e), exc_info=True)

        self.background_tasks.add_task(wrapped_task)


async def send_email_task(
    adapter: EmailAdapter,
    to: str,
    subject: str,
    html_body: str,
    text_body: str = "",
) -> None:
    """Fire-and-forget email sending task."""
    try:
        await adapter.send_email(to, subject, html_body, text_body)
        logger.info("Email sent successfully to %s", to)
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to, str(e))


async def send_enrollment_confirmation_task(
    adapter: EmailAdapter,
    to: str,
    course_title: str,
    student_name: str,
) -> None:
    """Send enrollment confirmation email."""
    from app.utils.email import render_enrollment_confirmation_email

    try:
        html, text = render_enrollment_confirmation_email(course_title, student_name)
        await adapter.send_email(to, f"Enrolled in {course_title}", html, text)
        logger.info("Enrollment confirmation sent to %s", to)
    except Exception as e:
        logger.error("Failed to send enrollment confirmation to %s: %s", to, str(e))


async def send_certificate_email_task(
    adapter: EmailAdapter,
    to: str,
    course_title: str,
    certificate_url: str,
) -> None:
    """Send certificate issued email."""
    from app.utils.email import render_certificate_email

    try:
        html, text = render_certificate_email(course_title, certificate_url)
        await adapter.send_email(to, f"Certificate: {course_title}", html, text)
        logger.info("Certificate email sent to %s", to)
    except Exception as e:
        logger.error("Failed to send certificate email to %s: %s", to, str(e))


async def send_grade_release_task(
    adapter: EmailAdapter,
    to: str,
    course_title: str,
    score: float,
) -> None:
    """Send grade release email."""
    from app.utils.email import render_grade_release_email

    try:
        html, text = render_grade_release_email(course_title, score)
        await adapter.send_email(to, f"Grade Released: {course_title}", html, text)
        logger.info("Grade release email sent to %s", to)
    except Exception as e:
        logger.error("Failed to send grade release email to %s: %s", to, str(e))
