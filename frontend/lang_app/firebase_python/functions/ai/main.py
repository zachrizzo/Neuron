from firebase_admin import firestore, storage
from firebase_functions import https_fn, logger
import os
import json
from openai import OpenAI
import time
import asyncio  # Import asyncio for handling async operations
from pathlib import Path  # For handling file paths
import asyncio


# Initialize Firebase Admin SDK
# Make sure you've called firebase_admin.initialize_app() somewhere in your code if it's not already initialized.

@https_fn.on_request(secrets=['OPENAI_KEY'])
def addMessageWithVoiceReply(req: https_fn.Request) -> https_fn.Response:
    db = firestore.client()

    logger.log('This is a debug message')

    client = OpenAI(
        api_key=os.environ.get('OPENAI_KEY')
    )

    logger.log('client created')

    if req.method != "POST":
        return https_fn.Response("Method not allowed", status=405)

    try:
        data = json.loads(req.get_data(as_text=True))
    except json.JSONDecodeError as e:
        return https_fn.Response(f"Invalid JSON: {str(e)}", status=400)

    conversationId = data.get('conversationId')
    message_list = data.get('messages', [])
    modelType = data.get('modelType')

    logger.log(f"conversationId: {conversationId}, message_list: {message_list}, modelType: {modelType}")

    model_dict = {
        'general_lang_chat': "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
        'fr_Lesson1_alphabet_pronunciation': 'ft:gpt-3.5-turbo-1106:personal::8RLCgNEw',
    }

    try:
        response =  client.chat.completions.create(
            model=model_dict.get(modelType, "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI"),
            messages=[{'role': message['text']['role'], 'content': message['text']['content']} for message in message_list],
        )

        logger.log("Response from OpenAI: " + str(response))

        choice = response.choices[0]
        assistant_message = choice.message.content

        # Generate audio response
        audio_response =  client.audio.speech.create(
            model="tts-1-hd",
            voice="shimmer",
            input=assistant_message
        )

        # Save audio response to a temporary file
        temp_file_path = Path("/tmp/speech.mp3")
        audio_response.stream_to_file(temp_file_path)


        # Upload the audio file to Firebase Storage
        bucket = storage.bucket()
        file_name = f"voiceReplies/{int(time.time())}.mp3"
        blob = bucket.blob(file_name)
        blob.upload_from_filename(temp_file_path)
        blob.make_public()
        audioUrl = blob.public_url

        logger.log(f"Audio URL: {audioUrl}")

        new_message = {
            'id': f'{conversationId}_{len(message_list)}',
            'createdAt': time.time(),
            'text': {
                'content': assistant_message,
                'role': 'assistant'
            },
            'type': 'received',
            'audioUrl': audioUrl
        }

        logger.log(f"New message: {new_message},  conversationId: {conversationId}")

        conversation_ref = db.collection('conversations').document(conversationId)
        conversation_ref.set({
            'messages': firestore.ArrayUnion([new_message])
        }, merge=True)

        logger.log("Message added successfully")

        return https_fn.Response(json.dumps({"message": "Message added successfully","new_message": new_message}), status=200, mimetype='application/json')
    except Exception as e:
        logger.error(f'Error processing request: {e}')
        return https_fn.Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')

