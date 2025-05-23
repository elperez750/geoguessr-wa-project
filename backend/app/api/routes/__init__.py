from fastapi import APIRouter
from app.api.routes import game, user


api_router = APIRouter()

api_router.include_router(game.router, prefix="/game", tags=["game"])

api_router.include_router(user.router, prefix="/user", tags=["user"])


