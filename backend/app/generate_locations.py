import json
import time
import requests
import os
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError

from db import get_db
from models import Location  # your SQLAlchemy model

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEOJSON_PATH = "geoguessr-wa-locations.geojson"
SLEEP_SECONDS = 0.2


def get_pano_id(lat, lng):
    url = f"https://maps.googleapis.com/maps/api/streetview/metadata?location={lat},{lng}&radius=50&key={GOOGLE_API_KEY}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data.get("status") == "OK":
            return {
                "lat": data["location"]["lat"],
                "lng": data["location"]["lng"],
                "pano_id": data["pano_id"]
            }
    except Exception as e:
        print(f"⚠️ Error for ({lat}, {lng}): {e}")
    return None


def extract_coords_from_geojson(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    return [
        {"lat": feature["geometry"]["coordinates"][1],
         "lng": feature["geometry"]["coordinates"][0]}
        for feature in data["features"]
    ]


def insert_location(db, lat, lng, pano_id):
    location = Location(latitude=lat, longitude=lng, pano_id=pano_id)
    db.add(location)
    try:
        db.commit()
        print(f"✅ Inserted pano_id {pano_id} at ({lat}, {lng})")
    except IntegrityError:
        db.rollback()
        print(f"⚠️ Duplicate pano_id {pano_id}, skipped")


def run():
    coords = extract_coords_from_geojson(GEOJSON_PATH)

    # ✅ Extract the session from the generator
    db_gen = get_db()
    db = next(db_gen)

    for coord in coords:
        result = get_pano_id(coord["lat"], coord["lng"])
        if result:
            insert_location(db, result["lat"], result["lng"], result["pano_id"])
        else:
            print(f"❌ No pano for ({coord['lat']}, {coord['lng']})")
        time.sleep(SLEEP_SECONDS)

    # ✅ Close the session generator
    try:
        db_gen.close()
    except Exception:
        pass

    print("✅ Done.")


if __name__ == "__main__":
    run()
