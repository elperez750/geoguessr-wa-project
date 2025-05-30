"""
API Routes Initialization Module

This module combines all API route modules into a single router.
It organizes endpoints by feature area with appropriate prefixes and tags.

Route Structure:
- /game/*: Game-related endpoints (starting games, rounds, guessing)
- /auth/*: Authentication endpoints (register, login, user profile)

Dependencies:
- FastAPI: For routing functionality
- Route modules: Individual feature area route definitions
"""

from fastapi import APIRouter
from app.api.routes import game, auth


# Create main API router that will include all route modules
api_router = APIRouter()

# Include game-related routes with /game prefix and "game" tag
api_router.include_router(game.router, prefix="/game", tags=["game"])

# Include authentication-related routes with /auth prefix and "auth" tag
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

