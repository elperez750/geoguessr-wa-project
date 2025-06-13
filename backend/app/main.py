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

origins = [
    "http://localhost:3000",            # Local development
    "http://127.0.0.1:3000",            # Local development alternative
    "https://geoguessr-wa-project.vercel.app",   # Your main production frontend

]


# CORS middleware **must** be configured like this for cookies to work
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],             # Or restrict to specific methods if you want
    allow_headers=["*"],             # Accept any headers from frontend
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