from fastapi import APIRouter
from app.services.embedding_services import get_embedding
from app.services.faiss_service import add_text_embedding
from app.services.query_service import clean_text, optimize_query

router = APIRouter(prefix="/search")

@router.post("/text",
            summary="Process Text Input",
            description="Generate embeddings from text input and store them in the FAISS vector database.")
async def text_embedding(query: str):

    # raw text → optimized query
    cleaned = clean_text(query)
    final_query = optimize_query(cleaned)

    embedding = get_embedding(final_query)

    # store in FAISS
    status = add_text_embedding(embedding, final_query)

    return {
        "text" : query,
        "Optimized_query" : final_query,
        "status": status,
        "message": "Embedding stored successfully ",  
        "embedding" : embedding,
    }