from fastapi import APIRouter, Request
import time
from config import client, AUDIO_FILES_DIRECTORY
from models import MessageModel, Message


router = APIRouter()


@router.post("/api/add_message_with_voice_reply_no_assistant")
async def add_message_with_voice_reply_no_assistant(request: Request, message_model: MessageModel):
    print('no assistant')

    model_dict = {
        'general_lang_chat': "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
        'fr_Lesson1_alphabet_pronunciation': 'ft:gpt-3.5-turbo-1106:personal::8RLCgNEw',
        }

    # Use the provided conversation history directly
    messages_list = message_model.conversation

    # Get the assistant's response
    response =  client.chat.completions.create(
        model=model_dict.get(message_model.model_type, "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI"),
        # model="gpt-3.5-turbo-1106",
        messages=[message.dict() for message in messages_list],
    )

    choice = response.choices[0]
    assistant_message = choice.message.content

    print(assistant_message)

    # Append the assistant's response to the messages list
    messages_list.append(Message(role="assistant", content=assistant_message))

    # Convert the messages into a serializable format
    serializable_messages = [
        {
            "id": msg.role + str(idx),
            "content": msg.content,
            "role": msg.role
        }
        for idx, msg in enumerate(messages_list)
    ]
    # Convert the assistant's reply to speech
    response = client.audio.speech.create(
        model="tts-1-hd",
        voice="shimmer",
        input=assistant_message
    )

    file_name = f"speech_{int(time.time())}.mp3"
    speech_file_path = AUDIO_FILES_DIRECTORY / file_name
    response.stream_to_file(speech_file_path)

    audio_url = str(request.base_url) + "audio_files/" + file_name

    # Return the messages and audio URL
    return {
        "messages": serializable_messages,
        "audio_url": audio_url
    }



