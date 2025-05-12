from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()


class Item(BaseModel):
    name: str


origins = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample database as a list of dictionaries
sample_db = [
    {"name": "Elliott"},
    {"name": "Karen"}
]


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