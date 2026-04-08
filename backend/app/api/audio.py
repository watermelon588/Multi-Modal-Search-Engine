from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.file_handler import save_file
from app.services.audio_service import audio_to_text
from app.services.embedding_services import get_embedding
from app.services.faiss_service import add_text_embedding

router = APIRouter(prefix="/search")

ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp3"]

@router.post("/audio",
            summary="Process Audio Input",
            description="Upload an audio file, convert it to text using Whisper, generate embeddings, and store in FAISS.")
async def search_audio(file: UploadFile = File(...)):

    # validate by file extension
    if not file.filename.endswith((".mp3", ".wav", ".m4a")):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.filename}"
        )

    # save file
    file_path = save_file(file)
    file_path = file_path.replace("\\", "/")

    # audio → text
    text = audio_to_text(file_path)

    # text → vector embedding
    embedding = get_embedding(text)

    # store in FAISS
    status = add_text_embedding(embedding, text)

    return {
        "filename" : file.filename,
        "content_type" : file.content_type,
        "saved_path" : file_path,
        "text" : text,
        "status": status,
        "message" : "Audio processed & embedding stored successfully",
        "embedding" : embedding,
    }