"""
Game Service Module

This module provides game-related services for the GeoGuessr-WA application.
It handles the creation and management of game sessions, rounds, and user interactions.

Features:
- Game session creation and management
- Round creation and tracking
- User round participation recording

Dependencies:
- SQLAlchemy: For database operations
- FastAPI: For dependency injection
- app.models: Database model definitions
"""

import math
from datetime import datetime
from app.db import get_db
from app.models import Game, Round, UserRound
from sqlalchemy.orm import Session
from fastapi import Depends


def create_new_game(user_id: int, db: Session = Depends(get_db)):
    """
    Create a new game session for a user

    Initializes a new game record in the database with the starting timestamp.
    This is called when a user starts a new game session.

    Args:
        user_id (int): ID of the user starting the game
        db (Session): Database session dependency

    Returns:
        Game: Created game object with generated ID
    """
    new_game = Game(
        user_id = user_id,
        started_at = datetime.now()
    )

    db.add(new_game)
    db.commit()
    db.refresh(new_game)

    return new_game


def get_score(distance_km: float, max_score:int =5000, max_distance: int = 500) -> int:
    score = max(0, max_score * (1 - distance_km / max_distance))
    return round(score)



def create_round(game_id: int, round_number: int, location: str, db: Session = Depends(get_db)):
    """
    Create a new round within a game session

    Initializes a new round record in the database, associated with a specific game.
    Each round represents one location the player must guess.

    Args:
        game_id (int): ID of the parent game session
        round_number (int): Sequence number of this round (1-based)
        location (str): Human-readable location string
        db (Session): Database session dependency

    Returns:
        Round: Created round object with generated ID
    """
    new_round = Round(
        game_id = game_id,
        round_number = round_number,
        location_string = location
    )

    db.add(new_round)
    db.commit()
    db.refresh(new_round)
    return new_round


def create_user_round(round_id: int, user_id: int, db: Session = Depends(get_db)):
    """
    Create a user's participation record for a round

    Initializes a new user_round record in the database, linking a user to a specific round.
    Initially created with empty guess data, to be filled when the user submits a guess.

    Args:
        round_id (int): ID of the round
        user_id (int): ID of the participating user
        db (Session): Database session dependency

    Returns:
        UserRound: Created user_round object with generated ID
    """
    new_user_round = UserRound(
        round_id = round_id,
        user_id = user_id,
    )

    db.add(new_user_round)
    db.commit()
    db.refresh(new_user_round)
    return new_user_round