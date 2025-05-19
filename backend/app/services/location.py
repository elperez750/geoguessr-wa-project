from geopy.geocoders import Nominatim
import random
from dotenv import load_dotenv
import requests
import os
import json
import psycopg2
import time



load_dotenv(verbose=True)


DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

print(DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT)
BATCH_SIZE = 200
buffer = []
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


