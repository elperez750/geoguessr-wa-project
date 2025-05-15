from fastapi import FastAPI, Body
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
app = FastAPI()


class Item(BaseModel):
    name: str



class Anime(BaseModel):
    title: str
    episodes: int
    main_character: str


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


#Sample database of anime
anime_db: List[Anime] = [
    Anime(title="One Piece", episodes=1020, main_character="Luffy"),
    Anime(title="Black Clover", episodes=600, main_character="Asta"),
    Anime(title="Naruto", episodes=700, main_character="Naruto")
]


@app.get("/anime-titles", response_model=List[Anime])
def get_anime_titles():
    return anime_db


@app.get("/anime-titles/{anime_title}", response_model=Anime)
def get_anime_titles(anime_title: str):
    for anime in anime_db:
        if anime.title == anime_title:
            return anime
    return "Anime not found"


@app.post("/anime-titles", response_model=Anime)
def add_new_anime_title(new_anime: Anime):
    for anime in anime_db:
        if anime.title == new_anime.title:
            return {"error": "Anime already in database"}
    else:
        anime_db.append(new_anime)
        return new_anime



@app.get("/")
def root():
    return {"message": "updated message"}


@app.get("/items", response_model=List[Item])
def get_items():
    return sample_db


@app.post("/items")
def post_item(item: Item):
    # Convert the Pydantic model to a dictionary and append to the list
    sample_db.append({"name": item.name})

    # Return the newly added item
    return item


if __name__ == "__main__":
    # Fixed host IP - it should be 127.0.0.1 not 0.0.0.1
    uvicorn.run(app, host="127.0.0.1", port=8000)