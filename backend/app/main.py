from fastapi import FastAPI
from app.api import audio
from app.api import text
from app.api import image

app = FastAPI()

app.include_router(audio.router)
app.include_router(text.router)
app.include_router(image.router)

@app.get("/")
def root():
    return {"message":"App is running perfectly"}
@app.get("/health")
def health():
    return {"status":"OK"}

