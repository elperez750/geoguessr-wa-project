from fastapi import APIRouter, Query, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from app.services import get_address_from_coordinates, get_random_pano_id, haversine_formula, create_new_game, redis_client,create_round, create_user_round, get_coords_from_pano_id
from app.models import Location
from app.db import get_db
from app.services.authentication import get_user_from_cookie
from sqlalchemy.orm import Session
import random
from datetime import datetime

router = APIRouter()

class GameCreate(BaseModel):
    started_at: str


class GameResponse(BaseModel):
    id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    total_score: Optional[float] = None
    total_distance: Optional[float] = None
    locations: Optional[List] = None


class RoundCreate(BaseModel):
    round_number: int
    game_id: int
    area_name: str
    location_id: int


class UserRoundCreate(BaseModel):
    round_id: int
    user_id: int



    # id = Column(Integer, primary_key=True)
    # round_id = Column(Integer, ForeignKey('rounds.id'))
    # user_id = Column(Integer, ForeignKey('users.id'))
    # guess_lat = Column(Float)
    # guess_lng = Column(Float)
    # distance_off = Column(Float)
    # round_score = Column(Float)
    # submitted_at = Column(DateTime, default=datetime.now)
    # user = relationship('User', back_populates='user_rounds')
    # round = relationship('Round', back_populates='user_rounds')
    #


    # id = Column(Integer, primary_key=True)
    # round_number = Column(Integer)
    # game_id = Column(Integer, ForeignKey('games.id'))
    # area_name = Column(Text)
    # location_id = Column(Integer, ForeignKey('locations.id'))
    # location = relationship('Location', back_populates='round')
    # user_rounds = relationship('UserRound', back_populates='round')
    #


# Getting results after the round is over
@router.get('/get-round-results')
def get_results():
    pass


#getting location
@router.get('/get-location')
def get_location(lat:float = Query(...), lng: float = Query(...)):
   location = get_address_from_coordinates(lat, lng)
   if location:
        return location
   else:
       return "Nothing was found for the following"



# Route when the game starts
@router.get('/start-game')
def start_game(request: Request, db: Session = Depends(get_db)):
    user = get_user_from_cookie(request)

    if not user:
        raise HTTPException(status_code=401, detail="User is not logged in")

    number_of_locations = redis_client.get('number_of_locations')
    if not number_of_locations:
        number_of_locations = db.query(Location).count()
        redis_client.set('number_of_locations', number_of_locations)


    random_id = random.randint(1, int(number_of_locations))

    pano_id = redis_client.get('pano_id')
    if not pano_id:
        print("Getting new pano_id from database")
        pano_id = get_random_pano_id(random_id, db)
        redis_client.set('pano_id', pano_id)
    else:
        pano_id = pano_id.decode('utf-8')  # Decode bytes to string
        print("Using cached pano_id from Redis")

    print("pano id", pano_id)

    coords = get_coords_from_pano_id(pano_id, db)
    string_location = get_address_from_coordinates(coords['lat'], coords['lng'])

    new_game = create_new_game(user['user_id'], db)
    new_round = create_round(new_game.id, 1, string_location,  db)

    user_round = create_user_round(new_round.id, user['user_id'], db)


    round_number = redis_client.set("round_number", new_round.round_number)



    return {"pano_id": pano_id,
            "game_id": new_game.id,
            "current_round": round_number,
            "user_id": user["user_id"],
            "round_id": new_round.id,
            }


@router.get('/next-round')
def get_location_from_db(request: Request, db: Session = Depends(get_db)):
    pass


@router.get('/get-distance-from-guess')
def get_distance_from_guess(lat: float = Query(...), lng: float = Query(...)):
    result = haversine_formula(lat, lng, )








