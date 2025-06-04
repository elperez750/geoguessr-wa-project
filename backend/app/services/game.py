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
from sqlalchemy import func


# All game table related functions
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

def update_game(user_id: int, total_score: int, total_distance: float, db: Session = Depends(get_db)):
    game = db.query(Game).filter(Game.user_id == user_id).first()
    if game:
        game.completed_at = datetime.now()
        game.total_score = total_score
        game.total_distance = total_distance
        db.commit()
        return game
    else:
        raise ValueError("game not found")



def get_game_results(user_id: int, game_id, db: Session = Depends(get_db)):
    total_score = get_total_score(user_id, db)
    total_distance_off = get_total_distance_off(user_id, db)
    rounds = db.query(Round).filter(Round.game_id == game_id).all()
    round_ids = [round_object.id for round_object in rounds]
    user_round_stats = db.query(UserRound).filter(UserRound.round_id.in_(round_ids)).all()





def get_score(distance_km: float, max_score:int =5000, max_distance: int = 500) -> int:
    score = max(0, max_score * (1 - distance_km / max_distance))
    return round(score)



# All round table related functions
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



# All user_round table related functions
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
        round_score = 0,
    )

    db.add(new_user_round)
    db.commit()
    db.refresh(new_user_round)
    return new_user_round



def update_user_round(round_id, guess_location_string: str,  guess_lat: float, guess_lng: float, distance_off: float, round_score: float, db: Session = Depends(get_db)):
    game_round = db.query(UserRound).filter(UserRound.round_id == round_id).first()
    print("game_round", game_round)
    if game_round:
        game_round.guess_lat = guess_lat
        game_round.guess_lng = guess_lng
        game_round.guess_location_string = guess_location_string
        game_round.distance_off = distance_off
        game_round.round_score = round_score
    else:
        raise ValueError("game round not found")
    db.commit()
    return game_round



def get_total_score(user_id: int, db: Session = Depends(get_db)):
    total_score = db.query(func.sum(UserRound.round_score)).filter(
        UserRound.user_id == user_id
    ).scalar_subquery()

    return total_score


def get_total_distance_off(user_id: int, db: Session = Depends(get_db)):
    total_distance_off = db.query(func.sum(UserRound.distance_off)).filter(
        UserRound.user_id == user_id
    ).scalar_subquery()

    return total_distance_off