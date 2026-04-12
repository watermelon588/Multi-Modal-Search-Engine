import os
from dotenv import load_dotenv
from pathlib import Path

# 🔥 absolute path fix (BEST way)
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

SERPER_API_KEY = os.getenv("SERPER_API_KEY")
SERPER_BASE_URL = os.getenv("SERPER_BASE_URL")