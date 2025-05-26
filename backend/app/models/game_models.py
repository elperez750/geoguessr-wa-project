
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Location(Base):

    __tablename__: str = 'locations'

    id = Column(Integer, primary_key=True)
    latitude = Column(Float)
    longitude = Column(Float)
    pano_id = Column(Text, unique=True, nullable=False)
    # round = relationship("Round", back_populates="location")


class Game(Base):
    __tablename__ = 'games'

    id = Column(Integer, primary_key=True)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    total_score = Column(Float)
    total_distance = Column(Float)
    # rounds = relationship('Round', back_populates='game')
    # user = relationship('User', back_populates='game')


class Round(Base):
    __tablename__ = 'rounds'

    id = Column(Integer, primary_key=True)
    round_number = Column(Integer)
    game_id = Column(Integer, ForeignKey('games.id'))
    distance_off = Column(Float)
    score = Column(Float)
    guess_lat = Column(Float)
    guess_lng = Column(Float)
    location_id = Column(Integer, ForeignKey('locations.id'))
    # location = relationship('Location', back_populates='round')
    # game = relationship('Game', back_populates='round')



