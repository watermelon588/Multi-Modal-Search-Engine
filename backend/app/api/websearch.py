from fastapi import APIRouter, UploadFile, File, Form
from app.services.audio_service import audio_to_text
from app.services.web_search_service import search_web
from app.utils.file_handler import save_file

router = APIRouter(prefix="/search", tags=["Search"])

@router.post(
    "/unified",
    summary="Unified Search (Test Route)",
    description="Accepts text/audio/image → converts to text → fetches live results from Serper API"
)
async def unified_search(
    query: str = Form(None),
    file: UploadFile = File(None)
):

    final_query = None

    # Case 1: Text input
    if query:
        final_query = query

    # Case 2: Audio input
    elif file and file.content_type.startswith("audio"):
        file_path = save_file(file)
        final_query = audio_to_text(file_path)

    # Case 3: Image input 
    elif file and file.content_type.startswith("image"):
        # later: image → caption
        final_query = "image description"

    else:
        return {"error": "Provide either text or file"}

    # Call Serper
    results = search_web(final_query)

    return {
        "query_used": final_query,
        "results": results
    }