from fastapi import FastAPI, Body, Query
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from geopy.geocoders import Nominatim
import random

import requests
from app.api import api_router
app = FastAPI()

geolocator = Nominatim(user_agent="geoguessr-wa-project")


class Guess(BaseModel):
    lat: float
    lng: float
    guess_number: int





origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://geoguessr-wa-project.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)



@app.get("/")
def root():
    return {"message": "updated message"}


