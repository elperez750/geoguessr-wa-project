"""
Authentication Service Module

This module provides authentication-related services for the GeoGuessr-WA application.
It handles token generation, password hashing, and user management functions.

Features:
- JWT token creation and verification
- Secure password hashing with PBKDF2
- User authentication via cookies
- User registration and credential verification

Dependencies:
- jose: For JWT operations
- passlib: For password hashing
- SQLAlchemy: For database operations
- FastAPI: For HTTP handling and exceptions
"""

import time
from jose import jwt, JWTError
import os
from datetime import datetime, timedelta
from passlib.hash import pbkdf2_sha256
from app.db import get_db
from app.models import User
from fastapi import HTTPException, Depends, Request

# Load secret key from environment variables
SECRET_KEY = str(os.getenv("SECRET_KEY"))

def create_access_token(user_id: int, username: str, email: str):
    """
    Generate a JWT access token for user authentication

    Creates a JSON Web Token containing user identification data,
    signed with the application's secret key.

    Args:
        user_id (int): User's database identifier
        username (str): User's username
        email (str): User's email address

    Returns:
        str: Encoded JWT token string
    """
    token = jwt.encode({'user_id': user_id, 'username': username, 'email': email},
                      SECRET_KEY, algorithm='HS256')
    return token


def verify_token(token):
    """
    Verify and decode a JWT token

    Validates the signature of a JWT token and extracts the payload data.

    Args:
        token (str): JWT token string to verify

    Returns:
        dict: Decoded payload data from the token

    Raises:
        Exception: If token is invalid or tampered with
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        print("payload", payload)
        return payload

    except JWTError:
        raise Exception('Invalid token')


def get_user_from_cookie(request):
    """
    Extract and verify user information from request cookies

    Retrieves the access_token cookie from the request, verifies it,
    and returns the user data contained in the token.

    Args:
        request (Request): FastAPI request object with cookies

    Returns:
        dict: User data from token payload

    Raises:
        HTTPException: 401 if token is missing or invalid
    """
    print("All cookies received:", dict(request.cookies))
    print("Cookie keys:", list(request.cookies.keys()))
    token = request.cookies.get("access_token")
    print("Access token cookie:", token)

    if not token:
        print("No access_token cookie found!")
        raise HTTPException(status_code=401, detail="No access token cookie")

    try:
        payload = verify_token(token)
        print("Payload:", payload)
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


def hash_password(password):
    """
    Hash a password using PBKDF2 with SHA-256

    Creates a secure hash of the password with salt for storage.
    PBKDF2 is designed to be computationally intensive to resist
    brute-force attacks.

    Args:
        password (str): Plain-text password to hash

    Returns:
        str: Hashed password string with embedded salt
    """
    hashed_password = pbkdf2_sha256.hash(password)
    return hashed_password


def verify_password(plain_password, hashed_password):
    """
    Verify a password against its hashed version

    Checks if the provided plain-text password matches the stored hash.
    Uses the same PBKDF2 algorithm as the hash_password function.

    Args:
        plain_password (str): Plain-text password to verify
        hashed_password (str): Previously hashed password to check against

    Returns:
        bool: True if password matches, False otherwise
    """
    if pbkdf2_sha256.verify(plain_password, hashed_password):
        return True
    return False


def check_if_user_exists(db, username: str, email: str):
    """
    Check if a user with given username or email already exists

    Used during registration to prevent duplicate accounts.

    Args:
        db (Session): Database session
        username (str): Username to check
        email (str): Email to check

    Returns:
        User: User object if found, None otherwise
    """
    return db.query(User).filter((username==User.username) | (email == User.email)).first()


def create_user(db, username: str, password: str, email: str):
    """
    Create a new user account

    Registers a new user in the database with hashed password.

    Args:
        db (Session): Database session
        username (str): Username for the new account
        password (str): Password for the new account (will be hashed)
        email (str): Email for the new account

    Returns:
        dict: Created user information (excluding password)
    """
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
    """
    Verify user login credentials

    Checks if the provided email and password match a user record.
    Used during the login process.

    Args:
        db (Session): Database session
        email (str): Email address to verify
        password (str): Password to verify

    Returns:
        dict: User information if credentials are valid, None otherwise
    """
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




