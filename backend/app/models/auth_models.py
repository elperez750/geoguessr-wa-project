"""
Authentication Models Module

This module defines the database models related to user authentication
for the GeoGuessr-WA application. It includes the User model with
relationships to game-related entities.

Features:
- User account storage with secure password handling
- Relationship mappings to game activities
- Timestamp tracking for auditing

Dependencies:
- SQLAlchemy: For ORM model definitions
- app.db.Base: Base declarative class from database module
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from app.db import Base


class User(Base):
    """
    User account model

    Represents a registered user in the system with authentication credentials
    and relationships to their game activities.

    Attributes:
        id (int): Primary key, auto-incrementing user identifier
        username (str): Unique username for the account
        password (str): Hashed password string (using PBKDF2)
        email (str): Unique email address for the account
        created_at (datetime): When the account was created

    Relationships:
        user_rounds: One-to-many relationship with UserRound model
        game: One-to-many relationship with Game model
    """
    __tablename__: str = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(Text, unique=True, nullable=False)
    password = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    # Relationships to other models
    user_rounds = relationship('UserRound', back_populates='user')
    game = relationship('Game', back_populates='user')
