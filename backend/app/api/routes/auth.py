"""
Authentication Routes Module

This module handles all authentication-related API endpoints for the GeoGuessr-WA application.
It provides functionality for user registration, login, and session management.

Key Features:
- User registration with validation
- Secure login with JWT token generation
- User session management via HTTP-only cookies
- Authentication verification middleware

Dependencies:
- JWT: For token generation and verification
- PBKDF2: For password hashing (via imported functions)
- PostgreSQL: Stores user account data
- HTTP Cookies: For maintaining user sessions
"""

from fastapi import APIRouter, Depends, HTTPException, Response, Request
from datetime import datetime, timedelta
from sqlalchemy.sql.functions import user

# Assuming redis_client is imported correctly from your services
from app.services import create_access_token, redis_client
from pydantic import BaseModel
from app.db import get_db
from sqlalchemy.orm import Session

from app.services.authentication import check_if_user_exists, create_user, verify_credentials, get_user_from_cookie, \
    set_cookie

router = APIRouter()


# ============================================================================
# PYDANTIC MODELS (Data Transfer Objects)
# ============================================================================

class TokenRequest(BaseModel):
    """Request model for token generation"""
    user_id: int
    username: str


class UserRegister(BaseModel):
    """Request model for user registration"""
    username: str
    password: str
    email: str


class UserLogin(BaseModel):
    """Request model for user login"""
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime


# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@router.post('/register', response_model=UserResponse, status_code=201)
async def register_user(user: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user account

    This endpoint performs the following operations:
    1. Validates that username and email are not already in use
    2. Hashes the provided password using PBKDF2
    3. Creates a new user record in the database
    4. Returns the created user information (excluding password)

    Args:
        user (UserRegister): Registration data including username, email, and password
        db (Session): Database session dependency

    Returns:
        dict: Message confirming registration and user data object

    Raises:
        HTTPException: 400 if username or email already exists
    """
    user_in_db = check_if_user_exists(db, user.username, user.email)
    if user_in_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    else:
        new_user = create_user(db, user.username, user.password, user.email)
        # Assuming create_user returns a dict that matches UserResponse
        return new_user


@router.post('/login', response_model=UserResponse, status_code=200, )
async def login_user(request: UserLogin, response: Response, db: Session = Depends(get_db)):
    """
    Authenticate a user and establish a session

    This endpoint performs the following operations:
    1. Verifies email and password combination
    2. Generates a JWT access token containing user information
    3. Sets an HTTP-only, secure cookie with the token
    4. Returns user data for frontend use

    Security features:
    - Password is verified against hashed version in database
    - Token is delivered via HTTP-only cookie for XSS protection
    - Secure flag ensures cookie is only sent over HTTPS
    - SameSite policy prevents CSRF attacks

    Args:
        request (UserLogin): Login credentials including email and password
        response (Response): FastAPI response object for cookie manipulation
        db (Session): Database session dependency

    Returns:
        dict: User information object (excludes password)

    Raises:
        HTTPException: 401 if credentials are invalid
    """
    user_data = verify_credentials(db, request.email, request.password)
    if user_data:
        access_token = create_access_token(user_data['id'], user_data['username'], user_data['email'])
        set_cookie(response, access_token)

        return user_data
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post('/logout')
def logout_user(request: Request, response: Response):
    """
    Logs out the user by deleting their authentication cookie and clearing their session.

    Args:
        request (Request): The HTTP request object.
        response (Response): The HTTP response object used to delete the cookie.

    Returns:
        dict: A message confirming the user has been logged out.
    """
    user = None
    try:
        # It's safer to get the user inside a try...except block
        user = get_user_from_cookie(request)
    except HTTPException:
        # This will catch the 401 error if the cookie is missing or invalid,
        # but we still want to proceed to delete the bad cookie.
        pass

    if user and redis_client:
        # If the user was successfully identified, clear their game session from the cache.
        game_session_key = f'user:{user["user_id"]}:game_session'
        redis_client.delete(game_session_key)

    # Always delete the cookie, even if the user wasn't found.
    # This cleans up bad/expired cookies from the browser.
    response.delete_cookie(key="access_token")

    return {"message": "You have been logged out successfully."}


@router.get('/me')
def get_user_details(request: Request):
    """
    Retrieve current authenticated user details

    Uses the access_token cookie to identify the current user.
    This endpoint allows the frontend to verify authentication status
    and access user profile data.

    Args:
        request (Request): HTTP request object containing cookies

    Returns:
        dict: User data from the JWT token payload

    Raises:
        HTTPException: 401 if no valid token is present
    """
    current_user = get_user_from_cookie(request)
    if current_user:
        return current_user
    else:
        # This will be caught by the exception handler in get_user_from_cookie
        # but it's good practice to be explicit.
        raise HTTPException(status_code=401, detail="Invalid or missing token")

