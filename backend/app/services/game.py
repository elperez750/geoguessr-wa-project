import math
from datetime import datetime

from geopy.geocoders import Nominatim
from dotenv import load_dotenv
import os
from app.db import get_db
from app.models import Game
from sqlalchemy.orm import Session
from fastapi import Depends



def create_new_game(db : Session = Depends(get_db)):
    new_game = Game(
        started_at = datetime.now()

    )

    db.add(new_game)
    db.commit()
    return new_game