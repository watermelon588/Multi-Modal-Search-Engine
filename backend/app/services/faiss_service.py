import faiss
import numpy as np
import os

# dimension of embedding (MiniLM = 384)
TEXT_DIM = 384
IMAGE_DIM = 512  # CLIP embedding size

# store data
stored_texts = []
# store vector embeddings in a static file 
TEXT_INDEX_PATH = "storage/text_index.index"
IMAGE_INDEX_PATH = "storage/image_index.index"
# store text
TEXT_DATA_PATH = "storage/text_data.npy"
IMAGE_DATA_PATH = "storage/image_data.npy"

# ---------------- TEXT INDEX ---------------- #

if os.path.exists(TEXT_INDEX_PATH):
    text_index = faiss.read_index(TEXT_INDEX_PATH)
    text_store = list(np.load(TEXT_DATA_PATH, allow_pickle=True))
else:
    text_index = faiss.IndexFlatL2(TEXT_DIM)
    text_store = []

def add_text_embedding(embedding, text):

    if text in text_store:
        return "duplicate"

    vector = np.array([embedding]).astype("float32")

    text_index.add(vector)
    text_store.append(text)

    faiss.write_index(text_index, TEXT_INDEX_PATH)
    np.save(TEXT_DATA_PATH, np.array(text_store, dtype=object))

    return "stored"


# ---------------- IMAGE INDEX ---------------- #

if os.path.exists(IMAGE_INDEX_PATH):
    image_index = faiss.read_index(IMAGE_INDEX_PATH)
    image_store = list(np.load(IMAGE_DATA_PATH, allow_pickle=True))
else:
    image_index = faiss.IndexFlatL2(IMAGE_DIM)
    image_store = []


def add_image_embedding(embedding, filename):

    if filename in image_store:
        return "duplicate"

    vector = np.array([embedding]).astype("float32")

    image_index.add(vector)
    image_store.append(filename)

    faiss.write_index(image_index, IMAGE_INDEX_PATH)
    np.save(IMAGE_DATA_PATH, np.array(image_store, dtype=object))

    return "stored"

# search similar to vector db
def search_index(query_embedding, k=3):
    vector = np.array([query_embedding]).astype("float32")

    distances, indices = index.search(vector, k)

    results = []
    for i in indices[0]:
        if i < len(stored_texts):
            results.append(stored_texts[i])

    return results