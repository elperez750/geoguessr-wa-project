from django.conf.locale import el
from geopy.geocoders import Nominatim
import random
from dotenv import load_dotenv
import requests
import os
import json

#loading geolocator
geolocator = Nominatim(user_agent="geoguessr-wa-project")

load_dotenv(verbose=True)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")



def get_address_from_coordinates(lat: float, lng: float):
    print(lat, lng)
    location = geolocator.geocode(f"{lat},{lng}")
    if location:
        address = location.address
        return address
    else:
        return None


def get_valid_street_view(lat, lng):
    key = GOOGLE_API_KEY
    if not key:
        raise ValueError(f"Missing GOOGLE_API_KEY environment variable")



    url = f"https://maps.googleapis.com/maps/api/streetview/metadata?location={lat},{lng}&radius=50&key={key}"
    response = requests.get(url).json()
    if response.get("status") == "OK":
        return {
            "pano_id": response.get("pano_id"),
            "lat": response.get("location").get("lat"),
            "lng": response.get("location").get("lng"),
        }
    return None



def generate_valid_locations():
    with open("locations.geojson", "r", encoding="utf-8") as f:
        data = json.load(f)




    coords = [
        (el["geometry"]["coordinates"][1], el["geometry"]["coordinates"][0])  # (lat, lng)
        for el in data["features"]
    ]

    valid_street_views = []


    for i in range(len(coords)):
        lat = coords[i][0]
        lng = coords[i][1]

        result = get_valid_street_view(lat, lng)
        if result:
            pano_id = result["pano_id"]
            details = (lat, lng, pano_id)
            valid_street_views.append(details)


    return valid_street_views



def return_location_object(max_attempts: int = 10):
   pass
