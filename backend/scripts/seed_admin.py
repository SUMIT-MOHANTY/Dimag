#!/usr/bin/env python3
"""
Seed admin user script.

Creates an admin user from environment variables if one doesn't exist.
"""

import asyncio
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import async_engine, AsyncSessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.core.constants import UserRole
from app.core.config import settings


async def create_admin_user():
    """Create admin user from environment variables."""
    admin_email = settings.ADMIN_EMAIL or os.getenv("ADMIN_EMAIL")
    admin_password = settings.ADMIN_PASSWORD or os.getenv("ADMIN_PASSWORD")
    
    if not admin_email or not admin_password:
        print("Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment")
        sys.exit(1)
    
    async with AsyncSessionLocal() as db:
        # Check if admin already exists
        result = await db.execute(
            select(User).where(User.email == admin_email)
        )
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            print(f"Admin user with email {admin_email} already exists")
            # Ensure role is admin
            if existing_user.role != UserRole.ADMIN:
                existing_user.role = UserRole.ADMIN
                await db.commit()
                print(f"Updated user role to admin")
            return
        
        # Create new admin user
        hashed_password = hash_password(admin_password)
        
        admin_user = User(
            email=admin_email,
            hashed_password=hashed_password,
            full_name="System Administrator",
            role=UserRole.ADMIN,
            is_active=True,
            is_email_verified=True,
        )
        
        db.add(admin_user)
        await db.commit()
        
        print(f"Admin user created successfully: {admin_email}")


if __name__ == "__main__":
    asyncio.run(create_admin_user())
