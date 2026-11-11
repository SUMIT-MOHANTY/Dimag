#!/usr/bin/env python3
"""
Seed demo data script.

Creates demo instructors, students, courses, categories, tags, and enrollments.
"""

import asyncio
import os
import sys
from datetime import datetime, timedelta
from uuid import uuid4

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.course import Course, CourseCategory, CourseTag, course_tag_map, course_category_map
from app.models.content import Section, Lesson
from app.models.enrollment import Enrollment
from app.core.security import hash_password
from app.core.constants import UserRole, CourseStatus, ContentType, EnrollmentStatus
from app.utils.slugify import slugify


# Demo data
INSTRUCTORS = [
    {"email": "amara.osei@openlms.dev", "name": "Dr. Amara Osei", "bio": "Expert in software engineering with 15 years of industry experience."},
    {"email": "lena.fischer@openlms.dev", "name": "Prof. Lena Fischer", "bio": "Design thinking specialist and UX researcher."},
]

STUDENTS = [
    {"email": "student1@openlms.dev", "name": "Alex Johnson"},
    {"email": "student2@openlms.dev", "name": "Maria Garcia"},
    {"email": "student3@openlms.dev", "name": "James Wilson"},
    {"email": "student4@openlms.dev", "name": "Sarah Chen"},
    {"email": "student5@openlms.dev", "name": "Michael Brown"},
]

COURSES = [
    {
        "title": "Advanced Python Programming",
        "description": "Master advanced Python concepts including decorators, generators, async programming, and design patterns.",
        "short_description": "Advanced Python for experienced developers",
        "level": "advanced",
        "price": 99.99,
        "is_free": False,
    },
    {
        "title": "UX Design Fundamentals",
        "description": "Learn the principles of user experience design, from research to prototyping and usability testing.",
        "short_description": "Foundation course in UX design principles",
        "level": "beginner",
        "price": 49.99,
        "is_free": False,
    },
    {
        "title": "Data Science with Pandas",
        "description": "Comprehensive introduction to data analysis and manipulation using Python and Pandas.",
        "short_description": "Data science fundamentals with Pandas",
        "level": "intermediate",
        "price": 0.00,
        "is_free": True,
    },
]

CATEGORIES = [
    {"name": "Programming", "description": "Software development and programming courses"},
    {"name": "Design", "description": "UI/UX and graphic design courses"},
]

TAGS = [
    {"name": "Python", "slug": "python"},
    {"name": "JavaScript", "slug": "javascript"},
    {"name": "UX", "slug": "ux"},
    {"name": "Data Science", "slug": "data-science"},
]

DEMO_PASSWORD = "DemoPass123!"


async def create_users(db: AsyncSession):
    """Create demo instructors and students."""
    users = []
    
    # Create instructors
    for instructor_data in INSTRUCTORS:
        result = await db.execute(
            select(User).where(User.email == instructor_data["email"])
        )
        if not result.scalar_one_or_none():
            user = User(
                id=uuid4(),
                email=instructor_data["email"],
                hashed_password=hash_password(DEMO_PASSWORD),
                full_name=instructor_data["name"],
                bio=instructor_data["bio"],
                role=UserRole.INSTRUCTOR,
                is_active=True,
                is_email_verified=True,
            )
            db.add(user)
            users.append(user)
            print(f"Created instructor: {instructor_data['name']}")
    
    # Create students
    for student_data in STUDENTS:
        result = await db.execute(
            select(User).where(User.email == student_data["email"])
        )
        if not result.scalar_one_or_none():
            user = User(
                id=uuid4(),
                email=student_data["email"],
                hashed_password=hash_password(DEMO_PASSWORD),
                full_name=student_data["name"],
                role=UserRole.STUDENT,
                is_active=True,
                is_email_verified=True,
            )
            db.add(user)
            users.append(user)
            print(f"Created student: {student_data['name']}")
    
    await db.commit()
    return users


async def create_categories(db: AsyncSession):
    """Create course categories."""
    categories = []
    
    for cat_data in CATEGORIES:
        result = await db.execute(
            select(CourseCategory).where(CourseCategory.slug == slugify(cat_data["name"]))
        )
        if not result.scalar_one_or_none():
            category = CourseCategory(
                id=uuid4(),
                name=cat_data["name"],
                slug=slugify(cat_data["name"]),
                description=cat_data["description"],
            )
            db.add(category)
            categories.append(category)
            print(f"Created category: {cat_data['name']}")
    
    await db.commit()
    return categories


