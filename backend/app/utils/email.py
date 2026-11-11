"""
Email adapter interface with console and SMTP implementations.
"""
import logging
from abc import ABC, abstractmethod
from typing import List, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailAdapter(ABC):
    """Abstract email adapter interface."""

    @abstractmethod
    async def send_email(
        self,
        to: str,
        subject: str,
        html_body: str,
        text_body: str = "",
    ) -> None:
        """Send email to recipient."""
        pass


class ConsoleEmailAdapter(EmailAdapter):
    """Console logging adapter for development."""

    def __init__(self):
        self.sent_emails: List[dict] = []

    async def send_email(
        self,
        to: str,
        subject: str,
        html_body: str,
        text_body: str = "",
    ) -> None:
        """Log email to console."""
        email_record = {
            "to": to,
            "subject": subject,
            "html_body": html_body,
            "text_body": text_body,
        }
        self.sent_emails.append(email_record)

        logger.info("[EMAIL LOG] To: %s | Subject: %s", to, subject)
        logger.debug("[EMAIL LOG] HTML Body: %s", html_body[:500])


class SMTPEmailAdapter(EmailAdapter):
    """SMTP adapter for production email delivery."""

    def __init__(
        self,
        host: str,
        port: int,
        user: Optional[str] = None,
        password: Optional[str] = None,
        from_email: str = "noreply@openlms.dev",
        use_tls: bool = True,
    ):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.from_email = from_email
        self.use_tls = use_tls

    async def send_email(
        self,
        to: str,
        subject: str,
        html_body: str,
        text_body: str = "",
    ) -> None:
        """Send email via SMTP."""
        try:
            from email.mime.multipart import MIMEMultipart
            from email.mime.text import MIMEText

            import aiosmtplib

            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to

            if text_body:
                msg.attach(MIMEText(text_body, "plain"))
            msg.attach(MIMEText(html_body, "html"))

            await aiosmtplib.send(
                msg,
                hostname=self.host,
                port=self.port,
                username=self.user,
                password=self.password,
                start_tls=self.use_tls,
            )

            logger.info("Email sent to %s: %s", to, subject)
        except Exception as e:
            logger.error("Failed to send email to %s: %s", to, str(e))
            raise


def get_email_adapter() -> EmailAdapter:
    """Factory function to get appropriate email adapter."""
    if settings.SMTP_HOST:
        logger.info("Using SMTP email adapter")
        return SMTPEmailAdapter(
            host=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            user=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            from_email=settings.FROM_EMAIL,
        )

    logger.info("Using console email adapter for development")
    return ConsoleEmailAdapter()


# Email template functions
def render_verification_email(token: str, frontend_url: str) -> tuple[str, str]:
    """Render email verification email."""
    verification_url = f"{frontend_url}/verify-email?token={token}"

    html = f"""
    <html>
        <body>
            <h1>Verify Your Email</h1>
            <p>Thank you for registering with Open LMS. Please click the link below to verify your email address:</p>
            <p><a href="{verification_url}">Verify Email</a></p>
            <p>Or copy and paste this URL: {verification_url}</p>
            <p>This link will expire in 24 hours.</p>
        </body>
    </html>
    """

    text = f"""
    Verify Your Email

    Thank you for registering with Open LMS. Please visit the following URL to verify your email:

    {verification_url}

    This link will expire in 24 hours.
    """

    return html, text


def render_password_reset_email(token: str, frontend_url: str) -> tuple[str, str]:
    """Render password reset email."""
    reset_url = f"{frontend_url}/reset-password?token={token}"

    html = f"""
    <html>
        <body>
            <h1>Reset Your Password</h1>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <p><a href="{reset_url}">Reset Password</a></p>
            <p>Or copy and paste this URL: {reset_url}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </body>
    </html>
    """

    text = f"""
    Reset Your Password

    You requested a password reset. Visit the following URL to set a new password:

    {reset_url}

    This link will expire in 1 hour.

    If you didn't request this, please ignore this email.
    """

    return html, text


def render_enrollment_confirmation_email(course_title: str, student_name: str) -> tuple[str, str]:
    """Render enrollment confirmation email."""
    html = f"""
    <html>
        <body>
            <h1>Enrollment Confirmed!</h1>
            <p>Hi {student_name},</p>
            <p>You have successfully enrolled in <strong>{course_title}</strong>.</p>
            <p>You can now access all course materials and start learning!</p>
            <p>Happy learning,<br>The Open LMS Team</p>
        </body>
    </html>
    """

    text = f"""
    Enrollment Confirmed!

    Hi {student_name},

    You have successfully enrolled in {course_title}.

    You can now access all course materials and start learning!

    Happy learning,
    The Open LMS Team
    """

    return html, text


def render_certificate_email(course_title: str, certificate_url: str) -> tuple[str, str]:
    """Render certificate issued email."""
    html = f"""
    <html>
        <body>
            <h1>Congratulations!</h1>
            <p>You have successfully completed <strong>{course_title}</strong>!</p>
            <p>Your certificate is ready. You can view and download it here:</p>
            <p><a href="{certificate_url}">View Certificate</a></p>
            <p>Great job on completing the course!</p>
            <p>Best regards,<br>The Open LMS Team</p>
        </body>
    </html>
    """

    text = f"""
    Congratulations!

    You have successfully completed {course_title}!

    Your certificate is ready. View it at:
    {certificate_url}

    Great job on completing the course!

    Best regards,
    The Open LMS Team
    """

    return html, text


def render_grade_release_email(course_title: str, score: float) -> tuple[str, str]:
    """Render grade release email."""
    html = f"""
    <html>
        <body>
            <h1>Grade Released</h1>
            <p>Your grade for <strong>{course_title}</strong> has been released.</p>
            <p>Your score: <strong>{score}%</strong></p>
            <p>Log in to view detailed feedback.</p>
            <p>Best regards,<br>The Open LMS Team</p>
        </body>
    </html>
    """

    text = f"""
    Grade Released

    Your grade for {course_title} has been released.

    Your score: {score}%

    Log in to view detailed feedback.

    Best regards,
    The Open LMS Team
    """

    return html, text
