# 🎧 Multimodal Semantic Search System (Audio Pipeline - Phase 1)

A backend system that processes **audio input → converts to text using Whisper → feeds into a search pipeline**.

This is part of a larger **multimodal semantic retrieval system** supporting text, image, audio, video, and links.

---

## 🚀 Features (Current)

* ✅ Audio file upload API
* ✅ File validation (type + extension)
* ✅ Deduplicated storage (hash-based)
* ✅ Whisper integration (Audio → Text)
* ✅ Modular backend structure (scalable)
* ✅ Ready for integration with search pipeline

---

## 🧠 Architecture (Current Flow)

```
User Upload Audio
        ↓
FastAPI Endpoint (/search/audio)
        ↓
Validation (type + extension)
        ↓
File Storage (hash-based, no duplicates)
        ↓
Whisper Model
        ↓
Text Output
        ↓
(Search Pipeline - placeholder)
```

---

## 📁 Folder Structure

```
backend/
│
├── app/
│   ├── main.py                  # FastAPI entry point
│
│   ├── api/
│   │   ├── __init__.py
│   │   └── audio.py             # Audio route (/search/audio)
│
│   ├── models/
│   │   └── audio_model.py       # Whisper model loader
│
│   ├── services/
│   │   ├── audio_service.py     # Audio → text logic
│   │   └── search_service.py    # (placeholder search pipeline)
│
│   ├── utils/
│   │   └── file_handler.py      # File saving + hashing
│
├── storage/
│   └── uploads/                 # Uploaded audio files (ignored in git)
│
├── myenv/                       # Virtual environment (ignored)
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone <your-repo-url>
cd backend
```

---

### 🔹 2. Create Virtual Environment (Recommended)

```bash
python -m venv myenv
myenv\Scripts\activate   # Windows
```

---

### 🔹 3. Install Dependencies

```bash
pip install fastapi uvicorn openai-whisper ffmpeg-python
```

---

### 🔹 4. Install FFmpeg (Required)

Whisper depends on FFmpeg.

#### Windows:

1. Download from: https://www.gyan.dev/ffmpeg/builds/
2. Extract
3. Add to PATH:

```
C:\ffmpeg-xxxx\bin
```

---

### 🔹 5. Verify FFmpeg

```bash
ffmpeg -version
```

---

### 🔹 6. Run the Server

```bash
python -m uvicorn app.main:app --reload
```

---

### 🔹 7. Open API Docs

```
http://127.0.0.1:8000/docs
```

---

## 🔌 API Routes

---

### 🟢 Health Check

```
GET /health
```

**Response:**

```json
{
  "status": "OK"
}
```

---

### 🎧 Audio Search

```
POST /search/audio
```

**Request:**

* Form-data
* Key: `file`
* Value: audio file (.mp3, .wav, .m4a)

---

**Response:**

```json
{
  "filename": "Recording (5).m4a",
  "content_type": "audio/x-m4a",
  "saved_path": "storage/uploads/d587f135a236f736af84726ed9da3fa1.m4a",
  "text": " Yo, hello, can you just transcribe this voice into text and also I am retarded as fuck.",
  "message": "Audio processed successfully"
}
```

---

## 🧠 Key Components

---

### 🔹 Whisper Model

* Converts audio → text
* Loaded once globally for performance

---

### 🔹 File Handling

* Uses **MD5 hashing**
* Prevents duplicate storage

---

### 🔹 Validation

* MIME type check
* File extension check

---

## ⚠️ Notes

* Uploaded files are stored in:

  ```
  storage/uploads/
  ```
* This directory is ignored in `.gitignore`
* Whisper model is cached locally after first download

---

## 🚀 Upcoming Features

* 🔜 Text embeddings (Sentence Transformers)
* 🔜 FAISS vector search
* 🔜 Web search integration (Serper API)
* 🔜 Image + Video support
* 🔜 RAG-based AI summaries
* 🔜 Explainable ranking

---

## 💡 Developer Notes

* Use:

  ```bash
  python -m uvicorn app.main:app --reload
  ```

  (Avoid direct `uvicorn` if PATH issues)

* First Whisper run may take time (model download)

---

## 🏁 Current Status

```
Audio → Text ✅
Text → Search (basic) ✅
Multimodal Search 🚧 (in progress)
```

---

