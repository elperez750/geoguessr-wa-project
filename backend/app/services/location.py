"""
Location Service Module

This module provides geographic location services for the GeoGuessr-WA application.
It handles geocoding, coordinate operations, and location-related database operations.

Features:
- Reverse geocoding (coordinates to address)
- Location data retrieval from database
- Distance calculation using the Haversine formula
- Panorama ID management for Street View

Dependencies:
- Geopy: For geocoding operations
- SQLAlchemy: For database queries
- Math: For geographical calculations
- Environment variables: For API keys and database configuration
"""

import math
from geopy.geocoders import Nominatim
from dotenv import load_dotenv
import os
from app.db import get_db
from app.models import Location
from sqlalchemy.orm import Session
from fastapi import Depends

# Load environment variables from .env file
load_dotenv(verbose=True)

# Database configuration from environment variables
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# Initialize geocoding service
geolocator = Nominatim(user_agent="geoguessr-wa-project")

# Google Maps API key for advanced features
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def get_address_from_coordinates(lat: float, lng: float):
    """
    Convert latitude/longitude coordinates to a human-readable address

    Uses Nominatim geocoder to perform reverse geocoding.

    Args:
        lat (float): Latitude coordinate
        lng (float): Longitude coordinate

    Returns:
        str: Formatted address string, or None if geocoding fails
    """
    print(lat, lng)
    location = geolocator.geocode(f"{lat},{lng}")
    if location:
        address = location.address
        return address
    else:
        return None


def get_random_pano_id(random_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a panorama ID from the database by location ID

    Gets the Street View panorama ID for a specific location,
    used to display the location in Street View for the game.

    Args:
        random_id (int): Database ID of the location
        db (Session): Database session dependency

    Returns:
        str: Panorama ID string, or error dict if not found
    """
    location_pano_id = db.query(Location.pano_id).filter(Location.id == random_id).scalar()
    if not location_pano_id:
        return {"error": "Location not found"}
    return location_pano_id


def get_coords_from_pano_id(pano_id: str, db: Session = Depends(get_db)):
    """
    Retrieve coordinates for a given panorama ID

    Looks up latitude and longitude for a Street View panorama ID.
    Used to determine the actual location for scoring.

    Args:
        pano_id (str): Google Street View panorama ID
        db (Session): Database session dependency

    Returns:
        dict: Dictionary containing 'lat' and 'lng' keys with coordinate values
    """
    location_entry = db.query(Location).filter(Location.pano_id == pano_id).first()
    lat = location_entry.latitude
    lng = location_entry.longitude

    coords = {"lat": lat, "lng": lng}
    print(coords)
    return coords


def haversine_formula(lat1, lat2, lng1, lng2):
    """
    Calculate the great-circle distance between two points

    Implements the Haversine formula to calculate the distance between
    two points on the Earth's surface specified by latitude/longitude.
    Used to determine how far a user's guess is from the actual location.

    Args:
        lat1 (float): Latitude of first point
        lat2 (float): Latitude of second point
        lng1 (float): Longitude of first point
        lng2 (float): Longitude of second point

    Returns:
        float: Distance between points in kilometers
    """
    # Earth's radius in kilometers
    r = 6371

    # Convert latitude and longitude from degrees to radians
    lat1_radians = math.radians(lat1)
    lat2_radians = math.radians(lat2)
    lng1_radians = math.radians(lng1)
    lng2_radians = math.radians(lng2)

    # Calculate differences
    difference_in_lat = lat2_radians - lat1_radians
    difference_in_lng = lng2_radians - lng1_radians

    # Haversine formula calculation
    a = (pow(math.sin(difference_in_lat/2), 2)) + \
        (math.cos(lat1_radians)) * (math.cos(lat2_radians)) * \
        (pow(math.sin(difference_in_lng/2), 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = r * c
    return d


def fetch_current_round_coordinates():
    """
    Retrieve coordinates for the current round from cache or database

    TODO: Implement this function to:
    1. Get the current round information from Redis or session
    2. Query the database for the location coordinates
    3. Return the coordinates for scoring
    """
    pass