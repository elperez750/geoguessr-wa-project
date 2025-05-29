import math
from datetime import datetime
from app.db import get_db
from app.models import Game, Round, UserRound
from sqlalchemy.orm import Session
from fastapi import Depends

from app.models.game_models import UserRound


def create_new_game(user_id: int, db : Session = Depends(get_db)):
    new_game = Game(
        user_id = user_id,
        started_at = datetime.now()

    )

    db.add(new_game)
    db.commit()
    db.refresh(new_game)

    return new_game




def create_round(game_id: int, round_number: int, location: str, db: Session = Depends(get_db)):
    new_round = Round(
        game_id = game_id,
        round_number = round_number,
        location_string = location
    )


    db.add(new_round)
    db.commit()
    db.refresh(new_round)
    return new_round


def create_user_round(round_id: int, user_id: int, db: Session = Depends(get_db)):
    new_user_round = UserRound(
        round_id = round_id,
        user_id = user_id,
    )

    db.add(new_user_round)
    db.commit()
    db.refresh(new_user_round)
    return new_user_round