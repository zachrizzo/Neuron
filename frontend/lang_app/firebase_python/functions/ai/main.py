from firebase_admin import firestore, storage
from firebase_functions import https_fn, logger
import os
import json
from openai import OpenAI
import time
import asyncio  # Import asyncio for handling async operations


@https_fn.on_request(secrets=['OPENAI_KEY'])
async def addMessageWithVoiceReply(req: https_fn.Request) -> https_fn.Response:  # Make the function async
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
        response = await client.chat.completions.create(  # Use await for asynchronous call
            model=model_dict.get(modelType, "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI"),
            messages=[{'role': message['text']['role'], 'content': message['text']['content']} for message in message_list],
        )

        logger.log("Response from OpenAI: " + str(response))

        choice = response.choices[0]
        assistant_message = choice.message.content

        audio_response = await client.audio.speech.create(  # Use await for asynchronous call
            model="tts-1-hd",
            voice="shimmer",
            input=assistant_message
        )

        logger.log("Response from OpenAI audio: " + str(audio_response))

        audio_content = await audio_response

        logger.log("Audio content: " + str(audio_content))

        bucket = storage.bucket()
        file_name = f"voiceReplies/{int(time.time())}.mp3"
        blob = bucket.blob(file_name)
        blob.upload_from_string(audio_content, content_type="audio/mp3")
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

        conversation_ref = db.collection('conversations').document(conversationId)
        conversation_ref.set({
            'messages': firestore.ArrayUnion([new_message])
        }, merge=True)

        return https_fn.Response("Message added successfully", status=200)
    except Exception as e:
        https_fn._logging.error(f'Error processing request: {e}')
        return https_fn.Response(f"Error processing request: {str(e)}", status=500)
