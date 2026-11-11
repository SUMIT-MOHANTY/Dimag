"""
Initial schema migration for Open LMS.

Creates all tables for users, courses, content, enrollments, assessments,
gradebook, discussions, reviews, notifications, and platform management.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql, sqlite

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def get_json_type():
    """Get JSON type based on dialect."""
    # Use JSON type which renders as JSONB on PostgreSQL and TEXT on SQLite
    return sa.JSON()


def upgrade() -> None:
    """Create all tables for Open LMS."""
    
    # Users table
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("avatar_url", sa.String(length=500), nullable=True),
        sa.Column("role", sa.String(length=20), nullable=False, server_default="student"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_email_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("email_verification_token", sa.String(length=255), nullable=True),
        sa.Column("email_verification_token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("password_reset_token", sa.String(length=255), nullable=True),
        sa.Column("password_reset_token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    
    # Refresh tokens table
    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token_hash", sa.String(length=255), nullable=False),
        sa.Column("is_revoked", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash"),
    )
    
    # Token blacklist table
    op.create_table(
        "token_blacklist",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("jti", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("jti"),
    )
    
    # Course categories table
    op.create_table(
        "course_categories",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("slug", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("parent_id", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["parent_id"], ["course_categories.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )
    
    # Course tags table
    op.create_table(
        "course_tags",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column("slug", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
        sa.UniqueConstraint("slug"),
    )
    
    # Courses table
    op.create_table(
        "courses",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("short_description", sa.String(length=500), nullable=True),
        sa.Column("thumbnail_url", sa.String(length=500), nullable=True),
        sa.Column("instructor_id", sa.UUID(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="draft"),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("price", sa.Numeric(precision=10, scale=2), nullable=False, server_default="0.00"),
        sa.Column("is_free", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("language", sa.String(length=10), nullable=False, server_default="en"),
        sa.Column("level", sa.String(length=20), nullable=True),
        sa.Column("avg_rating", sa.Numeric(precision=3, scale=2), nullable=False, server_default="0.00"),
        sa.Column("rating_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("enrollment_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["instructor_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    
    # Course tag mapping table
    op.create_table(
        "course_tag_map",
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("tag_id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["tag_id"], ["course_tags.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("course_id", "tag_id"),
    )
    
    # Course category mapping table
    op.create_table(
        "course_category_map",
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("category_id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["category_id"], ["course_categories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("course_id", "category_id"),
    )
    
    # Sections table
    op.create_table(
        "sections",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Lessons table
    op.create_table(
        "lessons",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("section_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content_type", sa.String(length=20), nullable=False),
        sa.Column("text_content", sa.Text(), nullable=True),
        sa.Column("video_url", sa.String(length=500), nullable=True),
        sa.Column("video_provider", sa.String(length=50), nullable=True),
        sa.Column("video_duration_seconds", sa.Integer(), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("is_preview", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["section_id"], ["sections.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Lesson attachments table
    op.create_table(
        "lesson_attachments",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("lesson_id", sa.UUID(), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.String(length=500), nullable=False),
        sa.Column("file_size_bytes", sa.Integer(), nullable=True),
        sa.Column("mime_type", sa.String(length=100), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Enrollments table
    op.create_table(
        "enrollments",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("student_id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("completion_percentage", sa.Numeric(precision=5, scale=2), nullable=False, server_default="0.00"),
        sa.Column("enrolled_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("dropped_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("student_id", "course_id"),
    )
    
    # Lesson progress table
    op.create_table(
        "lesson_progress",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("enrollment_id", sa.UUID(), nullable=False),
        sa.Column("lesson_id", sa.UUID(), nullable=False),
        sa.Column("is_completed", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("watch_time_seconds", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["enrollment_id"], ["enrollments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("enrollment_id", "lesson_id"),
    )
    
    # Course completions table
    op.create_table(
        "course_completions",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("student_id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("enrollment_id", sa.UUID(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["enrollment_id"], ["enrollments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Quizzes table
    op.create_table(
        "quizzes",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("lesson_id", sa.UUID(), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("time_limit_seconds", sa.Integer(), nullable=True),
        sa.Column("max_attempts", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("passing_score", sa.Numeric(precision=5, scale=2), nullable=False, server_default="70.00"),
        sa.Column("shuffle_questions", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("shuffle_answers", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("show_answers_after_submission", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Questions table
    op.create_table(
        "questions",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("quiz_id", sa.UUID(), nullable=False),
        sa.Column("question_text", sa.Text(), nullable=False),
        sa.Column("question_type", sa.String(length=20), nullable=False),
        sa.Column("media_url", sa.String(length=500), nullable=True),
        sa.Column("points", sa.Numeric(precision=5, scale=2), nullable=False, server_default="1.00"),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["quiz_id"], ["quizzes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Answer options table
    op.create_table(
        "answer_options",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("question_id", sa.UUID(), nullable=False),
        sa.Column("option_text", sa.Text(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("explanation", sa.Text(), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["question_id"], ["questions.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Quiz submissions table
    op.create_table(
        "quiz_submissions",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("quiz_id", sa.UUID(), nullable=False),
        sa.Column("student_id", sa.UUID(), nullable=False),
        sa.Column("attempt_number", sa.Integer(), nullable=False),
        sa.Column("score", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("passed", sa.Boolean(), nullable=True),
        sa.Column("grading_status", sa.String(length=20), nullable=False, server_default="pending"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("time_spent_seconds", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["quiz_id"], ["quizzes.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Submission answers table
    op.create_table(
        "submission_answers",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("submission_id", sa.UUID(), nullable=False),
        sa.Column("question_id", sa.UUID(), nullable=False),
        sa.Column("selected_option_id", sa.UUID(), nullable=True),
        sa.Column("text_answer", sa.Text(), nullable=True),
        sa.Column("is_correct", sa.Boolean(), nullable=True),
        sa.Column("points_earned", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["question_id"], ["questions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["selected_option_id"], ["answer_options.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["submission_id"], ["quiz_submissions.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Certificates table
    op.create_table(
        "certificates",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("student_id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("enrollment_id", sa.UUID(), nullable=False),
        sa.Column("completion_id", sa.UUID(), nullable=False),
        sa.Column("verification_code", sa.String(length=50), nullable=False),
        sa.Column("certificate_url", sa.String(length=500), nullable=True),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["completion_id"], ["course_completions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["enrollment_id"], ["enrollments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("verification_code"),
    )
    
    # Gradebook entries table
    op.create_table(
        "gradebook_entries",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("student_id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("quiz_submission_id", sa.UUID(), nullable=True),
        sa.Column("raw_score", sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column("adjusted_score", sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column("letter_grade", sa.String(length=5), nullable=True),
        sa.Column("grader_id", sa.UUID(), nullable=True),
        sa.Column("instructor_notes", sa.Text(), nullable=True),
        sa.Column("is_manually_overridden", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("graded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["grader_id"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["quiz_submission_id"], ["quiz_submissions.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Discussion threads table
    op.create_table(
        "discussion_threads",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("lesson_id", sa.UUID(), nullable=True),
        sa.Column("author_id", sa.UUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("is_pinned", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_locked", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Discussion comments table
    op.create_table(
        "discussion_comments",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("thread_id", sa.UUID(), nullable=False),
        sa.Column("author_id", sa.UUID(), nullable=False),
        sa.Column("parent_id", sa.UUID(), nullable=True),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("upvote_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["parent_id"], ["discussion_comments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["thread_id"], ["discussion_threads.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Comment upvotes table
    op.create_table(
        "comment_upvotes",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("comment_id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["comment_id"], ["discussion_comments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("comment_id", "user_id"),
    )
    
    # Course reviews table
    op.create_table(
        "course_reviews",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("course_id", sa.UUID(), nullable=False),
        sa.Column("student_id", sa.UUID(), nullable=False),
        sa.Column("enrollment_id", sa.UUID(), nullable=False),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("review_text", sa.Text(), nullable=True),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["enrollment_id"], ["enrollments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["student_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("course_id", "student_id"),
    )
    
    # Notifications table
    op.create_table(
        "notifications",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("recipient_id", sa.UUID(), nullable=False),
        sa.Column("notification_type", sa.String(length=50), nullable=False),
        sa.Column("channel", sa.String(length=20), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("entity_type", sa.String(length=50), nullable=True),
        sa.Column("entity_id", sa.UUID(), nullable=True),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["recipient_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Notification preferences table
    op.create_table(
        "notification_preferences",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("notification_type", sa.String(length=50), nullable=False),
        sa.Column("in_app_enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("email_enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "notification_type"),
    )
    
    # Platform settings table
    op.create_table(
        "platform_settings",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("key", sa.String(length=100), nullable=False),
        sa.Column("value", sa.Text(), nullable=False),
        sa.Column("value_type", sa.String(length=20), nullable=False, server_default="string"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("updated_by", sa.UUID(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("key"),
    )
    
    # Audit logs table
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=True),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("entity_type", sa.String(length=50), nullable=False),
        sa.Column("entity_id", sa.UUID(), nullable=True),
        sa.Column("old_values", get_json_type(), nullable=True),
        sa.Column("new_values", get_json_type(), nullable=True),
        sa.Column("ip_address", sa.String(length=45), nullable=True),
        sa.Column("user_agent", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    
    # Create indexes for performance
    op.create_index("ix_users_email", "users", ["email"], unique=False)
    op.create_index("ix_users_role", "users", ["role"], unique=False)
    op.create_index("ix_courses_instructor_id", "courses", ["instructor_id"], unique=False)
    op.create_index("ix_courses_status", "courses", ["status"], unique=False)
    op.create_index("ix_courses_slug", "courses", ["slug"], unique=False)
    op.create_index("ix_enrollments_student_id", "enrollments", ["student_id"], unique=False)
    op.create_index("ix_enrollments_course_id", "enrollments", ["course_id"], unique=False)
    op.create_index("ix_enrollments_status", "enrollments", ["status"], unique=False)
    op.create_index("ix_lesson_progress_enrollment_id", "lesson_progress", ["enrollment_id"], unique=False)
    op.create_index("ix_quiz_submissions_quiz_id", "quiz_submissions", ["quiz_id"], unique=False)
    op.create_index("ix_quiz_submissions_student_id", "quiz_submissions", ["student_id"], unique=False)
    op.create_index("ix_discussion_threads_course_id", "discussion_threads", ["course_id"], unique=False)
    op.create_index("ix_discussion_comments_thread_id", "discussion_comments", ["thread_id"], unique=False)
    op.create_index("ix_notifications_recipient_id", "notifications", ["recipient_id"], unique=False)
    op.create_index("ix_notifications_is_read", "notifications", ["is_read"], unique=False)
    op.create_index("ix_audit_logs_user_id", "audit_logs", ["user_id"], unique=False)
    op.create_index("ix_audit_logs_entity_type", "audit_logs", ["entity_type"], unique=False)
    op.create_index("ix_audit_logs_created_at", "audit_logs", ["created_at"], unique=False)


def downgrade() -> None:
    """Drop all tables."""
    
    # Drop tables in reverse order of creation (respecting FK constraints)
    op.drop_table("audit_logs")
    op.drop_table("platform_settings")
    op.drop_table("notification_preferences")
    op.drop_table("notifications")
    op.drop_table("course_reviews")
    op.drop_table("comment_upvotes")
    op.drop_table("discussion_comments")
    op.drop_table("discussion_threads")
    op.drop_table("gradebook_entries")
    op.drop_table("certificates")
    op.drop_table("submission_answers")
    op.drop_table("quiz_submissions")
    op.drop_table("answer_options")
    op.drop_table("questions")
    op.drop_table("quizzes")
    op.drop_table("course_completions")
    op.drop_table("lesson_progress")
    op.drop_table("enrollments")
    op.drop_table("lesson_attachments")
    op.drop_table("lessons")
    op.drop_table("sections")
    op.drop_table("course_category_map")
    op.drop_table("course_tag_map")
    op.drop_table("courses")
    op.drop_table("course_tags")
    op.drop_table("course_categories")
    op.drop_table("token_blacklist")
    op.drop_table("refresh_tokens")
    op.drop_table("users")
