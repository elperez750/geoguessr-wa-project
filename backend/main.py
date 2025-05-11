from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Elliots first fast api project"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
