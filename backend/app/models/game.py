from sqlalchemy import Column, Integer, String, Float,  Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True)
    latitude = Column(Float)
    longitude = Column(Float)
    pano_id = Column(Text, unique=True, nullable=False)

