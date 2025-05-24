from fastapi import APIRouter, Depends, HTTPException
from app.services import create_access_token
from pydantic import BaseModel
from app.db import get_db
from sqlalchemy.orm import Session

from app.services.authentication import check_if_user_exists, create_user, verify_credentials

router = APIRouter()


class TokenRequest(BaseModel):
    user_id: int
    username: str


class UserRegister(BaseModel):
    username: str
    password: str
    email: str


class UserLogin(BaseModel):
    email: str
    password: str


@router.post('/create-token')
def make_token(request: TokenRequest):
    user_id = request.user_id
    username = request.username
    access_token = create_access_token(user_id, username)
    return {'access_token': access_token}


@router.post('/register')
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    user_in_db = check_if_user_exists(db, user.username, user.email)
    if user_in_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    else:
        new_user = create_user(db, user.username, user.password, user.email)
        access_token = create_access_token(new_user.id, user.username)
        return {'message': 'User registered', 'access_token': access_token}


@router.post('/login')
def login_user(request: UserLogin, db: Session = Depends(get_db)):
    user = verify_credentials(db, request.email, request.password)

    if user:
        access_token = create_access_token(user.id, user.username)
        return {"access_token": access_token}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")



