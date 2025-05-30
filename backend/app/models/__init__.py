"""
Models Package

This package contains all SQLAlchemy ORM model definitions for the GeoGuessr-WA application.
It provides the database schema structure through class-based models.

Modules:
- auth_models: User authentication related models
- game_models: Game mechanics related models (locations, games, rounds, etc.)

The models defined here are used throughout the application for database operations
and establish relationships between different data entities.
"""

from app.models.game_models import Location, Round, Game, UserRound
from app.models.auth_models import User

# Export all model classes for easy imports elsewhere in the application
__all__ = ["Location", "Round", "Game", "User", "UserRound"]
