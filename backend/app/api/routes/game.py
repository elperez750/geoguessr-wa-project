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

from sqlalchemy.sql.functions import user

from app.services import (
    get_address_from_coordinates,
    get_random_pano_id,
    haversine_formula,
    create_new_game,
    redis_client,
    create_round,
    create_user_round,
    get_coords_from_pano_id,
    get_score,
    update_user_round,
    get_total_score,
    get_total_distance_off,
    update_game,
    limiter
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


class RoundResults(BaseModel):
    success: bool
    round_lat: float
    round_lng: float
    user_guess_lat: float
    user_guess_lng: float
    distance_off: float
    guess_location_string: str
    actual_location_string: str
    round_score: float
    total_score: float
    total_distance: float






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


@router.get('/get-game-results')
def get_game_stats(request: Request, db: Session = Depends(get_db)):


    user = get_user_from_cookie(request)
    if not user:
        raise HTTPException(status_code=401, detail="User is not logged in")

    redis_response = redis_client.get(f'user:{user["user_id"]}:game_session')
    if not redis_response:
        raise HTTPException(status_code=401, detail="User is not logged in")

    game_data = json.loads(redis_response)

    game_id = game_data['game_id']

    total_score = get_total_score(game_id, db)
    total_distance_off = get_total_distance_off(game_id, db)


    game_stats = update_game(user['user_id'], total_score, total_distance_off, db)



    game_stats["all_locations"] = game_data["all_actual_string_locations"]
    game_stats["all_scores"] = game_data["all_round_scores"]
    game_stats["all_distances"] = game_data["all_round_distances"]
    print(f"here are the game stats {game_stats}")
    return game_stats





@limiter.limit("1/2seconds")
@router.get('/get-round-results', response_model=RoundResults)
def get_round_results(request: Request, db: Session = Depends(get_db)):
    """
    Calculate and return results after a round is completed.
    """
    try:
        # Input validation
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        if not lat or not lng:
            raise HTTPException(status_code=400, detail="Missing coordinates")

        # Convert coordinates with error handling
        try:
            guess_lat = float(lat)
            guess_lng = float(lng)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid coordinate format")

        # Validate coordinate ranges
        if not (-90 <= guess_lat <= 90) or not (-180 <= guess_lng <= 180):
            raise HTTPException(status_code=400, detail="Coordinates out of valid range")

        # User authentication
        user = get_user_from_cookie(request)
        if not user:
            raise HTTPException(status_code=401, detail="User is not logged in")

        # Get game session from Redis
        lock_key = f'user:{user["user_id"]}:guess_lock'
        redis_response = redis_client.get(f'user:{user["user_id"]}:game_session')
        if not redis_response:
            raise HTTPException(status_code=404, detail="Game session not found")

        try:
            game_data = json.loads(redis_response)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid game session data")

        # Extract game data with defaults
        actual_location_string = game_data.get("current_string_location", "Unknown location")
        round_lat = game_data.get("game_lats")[game_data.get("current_round") - 1]
        round_lng = game_data.get("game_lngs")[game_data.get("current_round") - 1]

        print(f'Current round lat {round_lat}')
        print(f'Current round lng {round_lng}')

        if round_lat is None or round_lng is None:
            raise HTTPException(status_code=400, detail="Round coordinates not found")

        # Calculate results
        guess_location_string = get_address_from_coordinates(guess_lat, guess_lng)
        distance_off = haversine_formula(guess_lat, guess_lng, round_lat, round_lng)
        user_score = get_score(distance_off)
        game_data["all_round_scores"].append(user_score)
        game_data["all_round_distances"].append(distance_off)
        # Update database
        user_id = user["user_id"]
        round_id = game_data["round_id"]
        updated_user_stats = update_user_round(round_id, guess_location_string, guess_lat, guess_lng, distance_off, user_score, db)

        if not updated_user_stats:
            raise HTTPException(status_code=500, detail="Failed to update user round data")

        # Update Redis session
        game_data["total_score"] = game_data.get("total_score", 0) + user_score
        game_data["total_distance"] = game_data.get("total_distance", 0) + distance_off
        game_data["current_round"] = game_data.get("current_round", 0) + 1



        # Optional: Track round completion
        game_data["rounds_completed"] = game_data.get("rounds_completed", 0) + 1

        game_data_json = json.dumps(game_data)
        redis_client.set(f'user:{user["user_id"]}:game_session', game_data_json)

        return {
            "success": True,
            "round_lat": round_lat,
            "round_lng": round_lng,
            "user_guess_lat": guess_lat,
            "user_guess_lng": guess_lng,
            "distance_off": round(distance_off, 2),
            "guess_location_string": guess_location_string,
            "actual_location_string": actual_location_string,
            "round_score": user_score,
            "total_score": game_data["total_score"],
            "total_distance": round(game_data["total_distance"], 2)
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log unexpected errors
        print(f"Unexpected error in get_results: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post('/reset-game')
async def reset_game(request: Request, db: Session = Depends(get_db)):
    user = get_user_from_cookie(request)
    if not user:
        raise HTTPException(status_code=401, detail="User is not logged in")

    session_key = f'user:{user["user_id"]}:game_session'
    if not session_key:
        raise HTTPException(status_code=404, detail="Game session not found")

    redis_client.delete(session_key)
    return {"success": True}

@router.post('/start-game')
async def start_game(request: Request, db: Session = Depends(get_db)):
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
    redis_response = redis_client.get(session_key)

    if redis_response is None:
        # Getting number of locations from database. This could easily be hardcoded
        number_of_locations = db.query(Location).count()


        # We will get 5 different pano ids

        round_pano_ids = [get_random_pano_id(random.randint(1, number_of_locations), db) for _ in range(5)]


        # We will get the corresponding coordinates and string location for the pano ids generated
        all_lats = []
        all_lngs = []
        all_actual_string_locations = []
        for pano_id in round_pano_ids:
            coords = get_coords_from_pano_id(str(pano_id), db)
            all_lats.append(coords['lat'])
            all_lngs.append(coords['lng'])
            all_actual_string_locations.append(get_address_from_coordinates(coords['lat'], coords['lng']))



        new_user = user['user_id']
        string_location = all_actual_string_locations[0]
        new_game = create_new_game(new_user, db)  # Creates games table record
        new_round = create_round(new_game.id, 1, string_location, db)  # dCreates rounds table record
        user_round = create_user_round(new_round.id, new_user, new_game.id, db)  # Creates user_rounds table record


        game_data = {
            "game_id": new_game.id,
            "game_lats": all_lats,
            "game_lngs": all_lngs,
            "round_id": new_round.id,
            "user_id": user["user_id"],
            "current_round": new_round.round_number,
            "current_string_location": string_location,
            "all_pano_ids": round_pano_ids,
            "all_round_scores": [],
            "number_of_locations": number_of_locations,
            "total_score": user_round.round_score,
            "all_round_distances": [],
            "all_actual_string_locations": all_actual_string_locations,

        }

        game_data_json = json.dumps(game_data)
        redis_client.set(session_key, game_data_json)
        redis_response = redis_client.get(session_key)
        return json.loads(redis_response)


    return json.loads(redis_response)


@router.post('/next-round')
async def get_next_round(request: Request, db: Session = Depends(get_db)):
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


    user = get_user_from_cookie(request)
    if not user:
        raise HTTPException(status_code=401, detail="User is not logged in")



    session_key = f'user:{user["user_id"]}:game_session'
    redis_response = redis_client.get(session_key)


    if redis_response is None:
        raise HTTPException(status_code=404, detail="Game session not found")



    game_data = json.loads(redis_response)
    current_round = game_data['current_round']
    pano_id = game_data['all_pano_ids'][current_round - 1]

    game_id = game_data['game_id']
    user_id = user["user_id"]
    # This is what displays the address on the frontend.
    string_location = get_location_string(float(game_data['game_lats'][current_round - 1]), float(game_data['game_lngs'][current_round - 1]))

    # Creating a new round and user stats for that specific round
    new_round = create_round(game_data['game_id'], current_round, string_location, db)
    user_round = create_user_round(new_round.id, user_id,  game_id, db)

    game_data['round_id'] = new_round.id
    game_data['current_pano_id'] = pano_id
    game_data_json = json.dumps(game_data)
    redis_client.set(session_key, game_data_json)

    redis_response = redis_client.get(session_key)
    print(json.loads(redis_response))
    return json.loads(redis_response)

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

def get_location_string(lat: float, lng: float) -> str:
    result = get_address_from_coordinates(lat, lng)
    return result or "Unknown location"