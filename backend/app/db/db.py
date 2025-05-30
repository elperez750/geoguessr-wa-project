"""
Database Connection Module

This module establishes the database connection for the GeoGuessr-WA application.
It provides the SQLAlchemy engine, session, and base classes needed for database operations.

Features:
- Environment-based configuration using dotenv
- SQLAlchemy engine setup
- Session management with automatic cleanup
- Base declarative class for ORM models

Dependencies:
- SQLAlchemy: ORM and database toolkit
- python-dotenv: For loading environment variables
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Create base class for declarative models
Base = declarative_base()

# Load environment variables from .env file
load_dotenv()

# Get database connection string from environment
DB_URL = os.getenv('DB_URL')

# Create SQLAlchemy engine with connection string
engine = create_engine(DB_URL)

# Create session factory bound to the engine
Session = sessionmaker(bind=engine)


def get_db():
    """
    Dependency function that provides a database session

    Creates a new SQLAlchemy session and handles proper cleanup
    when the request is complete, ensuring connections are returned
    to the pool.

    Yields:
        Session: SQLAlchemy database session object
    """
    db = Session()
    try:
        yield db
    finally:
        # Ensure connection is closed even if an exception occurs
        db.close()
