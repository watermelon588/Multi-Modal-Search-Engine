from transformers import AutoModelForCausalLM , AutoTokenizer
import torch

MODEL_NAME = "Qwen/Qwen2.5-1.5B-Instruct"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype = torch.float32,
    device_map = "auto"
)

def get_query_model():
    return tokenizer, model