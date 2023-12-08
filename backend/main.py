from typing import Optional, Union
from fastapi import FastAPI, Body, HTTPException, Request,UploadFile, File,Query
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import time
from fastapi.responses import JSONResponse,StreamingResponse
from pathlib import Path  # Add this import
import shutil
import os
from typing import List
import asyncio
import aiofiles

from config import  AUDIO_FILES_DIRECTORY

from routers.assistant_routes import router as assistant_router
from routers.audio_routes import router as audio_router
from routers.helper_routes import router as helper_router
from routers.fine_tune_gpt_assistant_routes import router as fine_tune_gpt_assistant_route

app = FastAPI()
# Add a middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins #change later
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)



# Static files route for audio files
app.mount("/audio_files", StaticFiles(directory=str(AUDIO_FILES_DIRECTORY)), name="audio_files")



@app.get("/")
def read_root():
    return {"Hello": "I am a lang learning app"}

app.include_router(assistant_router)
app.include_router(audio_router)
app.include_router(helper_router)
app.include_router(fine_tune_gpt_assistant_route)


#######################
# class Message(BaseModel):
#     role: str
#     content: str

# class MessageModel(BaseModel):
#     conversation: List[Message]
#     model_type: str

# class JustMessage(BaseModel):
#     content: str


# class RunModel(BaseModel):
#     instructions: str
#     assistant_id: str = None  # Optional assistant_id field

# # Directory where audio files will be stored
# AUDIO_FILES_DIRECTORY = Path(__file__).parent / "audio_files"
# AUDIO_FILES_DIRECTORY.mkdir(exist_ok=True)



# assistant = client.beta.assistants.create(
#     name="Proactive Language Learning Assistant",
#     description='Versatile language learning aid for all levels.',
#     instructions="The 'Proactive Language Learning Assistant' now adopts a unique character in each interaction to enhance the learning experience. In each new conversation, it takes on a new personality and backstory, like being 'John, a language teacher,' or other diverse roles related to language and culture. This approach aims to make conversations more engaging and varied, preventing them from becoming repetitive. The assistant still maintains its primary function as a versatile language learning aid for all levels, from beginners who receive proactive learning guidance to advanced users engaging in more dynamic, user-driven conversations. It continues to provide phrases in the target language along with their native translations for beginners, and reminds users that they can practice speaking using the Chat GPT app. examples: {messages: [{'role': system, 'content': 'Assist a beginner in practicing ordering food in French. Correct any mistakes and provide translations.'},{'role': 'user'', 'content': 'Let's practice ordering food.},{'role': 'assistant', 'content': 'Bien sûr! Que voudriez-vous commander? (Sure! What would you like to order?)'},{'role': 'user', 'content': 'Je voudrais un café and a croissant.'},{'role': 'assistant', 'content': 'Almost perfect! In French, you can say 'Je voudrais un café et un croissant.' 'Et' means 'and' in French.'}]}{messages: ['role': 'system', 'content': 'Help the user talk about their daily activities in French, providing corrections and translations.'},{'role': 'user', 'content': 'I want to talk about daily activities.'},{'role': 'assistant', 'content': 'D'accord! Qu'avez-vous fait aujourd'hui? (Alright! What did you do today?)'},{'role': 'user', 'content': 'Aujourd'hui, j'ai travaillé, then I went shopping.'},{'role': 'assistant', 'content': 'Good effort! You can say 'Aujourd'hui, j'ai travaillé, puis je suis allé faire du shopping.' 'Puis' means 'then' in French.'}]}{'messages': [{'role' 'system', 'content': 'Engage with the user in making weekend plans, providing language support in French.'},{'role': 'user', 'content': 'Let's talk about making plans for the weekend.'},{'role': 'assistant', 'content': 'Parfait! Quels sont vos plans pour ce week-end? (Perfect! What are your plans for this weekend?)'},{'role': 'user', 'content': 'Je pense aller au cinéma or maybe to a restaurant.},{'role': 'assistant', 'content': 'That's a good sentence! In French, you can say 'Je pense aller au cinéma ou peut-être à un restaurant.' 'Ou' means 'or' in French.'}]}",

#     # tools=[{"type": "code_interpreter"}],
#     model="gpt-3.5-turbo-1106"
#     # model='ft:gpt-3.5-turbo-1106:personal::8Mgpr2US' #french
#     # model="gpt-4-1106-preview"
# )




# @app.get("/api/create_thread")
# def create_thread():
#     thread = client.beta.threads.create()
#     print(thread.id)
#     return {"thread_id": thread.id}

# @app.post("/api/create_message/{thread_id}")
# def create_message(thread_id: str, message: MessageModel):
#     message = client.beta.threads.messages.create(
#         thread_id=thread_id,
#         role="user",
#         content=message.content  # Use the content variable here
#     )
#     print(message.id)
#     print(message.content)
#     return {"message_id": message.id}

