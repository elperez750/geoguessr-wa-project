from fastapi import APIRouter
from app.api.routes import game, auth


api_router = APIRouter()

api_router.include_router(game.router, prefix="/game", tags=["game"])

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])


