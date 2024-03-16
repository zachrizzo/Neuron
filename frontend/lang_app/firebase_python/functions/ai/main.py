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
    # Initialize Firestore client
    db = firestore.client()

    # Log initialization message
    logger.log('Initializing addMessageWithVoiceReply function.')

    # Create OpenAI client
    client = OpenAI(api_key=os.environ.get('OPENAI_KEY'))

    # Ensure the request method is POST
    if req.method != "POST":
        return https_fn.Response("Method not allowed", status=405)

    # Parse request data
    data = req.get_json(silent=True)
    if not data or 'conversationId' not in data or 'messages' not in data or 'userMessage' not in data:
        return https_fn.Response("Invalid request: Missing required fields", status=400)

    # Extract relevant data from the request
    conversationId = data['conversationId']
    message_list = data['messages']
    user_message = data['userMessage']


    # Check if message list is empty
    if not message_list:
        return https_fn.Response("Invalid request: 'messages' array is empty", status=400)

    # Prepare messages for OpenAI API
    formatted_messages = [{'role': msg['text']['role'], 'content': msg['text']['content']} for msg in message_list]


    #KEEP JUT FOR REFERENCE BUT NOT NEEDED
    model_dict = {
        'general_lang_chat': "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
        'fr_Lesson1_alphabet_pronunciation': 'ft:gpt-3.5-turbo-1106:personal::8RLCgNEw',
    }


    model = "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI"

    try:
        # Generate chat completion
        response = client.chat.completions.create(model=model, messages=formatted_messages)



        assistant_message = response.choices[0].message.content

        # Generate audio response
        audio_response = client.audio.speech.create(model="tts-1-hd", voice="shimmer", input=assistant_message)

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

        # Construct new message
        new_ai_message = {
            'id': f'{conversationId}_{len(message_list)}',
            'createdAt': time.time(),
            'text': {
                'content': assistant_message,
                'role': 'assistant'
            },
            'type': 'received',
            'audioUrl': audioUrl
        }

        new_user_message = {
            'id': f'{conversationId}_{len(message_list) + 1}',
            'createdAt': time.time(),
            'text': {
                'content': user_message,
                'role': 'user'
            },
            'type': 'sent',
        }

        # Save new message to Firestore
        conversation_ref = db.collection('chats').document(conversationId)

        conversation_ref.set({
            'messages': firestore.ArrayUnion([new_user_message, new_ai_message])
        }, merge=True)

        # Return success response
        return https_fn.Response(json.dumps({"message": "Messages added successfully", "user_message": new_user_message, "ai_message": new_ai_message, "audioUrl": audioUrl}), status=200, mimetype='application/json')
    except Exception as e:
        # Log and return error
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

    if req.method != "POST":
        return https_fn.Response("Method not allowed", status=405)

    content_type = req.headers['content-type']
    if 'multipart/form-data' not in content_type:
        return https_fn.Response("Invalid content type", status=400)

    # Process uploaded file and optional language parameter
    file = req.files['file']
    lang = req.form.get('lang', 'en')  # Default language to English if not specified
    messages_str = req.form.get('messages', '[]')
    conversationId = req.form['conversationId']
    formatted_messages = []

    try:
        messages_array = json.loads(messages_str)
        for message in messages_array:
            try:
                formatted_message = {
                    'role': message['text']['role'],
                    'content': message['text']['content']
                }
                formatted_messages.append(formatted_message)
            except json.JSONDecodeError:
                logger.log(f"Failed to decode message: {message}")
                continue

        # Save user's audio file to a temporary location and upload to Firebase Storage
        with NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

            # Upload user's audio file to Firebase Storage
            bucket = storage.bucket()
            user_audio_file_name = f"userVoiceReplies/{int(time.time())}.m4a"
            user_audio_blob = bucket.blob(user_audio_file_name)
            user_audio_blob.upload_from_filename(tmp.name)
            user_audio_blob.make_public()
            user_audio_url = user_audio_blob.public_url

        # Transcribe the audio file
        transcript_response = client.audio.transcriptions.create(
            model="whisper-1",
            file=open(tmp_path, "rb"),
            language=lang
        )

        transcript = transcript_response.text
        user_message = {'content': transcript, 'role': 'user'}

        # Append the new user message to the formatted messages list
        formatted_messages.append(user_message)

        # Generate audio from the chat response
        chat_response = client.chat.completions.create(
            model="ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
            messages=formatted_messages,
        )
        assistant_message = chat_response.choices[0].message.content

        # Generate audio for the AI's response
        with NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_audio:
            audio_response = client.audio.speech.create(
                model="tts-1-hd",
                voice="shimmer",
                input=assistant_message
            )
            audio_response.stream_to_file(tmp_audio.name)
            audio_file_name = f"voiceReplies/{int(time.time())}.mp3"
            ai_audio_blob = bucket.blob(audio_file_name)
            ai_audio_blob.upload_from_filename(tmp_audio.name)
            ai_audio_blob.make_public()
            ai_audio_url = ai_audio_blob.public_url

        # Add user's transcribed message, AI's reply, and user audio URL to Firestore
        new_user_message = {
            'id': f'{conversationId}_{int(time.time())}',
            'createdAt': time.time(),
            'text': user_message,
            'type': 'sent',
            'audioUrl': user_audio_url,  # Include user audio URL here
        }
        new_ai_message = {
            'id': f'{conversationId}_{int(time.time()) + 1}',
            'createdAt': time.time(),
            'text': {
                'content': assistant_message,
                'role': 'assistant'
            },
            'type': 'received',
            'audioUrl': ai_audio_url  # AI response audio URL
        }

        db = firestore.client()
        conversation_ref = db.collection('chats').document(conversationId)
        conversation_ref.update({
            'messages': firestore.ArrayUnion([new_user_message, new_ai_message])
        })

        return https_fn.Response(json.dumps({"message": "Messages added successfully", "user_message": new_user_message, "ai_message": new_ai_message}), status=200, mimetype='application/json')

    except Exception as e:
        logger.error(f'Error processing request: {e}')
        return https_fn.Response(json.dumps({"error": str(e)}), status=500, mimetype='application/json')
