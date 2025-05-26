import math
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



def get_random_pano_id(random_id: int, db: Session = Depends(get_db)):
    location_pano_id = db.query(Location.pano_id).filter(Location.id == random_id).scalar()
    if not location_pano_id:
        return {"error": "Location not found"}
    return location_pano_id




def haversine_formula(lat1, lat2, lng1, lng2):
    r = 6371
    lat1_radians = math.radians(lat1)
    lat2_radians = math.radians(lat2)
    lng1_radians = math.radians(lng1)
    lng2_radians = math.radians(lng2)

    difference_in_lat = lat2_radians - lat1_radians
    difference_in_lng = lng2_radians - lng1_radians

    a = (pow(math.sin(difference_in_lat/2), 2)) + (math.cos(lat1_radians)) * (math.cos(lat2_radians)) * (pow(math.sin(difference_in_lng/2), 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = r * c
    return d



def fetch_current_round_coordinates():
    pass