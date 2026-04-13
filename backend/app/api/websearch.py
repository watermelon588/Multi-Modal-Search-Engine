from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.audio_service import audio_to_text
from app.services.web_search_service import search_web
from app.services.image_service import generate_image_caption
from app.utils.file_handler import save_file

router = APIRouter(prefix="/search", tags=["Search"])

ALLOWED_AUDIO = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp3", "audio/mp4", "audio/x-m4a"]
ALLOWED_IMAGE = ["image/jpeg", "image/png"]

@router.post(
    "/unified",
    summary="Unified Search (Test Route)",
    description="Accepts text/audio/image → converts to text → fetches live results from Serper API"
)
async def unified_search(
    query: str = Form(None),
    file: UploadFile = File(None)
):

    # validation
    if not query and not file:
        raise HTTPException(status_code=400, detail="Provide either text or file")

    # Case 1: Text input
    if query:
        final_query = query.strip()

    # Case 2: Audio input
    elif file and file.content_type in ALLOWED_AUDIO:
        file_path = save_file(file)
        final_query = audio_to_text(file_path)

    # Case 3: Image input 
    elif file and file.content_type in ALLOWED_IMAGE:
        file_path = save_file(file)

        # generate caption
        caption = generate_image_caption(file_path)

        # OPTIONAL CLEANUP (important)
        final_query = caption.replace("a ", "").replace("the ", "").strip()

    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # Call Serper
    results = search_web(final_query)

    return {
        "query_used": final_query,
        "results": results
    }