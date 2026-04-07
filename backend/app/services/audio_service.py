from app.models.audio_model import get_whisper_model

def audio_to_text(file_path: str):
    model = get_whisper_model()

    result = model.transcribe(file_path)

    return result["text"]