import whisper

# LOAD ONCE
model = whisper.load_model("base")

def get_whisper_model():
    return model