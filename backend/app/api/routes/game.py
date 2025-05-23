from fastapi import APIRouter, Query, Depends
from app.services import get_address_from_coordinates, get_random_pano_id, haversine_formula
from app.models import Location
from app.db import get_db
from sqlalchemy.orm import Session
import random

router = APIRouter()


@router.get('/get-location')
def get_location(lat:float = Query(...), lng: float = Query(...), guess_number: int = Query(...)):
   location = get_address_from_coordinates(lat, lng)
   if location:
        return location
   else:
       return "Nothing was found for the following"



@router.get('/get-location-from-db')
def get_location_from_db(db: Session = Depends(get_db)):
    number_of_locations = db.query(Location).count()
    print(number_of_locations)
    random_id = random.randint(1, number_of_locations)
    location = get_random_pano_id(random_id, db)
    return location


@router.get('/get-distance-from-guess')
def get_distance_from_guess(lat: float = Query(...), lng: float = Query(...)):
    result = haversine_formula(lat, lng, )








