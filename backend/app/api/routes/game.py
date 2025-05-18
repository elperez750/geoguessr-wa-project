from fastapi import APIRouter, Query
from app.services import get_address_from_coordinates, return_location_object

router = APIRouter()


@router.get('/get-location')
def get_location(lat:float = Query(...), lng: float = Query(...), guess_number: int = Query(...)):
   location = get_address_from_coordinates(lat, lng)
   if location:
        return location
   else:
       return "Nothing was found for the following"




@router.get('/get-map')
def get_map():
    current_map = return_location_object()
    print(current_map["lat"], current_map["lng"], current_map["pano-id"])
    return current_map["pano-id"]



