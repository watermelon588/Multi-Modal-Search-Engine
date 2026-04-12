import requests
from app.config import SERPER_API_KEY, SERPER_BASE_URL


def search_web(query: str):

    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }

    # ---------------- WEB ---------------- #
    web_res = requests.post(
        f"{SERPER_BASE_URL}/search",
        json={"q": query},
        headers=headers
    ).json()

    # ---------------- IMAGES ---------------- #
    image_res = requests.post(
        f"{SERPER_BASE_URL}/images",
        json={"q": query},
        headers=headers
    ).json()

    # ---------------- VIDEOS ---------------- #
    video_res = requests.post(
        f"{SERPER_BASE_URL}/videos",
        json={"q": query},
        headers=headers
    ).json()

    # ---------------- NEWS ---------------- #
    news_res = requests.post(
        f"{SERPER_BASE_URL}/news",
        json={"q": query},
        headers=headers
    ).json()

    # Extract clean data

    results = {
        "web": [
            {
                "title": item.get("title"),
                "link": item.get("link"),
                "snippet": item.get("snippet")
            }
            for item in web_res.get("organic", [])
        ],

        "images": [
            {
                "title": item.get("title"),
                "image_url": item.get("imageUrl"),
                "source": item.get("source")
            }
            for item in image_res.get("images", [])
        ],

        "videos": [
            {
                "title": item.get("title"),
                "link": item.get("link"),
                "thumbnail": item.get("imageUrl")
            }
            for item in video_res.get("videos", [])
        ],

        "news": [
            {
                "title": item.get("title"),
                "link": item.get("link"),
                "source": item.get("source")
            }
            for item in news_res.get("news", [])
        ]
    }

    return results