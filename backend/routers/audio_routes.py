# audio_routes.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from models import MessageModel
from config import client, AUDIO_FILES_DIRECTORY
import time
from pathlib import Path
import shutil
from typing import Optional

router = APIRouter()



@router.post("/api/transcribe_audio")
async def transcribe_audio(lang: Optional[str] = "en", file: UploadFile = File(...)):
    print("Received file:", file.filename)

    # Save file to disk
    file_name = f"audio_{int(time.time())}.m4a"
    audio_file_path = AUDIO_FILES_DIRECTORY / file_name
    try:
        with audio_file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print("File saved successfully")
    except Exception as e:
        print(f"Error saving the file: {e}")
        return {"error": str(e)}

    # Send the file to OpenAI for transcription
    try:
        with audio_file_path.open("rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=lang
            )
        print("Transcription successful")
    except Exception as e:
        print("Error during transcription:", str(e))
        return {"error": str(e)}

    return {"text": transcript.text}

@router.post("/api/text_to_speech/")
async def text_to_speech(request: Request, message: MessageModel):
    response = client.audio.speech.create(
        model="tts-1-hd",
        voice="shimmer",
        input=message.content
    )

    file_name = f"speech_{int(time.time())}.mp3"
    speech_file_path = AUDIO_FILES_DIRECTORY / file_name
    response.stream_to_file(speech_file_path)

    audio_url = str(request.base_url) + "audio_files/" + file_name
    return JSONResponse({"audio_url": audio_url})
