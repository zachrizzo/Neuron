
from firebase_admin import firestore, storage
from firebase_functions import https_fn
from firebase_functions.params import IntParam, StringParam
from openai import OpenAI
import time
import os
import json


@https_fn.on_request(secrets=['OPENAI_KEY'])
def addMessageWithVoiceReply(req: https_fn.Request) -> https_fn.Response:
    db = firestore.client()

    https_fn._logging.debug('This is a debug message')

    client = OpenAI(
        api_key=os.environ.get('OPENAI_KEY')
    )

    if req.method != "POST":
        return https_fn.Response("Method not allowed", status=405)

    # Parse the JSON body of the request
    try:
        data = json.loads(req.get_data(as_text=True))
    except json.JSONDecodeError as e:
        return https_fn.Response(f"Invalid JSON: {str(e)}", status=400)

    conversationId = data.get('conversationId')
    message_list = data.get('messages', [])
    modelType = data.get('modelType')

    model_dict = {
        'general_lang_chat': "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI",
        'fr_Lesson1_alphabet_pronunciation': 'ft:gpt-3.5-turbo-1106:personal::8RLCgNEw',
    }
    try:
        response = client.chat.completions.create(
            model=model_dict.get(modelType, "ft:gpt-3.5-turbo-1106:personal::8N8bJgSI"),
            messages=[{'role': message['text']['role'], 'content': message['text']['content']} for message in message_list],
        )

        choice = response.choices[0]
        assistant_message = choice.message.content
        # Assuming you have a function to generate the speech and return the audio URL
        audio = client.audio.speech.create(
            model="tts-1-hd",
            voice="shimmer",
            input=assistant_message

        )

        if 'error' in audio:
            https_fn._logging.error("Response from OpenAI was not OK.")
            return https_fn.Response("Error processing audio response", status=500)

        print(audio)

        bucket = storage.bucket()
        file_name = f"voiceReplies/{int(time.time())}.mp3"
        blob = bucket.blob(file_name)
        blob.upload_from_string(audio, content_type="audio/mp3")
        blob.make_public()
        audioUrl = blob.public_url


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

        #update the conversation in firestore
        conversation_ref = db.collection('conversations').document(conversationId)
        conversation_ref.set({
            'messages': firestore.ArrayUnion([new_message])
        }, merge=True)

        print("Message added successfully")

        return https_fn.Response("Message added successfully", status=200)
    except Exception as e:
        https_fn._logging.error(f'Error processing request: {e}')
        # Ensure that a response is returned even in case of failure
        return https_fn.Response(f"Error processing request: {str(e)}",status=500)