# @app.post("/api/run/{thread_id}")
# def run(thread_id: str, run: RunModel):
#     # Use the provided assistant_id if available, otherwise default to the specified one
#     assistant_id_to_use = run.assistant_id if run.assistant_id else 'asst_smv1WVRPLQJYXXLqolmR4sFb'

#     run_response = client.beta.threads.runs.create(
#         thread_id=thread_id,
#         assistant_id=assistant_id_to_use,
#         instructions=run.instructions
#     )

#     run_check = client.beta.threads.runs.retrieve(
#         thread_id=thread_id,
#         run_id=run_response.id
#     )

#     while run_check.status != "completed":
#         run_check = client.beta.threads.runs.retrieve(
#             thread_id=thread_id,
#             run_id=run_response.id
#         )
#         print(run_check.status)
#         time.sleep(0.1)

#     return 'completed'

# @app.get("/api/generate_reply/{thread_id}")
# def generate_reply(thread_id: str):

#     messages = client.beta.threads.messages.list(
#     thread_id=thread_id
#    )

#     return messages.data




# @app.get("/api/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}

# @app.post("/api/text_to_speech/")
# async def text_to_speech(request: Request, message: MessageModel):
#     response = client.audio.speech.create(
#         model="tts-1-hd",
#         voice="shimmer",
#         input=message.content,

#     )
#     file_name = f"speech_{int(time.time())}.mp3"
#     speech_file_path = AUDIO_FILES_DIRECTORY / file_name
#     response.stream_to_file(speech_file_path)

#     audio_url = str(request.base_url) + "audio_files/" + file_name
#     return JSONResponse({"audio_url": audio_url})

# # Make sure to serve the directory where audio files are stored
# app.mount("/audio_files", StaticFiles(directory=str(AUDIO_FILES_DIRECTORY)), name="audio_files")


# async def sse_generator(audio_file_path, lang):
#     yield "data: Starting transcription\n\n"
#     await asyncio.sleep(1)  # Non-blocking sleep
#     print("Starting transcription")

#     try:
#         yield "data: Sending file to OpenAI for transcription\n\n"
#         await asyncio.sleep(2)  # Non-blocking sleep
#         print("Sending file to OpenAI for transcription")

#         # Use asynchronous context manager for file operations
#         async with aiofiles.open(audio_file_path, 'rb') as audio_file:
#             file_content = await audio_file.read()  # Read file content as bytes
#             print("File read successfully")
#             print(file_content)

#             transcript = await client.audio.transcriptions.create(
#                 model="whisper-1",
#                 file=file_content,  # Pass the bytes content
#                 language=lang
#             )
#             transcript_text = transcript.text

#         yield f"data: Transcription successful\n\n"
#         await asyncio.sleep(1)  # Non-blocking sleep
#         print("Transcription successful")

#         yield f"data: {transcript_text}\n\n"
#     except Exception as e:
#         print(f"Error during transcription: {e}")
#         yield f"data: Error during transcription: {str(e)}\n\n"

# @app.post("/api/stream_transcribe_audio")
# async def transcribe_audio(lang: str = "en", file: UploadFile = File(...)):
#     print("Received file:", file.filename)
#     file_name = f"audio_{int(time.time())}.m4a"
#     audio_file_path = AUDIO_FILES_DIRECTORY / file_name

#     try:
#         with audio_file_path.open("wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#     except Exception as e:
#         return {"error": str(e)}

#     response = StreamingResponse(sse_generator(audio_file_path, lang), media_type="text/event-stream")
#     return response


# @app.post("/api/transcribe_audio")
# async def transcribe_audio(lang: Optional[str] = "en", file: UploadFile = File(...)):
#     print("Received file:", file.filename)


#     # Verify if the language code is supported
#     # supported_langs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'jp'] # add other supported languages here
#     # if lang not in supported_langs:
#     #     raise HTTPException(status_code=400, detail="Unsupported language code")

#     # Save file to disk
#     file_name = f"audio_{int(time.time())}.m4a"
#     audio_file_path = AUDIO_FILES_DIRECTORY / file_name
#     try:
#         with audio_file_path.open("wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)
#         print("File saved successfully")
#     except Exception as e:
#         print(f"Error saving the file: {e}")
#         return {"error": str(e)}

#     print('lanf', lang)

#     # Send the file to OpenAI for transcription
#     try:
#         print("Sending file to OpenAI for transcription")
#         with audio_file_path.open("rb") as audio_file:
#             transcript = client.audio.transcriptions.create(
#                 model="whisper-1",
#                 file=audio_file,
#                 language='fr'
#             )
#         print("Transcription successful")
#     except Exception as e:
#         print("Error during transcription:", str(e))
#         return {"error": str(e)}

#     return {"text": transcript.text}