async def create_tags(db: AsyncSession):
    """Create course tags."""
    tags = []
    
    for tag_data in TAGS:
        result = await db.execute(
            select(CourseTag).where(CourseTag.slug == tag_data["slug"])
        )
        if not result.scalar_one_or_none():
            tag = CourseTag(
                id=uuid4(),
                name=tag_data["name"],
                slug=tag_data["slug"],
            )
            db.add(tag)
            tags.append(tag)
            print(f"Created tag: {tag_data['name']}")
    
    await db.commit()
    return tags


async def create_courses(db: AsyncSession, instructors):
    """Create demo courses with sections and lessons."""
    courses = []
    
    for i, course_data in enumerate(COURSES):
        result = await db.execute(
            select(Course).where(Course.slug == slugify(course_data["title"]))
        )
        if result.scalar_one_or_none():
            continue
        
        instructor = instructors[i % len(instructors)]
        
        course = Course(
            id=uuid4(),
            title=course_data["title"],
            slug=slugify(course_data["title"]),
            description=course_data["description"],
            short_description=course_data["short_description"],
            instructor_id=instructor.id,
            status=CourseStatus.PUBLISHED,
            price=course_data["price"],
            is_free=course_data["is_free"],
            level=course_data["level"],
            language="en",
            published_at=datetime.utcnow(),
        )
        db.add(course)
        courses.append(course)
        print(f"Created course: {course_data['title']}")
        
        # Create sections
        for section_num in range(1, 4):
            section = Section(
                id=uuid4(),
                course_id=course.id,
                title=f"Section {section_num}: Core Concepts",
                description=f"Fundamental concepts for section {section_num}",
                position=section_num * 1000,
            )
            db.add(section)
            
            # Create lessons for each section
            for lesson_num in range(1, 4):
                lesson = Lesson(
                    id=uuid4(),
                    section_id=section.id,
                    title=f"Lesson {section_num}.{lesson_num}: Key Topics",
                    content_type=ContentType.TEXT,
                    text_content=f"This is the content for lesson {section_num}.{lesson_num}. It covers important topics and concepts.",
                    position=lesson_num * 100,
                    is_preview=(section_num == 1 and lesson_num == 1),
                    is_published=True,
                )
                db.add(lesson)
    
    await db.commit()
    return courses


async def create_enrollments(db: AsyncSession, students, courses):
    """Create demo enrollments."""
    if not courses:
        return
    
    for i, student in enumerate(students[:3]):  # Enroll first 3 students
        course = courses[i % len(courses)]
        
        # Check if enrollment exists
        result = await db.execute(
            select(Enrollment).where(
                Enrollment.student_id == student.id,
                Enrollment.course_id == course.id
            )
        )
        if result.scalar_one_or_none():
            continue
        
        enrollment = Enrollment(
            id=uuid4(),
            student_id=student.id,
            course_id=course.id,
            status=EnrollmentStatus.ACTIVE,
            enrolled_at=datetime.utcnow(),
        )
        db.add(enrollment)
        print(f"Created enrollment: {student.full_name} -> {course.title}")
    
    await db.commit()


async def seed_demo_data():
    """Main seed function."""
    async with AsyncSessionLocal() as db:
        print("Creating demo users...")
        users = await create_users(db)
        
        # Get instructors and students
        result = await db.execute(
            select(User).where(User.role == UserRole.INSTRUCTOR)
        )
        instructors = result.scalars().all()
        
        result = await db.execute(
            select(User).where(User.role == UserRole.STUDENT)
        )
        students = result.scalars().all()
        
        print("\nCreating categories...")
        await create_categories(db)
        
        print("\nCreating tags...")
        await create_tags(db)
        
        print("\nCreating courses...")
        courses = await create_courses(db, instructors)
        
        print("\nCreating enrollments...")
        await create_enrollments(db, students, courses)
        
        print("\nDemo data seeding complete!")
        print(f"Demo password for all users: {DEMO_PASSWORD}")


if __name__ == "__main__":
    asyncio.run(seed_demo_data())
