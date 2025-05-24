import time
from jose import jwt, JWTError
import os
from datetime import datetime, timedelta
from passlib.hash import pbkdf2_sha256
from app.db import get_db
from app.models import User

SECRET_KEY = str(os.getenv("SECRET_KEY"))

def create_access_token(user_id:int, username: str, expires_minutes:float=30):
    expire = datetime.now() + timedelta(minutes=expires_minutes)
    expire_timestamp = expire.timestamp()

    token = jwt.encode({'user_id': user_id, 'username': username, 'exp': expire_timestamp}, SECRET_KEY, algorithm='HS256')
    return token



def verify_token(token, value_to_retrieve=None):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except JWTError:
        raise Exception('Invalid token')

    if value_to_retrieve:
        return payload[value_to_retrieve]
    return payload


def hash_password(password):
    hashed_password = pbkdf2_sha256.hash(password)
    return hashed_password



def verify_password(plain_password, hashed_password):
    if pbkdf2_sha256.verify(plain_password, hashed_password):
        return "The password was correct"
    else:
        return "The password was incorrect"



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
    return new_user



def verify_credentials(db, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user and verify_password(password, user.password):
        return user
    return None



















