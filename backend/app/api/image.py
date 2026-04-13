from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.file_handler import save_file  # reuse logic
from app.services.image_service import get_image_embedding
from app.services.image_service import generate_image_caption
from app.services.faiss_service import add_image_embedding

router = APIRouter(prefix="/search")

ALLOWED_TYPES = ["image/jpeg", "image/png"]

@router.post("/image",
            summary="Process Image Input",
            description="Upload an image, generate embeddings using CLIP, and store them for future retrieval.")
async def image_embedding(file: UploadFile = File(...)):

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid image type")

    file_path = save_file(file)  # reuse same function

    embedding = get_image_embedding(file_path)

    # store in FAISS
    status = add_image_embedding(embedding, file.filename)

    # image caption generate
    image_query = generate_image_caption(file_path)

    return {
        "filename": file.filename,
        "content_type" : file.content_type,
        "status": status,
        "caption": image_query,
        "message": "Image processed & stored successfully",
        "embedding": embedding,
    }