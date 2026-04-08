import torch
import clip
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"

model, preprocess = clip.load("ViT-B/32", device=device)

def get_clip_model():
    return model, preprocess, device