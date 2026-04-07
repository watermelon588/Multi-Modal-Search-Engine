import os
from uuid import uuid4
import hashlib

UPLOAD_DIR = "storage/uploads"

# create folder if not exists
os.makedirs(UPLOAD_DIR,exist_ok=True)

# hash file
def get_file_hash(file):
    content = file.file.read()
    file.file.seek(0)  # reset pointer

    return hashlib.md5(content).hexdigest()

def save_audio_file(file):
    # generate hash
    file_hash = get_file_hash(file)

    ext = file.filename.split(".")[-1]
    filename = f"{file_hash}.{ext}"

    file_path = os.path.join(UPLOAD_DIR, filename)

    # check if already exists
    if os.path.exists(file_path):
        return file_path  # reuse existing file

    # save file to disk
    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path