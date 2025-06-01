"""
Services Package

This package contains all business logic and utility services for the GeoGuessr-WA application.
It provides reusable functions that implement the core functionality of the application.

Modules:
- authentication: User authentication and account management
- game: Game session and round management
- location: Geographic calculations and location data handling
- redis_client: Redis caching client configuration

These services are used by the API routes to implement the application's functionality
while keeping the route handlers clean and focused on HTTP concerns.
"""

# Import all service functions for easy access from the services package
from app.services.location import get_address_from_coordinates, get_random_pano_id, haversine_formula, \
    get_coords_from_pano_id
from app.services.authentication import hash_password, verify_password, create_access_token, verify_token, create_user, get_user_from_cookie
from app.services.redis_client import redis_client
from app.services.game import create_new_game, create_round, create_user_round, get_score

# Export all service functions for easy imports elsewhere in the application
__all__ = [
    # Location services
    "get_address_from_coordinates", "get_random_pano_id", "haversine_formula", "get_coords_from_pano_id",
    # Authentication services
    "create_access_token", "verify_token", "verify_password", "hash_password", "create_user", "get_user_from_cookie",
    # Redis client
    "redis_client",
    # Game services
    "create_new_game", "create_round", "create_user_round", "get_score"
]
