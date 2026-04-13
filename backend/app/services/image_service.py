from app.models.image_model import get_clip_model
from app.models.caption_model import get_caption_model
from PIL import Image
import torch

def get_image_embedding(image_path: str):
    model, preprocess, device = get_clip_model()

    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)

    with torch.no_grad():
        embedding = model.encode_image(image)

    return embedding[0].cpu().numpy().tolist()

def generate_image_caption(image_path: str):

    processor, model, device = get_caption_model()

    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt").to(device)

    with torch.no_grad():
        output = model.generate(**inputs, max_new_tokens=30,num_beams=5)

    caption = processor.decode(output[0], skip_special_tokens=True)

    return caption