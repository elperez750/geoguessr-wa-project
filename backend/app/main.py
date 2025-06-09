
"""
GeoGuessr-WA Project - Main Application Module

This module initializes the FastAPI application for the GeoGuessr-WA project,
a geographical guessing game focused on Washington State locations.

The module sets up:
- FastAPI application instance
- CORS middleware configuration
- API router inclusion
- Base endpoint for health checks

Dependencies:
- FastAPI: Web framework for building APIs
- CORSMiddleware: Handles Cross-Origin Resource Sharing
- Nominatim: Geocoding service for location data
- Redis: Used for caching (via imported modules)
- PostgreSQL: Database for persistent storage (via imported modules)
"""

from fastapi import FastAPI, Body, Query, Request, Response
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel
from typing import List
from geopy.geocoders import Nominatim
import random
import requests
from app.api import api_router
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import re

limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI application
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Initialize geocoding service
geolocator = Nominatim(user_agent="geoguessr-wa-project")

# ============================================================================
# PYDANTIC MODELS (Data Transfer Objects)
# ============================================================================

class Guess(BaseModel):
    """
    Model representing a user's guess for a location

    Attributes:
        lat (float): Latitude coordinate of user's guess
        lng (float): Longitude coordinate of user's guess
        guess_number (int): Round number this guess corresponds to
    """
    lat: float
    lng: float
    guess_number: int

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

# Custom CORS function to handle Vercel preview deployments
def is_allowed_origin(origin: str) -> bool:
    """Check if origin is allowed"""
    allowed_patterns = [
        r"^http://localhost:3000$",
        r"^http://127\.0\.0\.1:3000$",
        r"^https://geoguessr-wa-project\.vercel\.app$",
        r"^https://geoguessr-wa-project-.*\.vercel\.app$",  # Vercel preview deployments
    ]

    for pattern in allowed_patterns:
        if re.match(pattern, origin):
            return True
    return False

# Custom CORS middleware
@app.middleware("http")
async def cors_handler(request: Request, call_next):
    # Handle preflight requests
    if request.method == "OPTIONS":
        origin = request.headers.get("origin")

        response = Response()

        if origin and is_allowed_origin(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Max-Age"] = "86400"

        return response

    # Handle actual requests
    response = await call_next(request)
    origin = request.headers.get("origin")

    if origin and is_allowed_origin(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"

    return response

# Still add the standard CORS middleware as backup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://geoguessr-wa-project.vercel.app",
        "https://geoguessr-wa-project-bgjj5fm5a-elperez750s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router with all routes defined in the api module
app.include_router(api_router)

@app.get("/")
def root():
    """
    Root endpoint that serves as a health check

    Returns:
        dict: Simple message indicating the API is operational
    """
    return {"message": "updated message"}