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

from fastapi import FastAPI, Body, Query
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

# Define allowed origins for CORS
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Allow all hosts for now
)

# 2. Add CORS middleware second
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://geoguessr-wa-project.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "Cookie",
        "Set-Cookie"
    ],
)
# Include API router with all routes defined in the api module
app.include_router(api_router)

# ============================================================================
# BASE ROUTES
# ============================================================================

@app.get("/")
def root():
    """
    Root endpoint that serves as a health check

    Returns:
        dict: Simple message indicating the API is operational
    """
    return {"message": "updated message"}