# @app.post("/api/add_message_with_voice_reply/{thread_id}")
# async def add_message_with_voice_reply(request: Request, thread_id: str, message: JustMessage):
#     # Create a message
#     created_message = client.beta.threads.messages.create(
#         thread_id=thread_id,
#         role="user",
#         content=message.content
#     )

#     print(created_message.id)

#     # Run the assistant
#     run = client.beta.threads.runs.create(
#         thread_id=thread_id,
#         assistant_id='asst_smv1WVRPLQJYXXLqolmR4sFb', #assistant.id,
#         instructions="reply"
#     )

#     print(run.id)

#     # Wait for run to complete
#     run_check = client.beta.threads.runs.retrieve(
#         thread_id=thread_id,
#         run_id=run.id
#     )

#     while run_check.status != "completed":
#         run_check = client.beta.threads.runs.retrieve(
#             thread_id=thread_id,
#             run_id=run.id
#         )
#         time.sleep(.1)
#         print(run_check.status)

#     # Retrieve all messages in the thread
#     raw_messages = client.beta.threads.messages.list(
#         thread_id=thread_id
#     ).data

#     print(raw_messages[0].content[0].text.value)

#     latest_reply = raw_messages[0].content[0].text.value

#     # Convert the messages into a serializable format
#     messages = [
#         {
#             "id": msg.id,
#             "content": msg.content[0].text.value, # Assuming the content has a text attribute
#             "role": msg.role,
#             "created_at": msg.created_at  # Convert datetime to string
#         }
#         for msg in raw_messages
#     ]




#     # Convert the reply to speech
#     response = client.audio.speech.create(
#         model="tts-1-hd",
#         voice="shimmer",
#         input=latest_reply

#     )

#     file_name = f"speech_{int(time.time())}.mp3"
#     speech_file_path = AUDIO_FILES_DIRECTORY / file_name
#     response.stream_to_file(speech_file_path)

#     audio_url = str(request.base_url) + "audio_files/" + file_name

#     # Return the messages and audio URL
#     return {
#         "messages": messages,
#         "audio_url": audio_url
#     }

# @app.post("/api/add_message_with_voice_reply_no_assistant")
# async def add_message_with_voice_reply_no_assistant(request: Request, message_model: MessageModel):
#     print('no assistant')

#     model_dict = {
#         'general_lang_chat': "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
#         'fr_Lesson1_alphabet_pronunciation': 'ft:gpt-3.5-turbo-1106:personal::8RLCgNEw',
#         }

#     # Use the provided conversation history directly
#     messages_list = message_model.conversation

#     # Get the assistant's response
#     response =  client.chat.completions.create(
#         model=model_dict.get(message_model.model_type, "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI"),
#         # model="gpt-3.5-turbo-1106",
#         messages=[message.dict() for message in messages_list],
#     )

#     choice = response.choices[0]
#     assistant_message = choice.message.content

#     print(assistant_message)

#     # Append the assistant's response to the messages list
#     messages_list.append(Message(role="assistant", content=assistant_message))

#     # Convert the messages into a serializable format
#     serializable_messages = [
#         {
#             "id": msg.role + str(idx),
#             "content": msg.content,
#             "role": msg.role
#         }
#         for idx, msg in enumerate(messages_list)
#     ]
#     # Convert the assistant's reply to speech
#     response = client.audio.speech.create(
#         model="tts-1-hd",
#         voice="shimmer",
#         input=assistant_message
#     )

#     file_name = f"speech_{int(time.time())}.mp3"
#     speech_file_path = AUDIO_FILES_DIRECTORY / file_name
#     response.stream_to_file(speech_file_path)

#     audio_url = str(request.base_url) + "audio_files/" + file_name

#     # Return the messages and audio URL
#     return {
#         "messages": serializable_messages,
#         "audio_url": audio_url
#     }


# @app.post("/api/delete_old_audio_files/{thread_id}")
# async def delete_old_audio_files(thread_id: str):
#     # Retrieve all messages in the thread
#     raw_messages = client.beta.threads.messages.list(
#         thread_id=thread_id
#     ).data

#     # Convert the messages into a serializable format
#     messages = [
#         {
#             "id": msg.id,
#             "content": msg.content[0].text.value, # Assuming the content has a text attribute
#             "role": msg.role,
#             "created_at": msg.created_at  # Convert datetime to string
#         }
#         for msg in raw_messages
#     ]

#     # Get the audio files that are no longer needed
#     audio_files_to_delete = [
#         msg["audio_url"].split("/")[-1]
#         for msg in messages
#         if msg["role"] == "user" and "audio_url" in msg
#     ]

#     # Delete the audio files
#     for file_name in audio_files_to_delete:
#         audio_file_path = AUDIO_FILES_DIRECTORY / file_name
#         try:
#             audio_file_path.unlink()
#             print(f"Deleted {file_name}")
#         except Exception as e:
#             print(f"Error deleting {file_name}: {e}")

#     return {"audio_files_deleted": audio_files_to_delete}

