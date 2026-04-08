from app.models.image_model import get_clip_model
from PIL import Image
import torch

def get_image_embedding(image_path: str):
    model, preprocess, device = get_clip_model()

    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

    with torch.no_grad():
        embedding = model.encode_image(image)

    return embedding[0].cpu().numpy().tolist()