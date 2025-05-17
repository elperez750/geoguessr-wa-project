from fastapi import FastAPI, Body, Query
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from geopy.geocoders import Nominatim
import random
from dotenv import load_dotenv
import os
import requests
app = FastAPI()

geolocator = Nominatim(user_agent="geoguessr-wa-project")
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"GOOGLE_API_KEY: {GOOGLE_API_KEY}")

class Guess(BaseModel):
    lat: float
    lng: float
    guess_number: int






origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://geoguessr-wa-project.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# def get_valid_street_view(lat, lng):
#     key = GOOGLE_API_KEY
#     url = f"https://maps.googleapis.com/maps/api/streetview/metadata?location={lat},{lng}&radius=50&key={key}"
#     response = requests.get(url).json()
#     if response.get("status") == "OK":
#         return {
#             "pano_id": response.get("pano_id"),
#             "lat": response.get("geometry").get("location").get("lat"),
#             "lng": response.get("geometry").get("location").get("lng"),
#         }
#     return None
#
#
#
# while True:
#     lat = random.uniform(45.5, 49.0)
#     lng = random.uniform(-124.8, -116.9)
#
#     result = get_valid_street_view(lat, lng)
#     if result:
#         break


# print(result.get("pano_id"))

@app.get("/get-location")
def get_location(lat:float = Query(...), lng: float = Query(...), guess_number: int = Query(...)):
    print(lat, lng, guess_number)
    location = geolocator.geocode(f"{lat},{lng}")
    if location:
        address = location.address
        return address
    else:
        return f"Location information not found for coordinates: {lat}, {lng}"





@app.get("/")
def root():
    return {"message": "updated message"}


