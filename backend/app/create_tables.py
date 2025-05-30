"""
Database Tables Creation Module

This module initializes the database schema for the GeoGuessr-WA application.
It creates all tables defined in the models if they don't already exist.

Features:
- Automatic table creation based on SQLAlchemy models
- Handles proper creation order for tables with dependencies
- Safe to run multiple times (will not overwrite existing data)

Dependencies:
- SQLAlchemy: For database schema creation
- app.db: Database connection configuration
- app.models: Database model definitions

Usage:
- Run this script directly to create or update all database tables
- Typically used during initial setup or after model changes
"""

from app.db import Base, engine
from app.models import auth_models, game_models  # Import all models to register them


# Explicitly define creation order to ensure dependencies are created first
from app.models.auth_models import User
from app.models.game_models import Location, Game, Round, UserRound

# Create all tables defined in the models
Base.metadata.create_all(bind=engine)  # Creates tables if they don't exist
print("Done!")
