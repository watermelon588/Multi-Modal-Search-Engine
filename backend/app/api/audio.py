from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.file_handler import save_audio_file
from app.services.audio_service import audio_to_text

router = APIRouter()

ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp3"]

@router.post("/search/audio")
async def search_audio(file: UploadFile = File(...)):

    # validate by file extension
    if not file.filename.endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.filename}"
        )

    # save file
    file_path = save_audio_file(file)
    file_path = file_path.replace("\\", "/")

    # Whisper step
    text = audio_to_text(file_path)

    return {
        "filename" : file.filename,
        "content_type" : file.content_type,
        "saved_path" : file_path,
        "text" : text,
        "message" : "Audio processed successfully"
    }