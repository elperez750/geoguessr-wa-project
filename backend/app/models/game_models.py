
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import  relationship
from datetime import datetime
from app.db import Base

class Location(Base):

    __tablename__: str = 'locations'

    id = Column(Integer, primary_key=True)
    latitude = Column(Float)
    longitude = Column(Float)
    pano_id = Column(Text, unique=True, nullable=False)
    round = relationship("Round", back_populates="location", uselist=False)


class Game(Base):
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
    __tablename__ = 'rounds'

    id = Column(Integer, primary_key=True)
    round_number = Column(Integer)
    game_id = Column(Integer, ForeignKey('games.id'))
    area_name = Column(Text)
    location_id = Column(Integer, ForeignKey('locations.id'))
    location = relationship('Location', back_populates='round')
    user_rounds = relationship('UserRound', back_populates='round')
    game = relationship('Game', back_populates='rounds')

class UserRound(Base):
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




