from fastapi import FastAPI
from app.api import audio

app = FastAPI()

app.include_router(audio.router)

@app.get("/")
def root():
    return {"message":"App is running perfectly"}
@app.get("/health")
def health():
    return {"status":"OK"}
