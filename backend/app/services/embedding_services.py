from app.models.text_model import get_text_model

def get_embedding(text: str):
    model = get_text_model()
    embedding = model.encode(text)
    
    # convert to list for JSON response
    return embedding.tolist()
