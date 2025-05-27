import time
from jose import jwt, JWTError
import os
from datetime import datetime, timedelta
from passlib.hash import pbkdf2_sha256
from app.db import get_db
from app.models import User

from fastapi import HTTPException, Depends, Request
SECRET_KEY = str(os.getenv("SECRET_KEY"))

def create_access_token(user_id:int, username: str, email: str):

    token = jwt.encode({'user_id': user_id, 'username': username, 'email': email}, SECRET_KEY, algorithm='HS256')
    return token


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        print("payload", payload)
        return payload

    except JWTError:
        raise Exception('Invalid token')


def get_user_from_cookie(request):
    print("All cookies received:", dict(request.cookies))
    print("Cookie keys:", list(request.cookies.keys()))
    token = request.cookies.get("access_token")
    print("Access token cookie:", token)

    if not token:
        print("No access_token cookie found!")
        raise HTTPException(status_code=401, detail="No access token cookie")

    try:
        payload = verify_token(token)
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))



def hash_password(password):
    hashed_password = pbkdf2_sha256.hash(password)
    return hashed_password



def verify_password(plain_password, hashed_password):
    if pbkdf2_sha256.verify(plain_password, hashed_password):
        return True
    return False



def check_if_user_exists(db, username:str, email:str):

    return db.query(User).filter((username==User.username) | (email == User.email)).first()



def create_user(db, username:str, password:str, email:str):
    hashed_password = hash_password(password)

    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        created_at=datetime.now(),
    )
    db.add(new_user)
    db.commit()
    return {"id": new_user.id, "username": new_user.username, "email": new_user.email, "created_at": new_user.created_at}



def verify_credentials(db, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    print(user.email)
    print(verify_password(password, user.password))
    if user and verify_password(password, user.password):
        user_info_to_return = {
            'id': user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at,
        }



        return user_info_to_return
    return None



















