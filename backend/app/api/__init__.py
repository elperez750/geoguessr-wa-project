"""
API Package Initialization

This module initializes the API package for the GeoGuessr-WA application.
It exports the main API router that combines all route modules.

The API structure follows a modular design pattern with routes organized by feature:
- auth: User authentication and account management
- game: Game session creation and gameplay logic

Usage:
- Import api_router to include all API endpoints in the main application
"""

from app.api.routes import api_router

__all__ = ['api_router']
