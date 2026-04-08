from fastapi import APIRouter
from app.services.embedding_services import get_embedding
from app.services.faiss_service import add_text_embedding

router = APIRouter(prefix="/search")

@router.post("/text",
            summary="Process Text Input",
            description="Generate embeddings from text input and store them in the FAISS vector database.")
async def text_embedding(query: str):

    embedding = get_embedding(query)

    # store in FAISS
    status = add_text_embedding(embedding, query)

    return {
        "text" : query,
        "status": status,
        "message": "Embedding stored successfully ",  
        "embedding" : embedding,
    }