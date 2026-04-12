# 🎧 Multimodal Semantic Search System

A backend system that processes **text, audio, and image inputs**, converts them into **vector embeddings**, and stores them in a **FAISS-based vector database** for future semantic search.

---

## 🚀 Features

* ✅ Text → Embedding (Sentence Transformers)
* ✅ Audio → Text (Whisper) → Embedding
* ✅ Image → Embedding (CLIP)
* ✅ Persistent FAISS storage (separate indexes)
* ✅ Duplicate prevention
* ✅ Clean modular architecture
* ✅ API-first design (FastAPI)

---

## 🧠 Architecture

```text
Input (Text / Audio / Image)
        ↓
Preprocessing Layer
   - Audio → Whisper → Text
   - Image → CLIP
        ↓
Embedding Layer (shared services)
        ↓
Vector Storage (FAISS)
   - text_index.index
   - image_index.index
        ↓
(Similarity Search - upcoming)
```

---

## 📁 Folder Structure

```text
backend/
│
├── app/
│   ├── main.py
│
│   ├── api/
│   │   ├── audio.py
│   │   ├── search_text.py
│   │   └── search_image.py
│
│   ├── models/
│   │   ├── audio_model.py
│   │   ├── text_model.py
│   │   └── image_model.py
│
│   ├── services/
│   │   ├── audio_service.py
│   │   ├── embedding_service.py
│   │   ├── image_embedding_service.py
│   │   └── faiss_service.py
│
│   └── utils/
│       └── file_handler.py
│
├── storage/
│   ├── text_index.index
│   ├── text_data.npy
│   ├── image_index.index
│   ├── image_data.npy
│   └── uploads/
│
├── myenv/
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repo-url>
cd backend
```

---

### 2. Create Virtual Environment

```bash
python -m venv myenv
myenv\Scripts\activate
```

---

### 3. Install Dependencies

```bash
pip install fastapi uvicorn
pip install openai-whisper ffmpeg-python
pip install sentence-transformers faiss-cpu
pip install torch torchvision pillow
pip install git+https://github.com/openai/CLIP.git
pip install requests python-dotenv
```

---

### 4. Install FFmpeg (Required)

Download from:
https://www.gyan.dev/ffmpeg/builds/

Add to PATH:

```text
C:\ffmpeg-xxxx\bin
```

Verify:

```bash
ffmpeg -version
```

---

### 5. Run Server

```bash
python -m uvicorn app.main:app --reload
```

---

### 6. Open API Docs

```text
http://127.0.0.1:8000/docs
```

---

## 🔌 API Endpoints

---

### 🔹 Text Processing

```text
POST /search/text
```

**Description:**
Generate embeddings from text and store in FAISS.

---

### 🔹 Audio Processing

```text
POST /search/audio
```

**Flow:**

```text
Audio → Whisper → Text → Embedding → FAISS
```

---

### 🔹 Image Processing

```text
POST /search/image
```

**Flow:**

```text
Image → CLIP → Embedding → FAISS
```

---
###  New Service Added

```text
app/services/web_search_service.py
```
Handles:

Serper API calls
Multi-type data fetching:
Web results
Images
Videos
News

## 📦 Storage System

FAISS indexes are stored locally:

```text
storage/
   text_index.index
   text_data.npy

   image_index.index
   image_data.npy
```

---
## ⚠️ Environment Note (Important)

If you encounter issues like:

```text
Module not found (fastapi / whisper / faiss)
```

It usually means dependencies are installed in different environments.

### ✅ Solution

You can either:

**Option 1 (Recommended)**

```bash
myenv\Scripts\activate
pip install -r requirements.txt
```

**Option 2 (Quick Fix)**

If conflicts persist, avoid virtual environment temporarily and run using:

```bash
python -m uvicorn app.main:app --reload
```

👉 Ensure all packages are installed using:

```bash
python -m pip install <package-name>
```

---

## 🔌 API Endpoints (with Responses)

---

### 🔹 1. Text Processing

```text
POST /search/text
```

**Description:**
Generate embedding from text and store in FAISS.

**Request:**

```json
{
  "query": "modern ui design"
}
```

**Response:**

```json
{
  "text": "modern ui design",
  "status": "stored",
  "message": "Text processed & stored successfully ✅"
}
```

---

### 🔹 2. Audio Processing

```text
POST /search/audio
```

**Description:**
Upload audio → convert to text → generate embedding → store in FAISS.

**Request:**

* Form-data → `file` (mp3 / wav / m4a)

---

**Response:**

```json
{
  "filename": "voice.mp3",
  "content_type": "audio/mpeg",
  "saved_path": "storage/uploads/abc123_voice.mp3",
  "text": "modern ui dashboard design",
  "message": "Audio processed & embedding stored successfully ✅"
}
```

---

### 🔹 3. Image Processing

```text
POST /search/image
```

**Description:**
Upload image → generate embedding using CLIP → store in FAISS.

**Request:**

* Form-data → `file` (jpg / png)

---

**Response:**

```json
{
  "filename": "design.png",
  "status": "stored",
  "message": "Image processed & stored successfully ✅"
}
```

---
### 🔹 4. Unified Search (Live Web Data)
```text
POST /search/unified
```
** Description**

A unified testing endpoint that accepts text / audio / image input, converts everything into a text query, and fetches live results from Serper API.

🔁 Flow
Input (text/audio/image)
        ↓
Convert → TEXT
        ↓
Serper API (Live Web Data)
        ↓
Return structured results

 **Request**
Option 1: Text Input
Form-data:
query = "coffee"
Option 2: Audio Input
Form-data:
file = voice.mp3
Option 3: Image Input (temporary placeholder)
Form-data:
file = image.png
 **Response**
```json
{
  "query_used": "coffee",
  "results": {
    "web": [
      {
        "title": "Coffee - Wikipedia",
        "link": "https://en.wikipedia.org/wiki/Coffee",
        "snippet": "Coffee is a brewed drink..."
      }
    ],
    "images": [
      {
        "title": "Coffee Cup",
        "image_url": "...",
        "source": "Unsplash"
      }
    ],
    "videos": [
      {
        "title": "How to Make Coffee",
        "link": "...",
        "thumbnail": "..."
      }
    ],
    "news": [
      {
        "title": "Coffee Prices Rising",
        "link": "...",
        "source": "BBC"
      }
    ]
  }
}
```
 Create .env File

📁 Location: backend/.env

```bash
SERPER_API_KEY=your_serper_api_key_here
SERPER_BASE_URL=https://google.serper.dev
```

## 📌 Duplicate Handling

If same input is sent multiple times:

```json
{
  "status": "duplicate"
}
```

👉 System avoids storing duplicate embeddings.

---


## ⚠️ Notes

* FAISS indexes are persistent across restarts
* Duplicate inputs are ignored
* Uploaded files are stored in `storage/uploads/`
* This directory is excluded via `.gitignore`

---

## 🚀 Upcoming Features

* 🔜 Similarity search (FAISS retrieval)
* 🔜 Hybrid search (FAISS + Web APIs)
* 🔜 Ranking system
* 🔜 RAG-based AI summaries
* 🔜 Multimodal cross-search (text ↔ image)

---

## 🧠 Tech Stack

* FastAPI
* Whisper
* Sentence Transformers
* FAISS
* CLIP
* NumPy

---

## 🏁 Status

```text
Text → Embedding → Stored ✅
Audio → Text → Embedding → Stored ✅
Image → Embedding → Stored ✅
Search & Retrieval 🚧 (next phase)
```

---
