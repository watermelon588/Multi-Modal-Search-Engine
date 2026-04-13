from fastapi import FastAPI
from app.api import audio
from app.api import text
from app.api import image
from app.api import websearch
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audio.router)
app.include_router(text.router)
app.include_router(image.router)
app.include_router(websearch.router)

@app.get("/")
def root():
    return {"message":"App is running perfectly"}
@app.get("/health")
def health():
    return {"status":"OK"}

