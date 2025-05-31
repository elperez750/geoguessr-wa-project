"""
Game Routes Module

This module handles all game-related API endpoints for the GeoGuessr-wa application.
It manages game creation, round management, and user interactions during gameplay.

Dependencies:
- Redis: Used for caching frequently accessed data (location count, current pano_id)
- PostgreSQL: Stores persistent game data (games, rounds, user_rounds)
- Google Maps API: For geocoding and street view data
"""
import json

from fastapi import APIRouter, Query, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from app.services import (
    get_address_from_coordinates,
    get_random_pano_id,
    haversine_formula,
    create_new_game,
    redis_client,
    create_round,
    create_user_round,
    get_coords_from_pano_id
)
from app.models import Location
from app.db import get_db
from app.services.authentication import get_user_from_cookie
from sqlalchemy.orm import Session
import random
from datetime import datetime

router = APIRouter()


# ============================================================================
# PYDANTIC MODELS (Data Transfer Objects)
# ============================================================================

class GameCreate(BaseModel):
    """Request model for creating a new game"""
    started_at: str


class GameResponse(BaseModel):
    """Response model for game data"""
    id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_score: Optional[float] = None
    total_distance: Optional[float] = None
    locations: Optional[List] = None


class RoundCreate(BaseModel):
    """Request model for creating a new round"""
    round_number: int
    game_id: int
    area_name: str
    location_id: int


class UserRoundCreate(BaseModel):
    """Request model for creating a user's round participation"""
    round_id: int
    user_id: int


# ============================================================================
# DATABASE SCHEMA REFERENCE (for documentation)
# ============================================================================
"""
UserRound Table Structure:
- id: Primary key
- round_id: Foreign key to rounds table
- user_id: Foreign key to users table
- guess_lat: Latitude of user's guess
- guess_lng: Longitude of user's guess
- distance_off: Distance between guess and actual location (km)
- round_score: Points earned for this round
- submitted_at: Timestamp when guess was submitted

Round Table Structure:
- id: Primary key
- round_number: Which round this is (1, 2, 3, etc.)
- game_id: Foreign key to games table
- area_name: Human-readable location description
- location_string: Full address string from geocoding
- location_id: Foreign key to locations table (contains lat/lng/pano_id)
"""


# ============================================================================
# GAME ROUTES
# ============================================================================

@router.get('/get-round-results')
def get_results():
    """
    Calculate and return results after a round is completed.

    TODO: Implement this endpoint to:
    1. Accept user's guess coordinates
    2. Compare with actual location coordinates
    3. Calculate distance using haversine formula
    4. Calculate score based on accuracy
    5. Update user_round record with results
    6. Return results for frontend display
    """
    pass


@router.get('/get-location')
def get_location(lat: float = Query(...), lng: float = Query(...)):
    """
    Convert latitude/longitude coordinates to a human-readable address.

    Args:
        lat (float): Latitude coordinate
        lng (float): Longitude coordinate

    Returns:
        str: Formatted address string (e.g., "12312, 51st Street, Edmonds, WA")

    Uses reverse geocoding to convert coordinates to street addresses.
    Useful for displaying location names to users.
    """
    location = get_address_from_coordinates(lat, lng)
    if location:
        return location
    else:
        return "Nothing was found for the following coordinates"


@router.get('/start-game')
def start_game(request: Request, db: Session = Depends(get_db)):
    """
    Initialize a new game session for the authenticated user.

    This endpoint performs several key operations:
    1. Validates user authentication via cookies
    2. Uses Redis caching for performance optimization
    3. Selects a random location for the first round
    4. Creates database records for game tracking
    5. Returns initial game data to frontend

    Flow:
    1. Check if user is authenticated
    2. We will get the game state from Redis. If not, we will create a new game session.
    3. Create new game, round, and user_round records in database
    4. Get pano ID
    5. Get coordinates and address for the selected location
    6. Return game data to frontend

    Args:
        request (Request): HTTP request object (contains cookies)
        db (Session): Database session dependency

    Returns:
        dict: Game initialization data including:
            - pano_id: Google Street View panorama ID
            - game_id: Database ID of created game
            - current_round: Round number (always 1 for new games)
            - user_id: ID of authenticated user
            - round_id: Database ID of created round
            - number_of_locations: Total number of locations available
            - total_score: Initial score for the user (0 for new games)

    Raises:
        HTTPException: 401 if user is not authenticated

    Redis Caching Strategy:
        - 'user:{user_id}:game_session' is set to game data JSON string'
    """
    # Authentication check
    user = get_user_from_cookie(request)
    if not user:
        raise HTTPException(status_code=401, detail="User is not logged in")


    # We first check to see if the user has an existing game session. If so, we return the game data from Redis.
    # If not, we create a new game session and return the game data.
    session_key = f'user:{user["user_id"]}:game_session'
    existing_session = redis_client.get(session_key)

    if existing_session is None:
        # Getting number of locations from database. This could easily be hardcoded
        number_of_locations = db.query(Location).count()

        # Random id to get a random location
        random_id = random.randint(1, number_of_locations)

        # This is what displays the map on the frontend.
        pano_id = get_random_pano_id(random_id, db)

        coords = get_coords_from_pano_id(pano_id, db)
        # This is what displays the address on the frontend.
        string_location = get_address_from_coordinates(coords['lat'], coords['lng'])
        new_game = create_new_game(user['user_id'], db)  # Creates games table record
        new_round = create_round(new_game.id, 1, string_location, db)  # Creates rounds table record
        user_round = create_user_round(new_round.id, user['user_id'], db)  # Creates user_rounds table record


        game_data = {
            "game_id": new_game.id,
            "round_id": new_round.id,
            "user_id": user["user_id"],
            "current_round": new_round.round_number,
            "pano_id": pano_id,
            "number_of_locations": number_of_locations,
            "total_score": user_round.round_score,
        }

        game_data_json = json.dumps(game_data)
        redis_client.set(session_key, game_data_json)
        return game_data


    return json.loads(existing_session)


@router.get('/next-round')
def get_location_from_db(request: Request, db: Session = Depends(get_db)):
    """
    Advance to the next round of the current game.

    TODO: Implement this endpoint to:
    1. Validate current game state
    2. Check if more rounds are available
    3. Select new random location
    4. Create new round record
    5. Update Redis cache with new data
    6. Return new round data to frontend

    Should increment round number and provide new pano_id.
    """
    pass



# ============================================================================
# UTILITY FUNCTIONS USED (imported from app.services)
# ============================================================================
"""
Key utility functions this module depends on:

get_address_from_coordinates(lat, lng):
    - Reverse geocoding using Google Maps API
    - Converts coordinates to human-readable addresses

get_random_pano_id(location_id, db):
    - Retrieves panorama ID from locations table
    - Used for Google Street View display

haversine_formula(lat1, lng1, lat2, lng2):
    - Calculates great-circle distance between two points
    - Returns distance in kilometers
    - Used for scoring accuracy of guesses

create_new_game(user_id, db):
    - Creates new record in games table
    - Returns Game object with generated ID

create_round(game_id, round_number, location_string, db):
    - Creates new record in rounds table
    - Links round to specific game
    - Returns Round object with generated ID

create_user_round(round_id, user_id, db):
    - Creates new record in user_rounds table
    - Tracks user participation in specific round
    - Initially empty, filled when user submits guess

get_coords_from_pano_id(pano_id, db):
    - Retrieves lat/lng coordinates for given panorama ID
    - Returns dict with 'lat' and 'lng' keys

get_user_from_cookie(request):
    - Validates user authentication from HTTP cookies
    - Returns user data dict if valid, None if invalid
"""