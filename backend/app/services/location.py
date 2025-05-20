from geopy.geocoders import Nominatim
import random
from dotenv import load_dotenv
import requests
import os
import json
import psycopg2
import time
from app.db import get_db
from app.models import Location
from sqlalchemy.orm import Session
from fastapi import Depends

load_dotenv(verbose=True)


DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")


#loading geolocator
geolocator = Nominatim(user_agent="geoguessr-wa-project")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


def get_address_from_coordinates(lat: float, lng: float):
    print(lat, lng)
    location = geolocator.geocode(f"{lat},{lng}")
    if location:
        address = location.address
        return address
    else:
        return None



def random_location(random_id: int, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.id == random_id).first()
    print(location)
    if not location:
        return {"error": "Location not found"}
    return location

