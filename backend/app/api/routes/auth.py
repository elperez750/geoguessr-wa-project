from fastapi import APIRouter, Depends, HTTPException, Response, Request
from app.services import create_access_token
from pydantic import BaseModel
from app.db import get_db
from sqlalchemy.orm import Session

from app.services.authentication import check_if_user_exists, create_user, verify_credentials, get_user_from_cookie

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



@router.post('/register')
async def register_user(user: UserRegister, db: Session = Depends(get_db)):
    user_in_db = check_if_user_exists(db, user.username, user.email)
    if user_in_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    else:
        new_user = create_user(db, user.username, user.password, user.email)
        return {'message': 'User registered', 'user': new_user}


@router.post('/login')
async def login_user(request: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = verify_credentials(db, request.email, request.password)
    print(user)
    if user:
        access_token = create_access_token(user['id'], user['username'], user['email'])
        print(access_token)
        response.set_cookie(key="access_token",
                            value=access_token,
                            httponly=True,
                            secure=False,
                            samesite='lax',
                            path="/"
                        )

        return {"user": user}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")




@router.get('/me')
def get_user_details(request: Request):
    print(request)
    current_user = get_user_from_cookie(request)
    print(current_user)
    if current_user:
        return current_user
    else:
        raise HTTPException(status_code=401, detail="Invalid token")

