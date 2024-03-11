from firebase_admin import firestore, storage
from firebase_functions import https_fn, logger
import os
import json
from openai import OpenAI
import time
from pathlib import Path  # For handling file paths
from tempfile import NamedTemporaryFile


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

@https_fn.on_request(secrets=['OPENAI_KEY'])
def transcribe_audio(req: https_fn.Request) -> https_fn.Response:

    client = OpenAI(
        api_key=os.environ.get('OPENAI_KEY')
    )

    if req.method != "POST":
        return https_fn.Response("Method not allowed", status=405)



    content_type = req.headers['content-type']
    if 'multipart/form-data' not in content_type:
        return https_fn.Response("Invalid content type", status=400)

    # Assuming the file is sent as a part of multipart/form-data
    # Adjust based on your frontend implementation
    file = req.files['file']
    lang = req.form.get('lang', 'en')  # Default language to English if not specified

    try:
        # Save file to a temporary location
        with NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        # Transcribe the audio file using OpenAI's Whisper model
        transcript_response = client.audio.transcriptions.create(
            model="whisper-1",
            file=open(tmp_path, "rb"),
            language=lang
        )

        transcript = transcript_response['text']

        logger.log(f"Transcription successful: {transcript}")

        # Cleanup: remove the temporary file after transcription
        os.remove(tmp_path)

        return https_fn.Response(json.dumps({"transcript": transcript}), status=200, mimetype='application/json')

    except Exception as e:
        logger.error(f"Error during transcription: {str(e)}")
        # Cleanup in case of an error
        if 'tmp_path' in locals():
            os.remove(tmp_path)
        return https_fn.Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')



@https_fn.on_request(secrets=['OPENAI_KEY'])
def addMessageFromVoiceInputWithAudioReply(req: https_fn.Request) -> https_fn.Response:
    client = OpenAI(
        api_key=os.environ.get('OPENAI_KEY')
    )

    logger.log(f"This is a debug message. Path: {req.path}, Method: {req.method}")



    if req.method != "POST":
        return https_fn.Response("Method not allowed", status=405)

    content_type = req.headers['content-type']
    if 'multipart/form-data' not in content_type:
        return https_fn.Response("Invalid content type", status=400)

    # Process uploaded file and optional language parameter
    file = req.files['file']
    lang = req.form.get('lang', 'en')  # Default language to English if not specified
    conversationId = req.form['conversationId']

    logger.log(f"conversationId: {conversationId}, lang: {lang}, file: {file}")

    try:
        with NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        logger.log(f"File saved to: {tmp_path}")

        # Transcribe the audio file
        transcript_response = client.audio.transcriptions.create(
            model="whisper-1",
            file=open(tmp_path, "rb"),
            language=lang
        )

        logger.log(f"Transcription response: {transcript_response}")

        # Assuming transcript_response is an object with a 'text' attribute
        transcript = transcript_response.text

        user_message = {'content': transcript, 'role': 'user'}

        # Generate a chat response
        chat_response = client.chat.completions.create(
            model="ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
            messages=[{'role': 'user', 'content': transcript}],
        )
        assistant_message = chat_response.choices[0].message.content

        # Generate audio from the chat response
        with NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_audio:
            audio_response = client.audio.speech.create(
                model="tts-1-hd",
                voice="shimmer",
                input=assistant_message
            )
            audio_response.stream_to_file(tmp_audio.name)
            audio_file_name = f"voiceReplies/{int(time.time())}.mp3"
            bucket = storage.bucket()
            blob = bucket.blob(audio_file_name)
            blob.upload_from_filename(tmp_audio.name)
            blob.make_public()
            audioUrl = blob.public_url
            os.remove(tmp_audio.name)  # Clean up the temporary audio file

        db = firestore.client()
        conversation_ref = db.collection('chats').document(conversationId)

        # Add user's transcribed message and AI's reply to Firestore
        new_user_message = {
            'id': f'{conversationId}_{int(time.time())}',
            'createdAt': time.time(),
            'text': user_message,
            'type': 'sent',
        }
        new_ai_message = {
            'id': f'{conversationId}_{int(time.time()) + 1}',
            'createdAt': time.time(),
            'text': {
                'content': assistant_message,
                'role': 'assistant'
            },
            'type': 'received',
            'audioUrl': audioUrl
        }

        # Use a transaction or batched write if you need atomicity
        conversation_ref.set({
            'messages': firestore.ArrayUnion([new_user_message, new_ai_message])
        }, merge=True)

        return https_fn.Response(json.dumps({"message": "Messages added successfully", "user_message": new_user_message, "ai_message": new_ai_message}), status=200, mimetype='application/json')

    except Exception as e:
        logger.error(f'Error processing request: {e}')
        return https_fn.Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')
