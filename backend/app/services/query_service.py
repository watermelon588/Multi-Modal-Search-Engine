from app.models.query_model import get_query_model


# Rule based basic cleanup
def clean_text(text:str) -> str:
    text = text.lower()

    # remove filler words
    fillers = ["uh", "um", "like", "you know", "i think", "maybe", "can you"]
    for f in fillers:
        text = text.replace(f,"")

    return text.strip()

# LOAD MODEL ONCE 
tokenizer, model = get_query_model()

# Optimized query using LLM
def optimize_query(raw_text: str):

    prompt = f"""
Convert the following input into a short, clear search query.
Keep only important keywords. Remove unnecessary words.

Input: {raw_text}

Output:
"""

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = model.generate(
        **inputs,
        max_new_tokens=30,
        do_sample=False
    )

    result = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # extract only output part
    return result.split("Output:")[-1].strip()