"""
Database Package

This package provides database connectivity and configuration for the GeoGuessr-WA application.
It centralizes database access through SQLAlchemy ORM tools.

Features:
- Connection management through engine configuration
- Session dependency for FastAPI dependency injection
- Base class for declarative model definitions

The exported components (get_db, Base, engine) are used throughout the application
to maintain a consistent database access pattern.
"""

from app.db.db import get_db, Base, engine

# Export essential database components
__all__ = ["get_db", "Base", "engine"]
