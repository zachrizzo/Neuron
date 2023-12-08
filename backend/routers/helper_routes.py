from fastapi import APIRouter, Request
import time
from config import client, AUDIO_FILES_DIRECTORY

router = APIRouter()



@router.post("/api/delete_old_audio_files/{thread_id}")
async def delete_old_audio_files(thread_id: str):
    # Retrieve all messages in the thread
    raw_messages = client.beta.threads.messages.list(
        thread_id=thread_id
    ).data

    # Convert the messages into a serializable format
    messages = [
        {
            "id": msg.id,
            "content": msg.content[0].text.value, # Assuming the content has a text attribute
            "role": msg.role,
            "created_at": msg.created_at  # Convert datetime to string
        }
        for msg in raw_messages
    ]

    # Get the audio files that are no longer needed
    audio_files_to_delete = [
        msg["audio_url"].split("/")[-1]
        for msg in messages
        if msg["role"] == "user" and "audio_url" in msg
    ]

    # Delete the audio files
    for file_name in audio_files_to_delete:
        audio_file_path = AUDIO_FILES_DIRECTORY / file_name
        try:
            audio_file_path.unlink()
            print(f"Deleted {file_name}")
        except Exception as e:
            print(f"Error deleting {file_name}: {e}")

    return {"audio_files_deleted": audio_files_to_delete}

