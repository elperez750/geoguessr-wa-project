"""
Game Models Module

This module defines the database models related to gameplay for the GeoGuessr-WA application.
It includes models for locations, games, rounds, and user interactions with the game.

Model Structure:
- Location: Stores geographical locations with panorama IDs
- Game: Tracks overall game sessions
- Round: Represents individual rounds within a game
- UserRound: Records user guesses and scores for each round

Dependencies:
- SQLAlchemy: For ORM model definitions
- app.db.Base: Base declarative class from database module
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base

class Location(Base):
    """
    Geographic location model

    Stores the coordinates and panorama ID for locations used in the game.
    Each location represents a point that can be used as a game round destination.

    Attributes:
        id (int): Primary key, location identifier
        latitude (float): Geographical latitude
        longitude (float): Geographical longitude
        pano_id (str): Google Street View panorama ID

    Relationships:
        round: One-to-one relationship with Round model
    """
    __tablename__: str = 'locations'

    id = Column(Integer, primary_key=True)
    latitude = Column(Float)
    longitude = Column(Float)
    pano_id = Column(Text, unique=True, nullable=False)


class Game(Base):
    """
    Game session model

    Represents a complete game session with multiple rounds.
    Tracks overall game metrics and timing.

    Attributes:
        id (int): Primary key, game session identifier
        user_id (int): Foreign key to the user playing this game
        started_at (datetime): When the game session began
        completed_at (datetime): When the game session ended (null if in progress)
        total_score (float): Cumulative score across all rounds
        total_distance (float): Cumulative distance off across all rounds
        locations (JSON): JSON data storing all locations used in this game

    Relationships:
        rounds: One-to-many relationship with Round model
        user: Many-to-one relationship with User model
    """
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    started_at = Column(DateTime, default=datetime.now)
    completed_at = Column(DateTime)
    total_score = Column(Float)
    total_distance = Column(Float)
    locations = Column(JSON)

    rounds = relationship('Round', back_populates='game')
    user = relationship('User', back_populates='game')

class Round(Base):
    """
    Game round model

    Represents a single round within a game session.
    Connects a game to a specific location and tracks metadata.

    Attributes:
        id (int): Primary key, round identifier
        round_number (int): Sequence number of this round (1-5 typically)
        game_id (int): Foreign key to the parent game
        location_string (str): Full address string from geocoding
        location_id (int): Foreign key to the location used for this round

    Relationships:
        location: One-to-one relationship with Location model
        user_rounds: One-to-many relationship with UserRound model
        game: Many-to-one relationship with Game model
    """
    __tablename__ = 'rounds'

    id = Column(Integer, primary_key=True)
    round_number = Column(Integer)
    game_id = Column(Integer, ForeignKey('games.id'))
    location_string = Column(Text)
    user_rounds = relationship('UserRound', back_populates='round')
    game = relationship('Game', back_populates='rounds')


class UserRound(Base):
    """
    User round interaction model

    Records a user's guess and performance for a specific round.
    Stores coordinates, distance calculation, and scoring information.

    Attributes:
        id (int): Primary key, user round identifier
        round_id (int): Foreign key to the round
        user_id (int): Foreign key to the participating user
        guess_lat (float): Latitude of user's guess
        guess_lng (float): Longitude of user's guess
        distance_off (float): Distance between guess and actual location (km)
        round_score (float): Points earned for this round
        submitted_at (datetime): When the guess was submitted

    Relationships:
        user: Many-to-one relationship with User model
        round: Many-to-one relationship with Round model
    """
    __tablename__ = 'user_rounds'

    id = Column(Integer, primary_key=True)
    round_id = Column(Integer, ForeignKey('rounds.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    guess_lat = Column(Float)
    guess_lng = Column(Float)
    distance_off = Column(Float)
    round_score = Column(Float)
    submitted_at = Column(DateTime, default=datetime.now)
    user = relationship('User', back_populates='user_rounds')
    round = relationship('Round', back_populates='user_rounds')

