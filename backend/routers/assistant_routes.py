from fastapi import APIRouter, HTTPException, Request
import time
from config import client, AUDIO_FILES_DIRECTORY, db
from models import AssistantModel, MessageModel, RunModel, JustMessage
import json
import asyncio

router = APIRouter()

# Helper function to create an assistant
async def create_new_assistant(assistant_data):
    return client.beta.assistants.create(**assistant_data.dict())

# Route to create an assistant
@router.post("/api/create_assistant")
async def create_assistant(assistant: AssistantModel):
    try:
        new_assistant = await create_new_assistant(assistant)
        return {"assistant_id": new_assistant.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to create a thread
@router.get("/api/create_thread")
async def create_thread():
    try:
        thread = client.beta.threads.create()
        return {"thread_id": thread.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper function to create a message
async def create_new_message(thread_id, message_data):
    return client.beta.threads.messages.create(thread_id=thread_id, role="user", content=message_data.content)

# Route to create a message
@router.post("/api/create_message/{thread_id}")
async def create_message(thread_id: str, message: MessageModel):
    try:
        message_response = await create_new_message(thread_id, message)
        return {"message_id": message_response.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to run the assistant
@router.post("/api/run/{thread_id}")
async def run(thread_id: str, run: RunModel):
    try:
        assistant_id_to_use = run.assistant_id if run.assistant_id else 'default_assistant_id'
        run_response = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=assistant_id_to_use,
            instructions=run.instructions
        )

        run_check = client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run_response.id
        )

        while run_check.status != "completed":
            time.sleep(0.1)
            run_check = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_response.id
            )

        return {"status": "completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route to generate a reply
@router.get("/api/generate_reply/{thread_id}")
async def generate_reply(thread_id: str):
    try:
        messages = client.beta.threads.messages.list(thread_id=thread_id)
        return {"messages": messages.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper function for processing voice replies
async def process_voice_reply(thread_id, message_content):
    created_message = client.beta.threads.messages.create(thread_id=thread_id, role="user", content=message_content)
    response = client.audio.speech.create(model="tts-1-hd", voice="shimmer", input=created_message.content)

    file_name = f"speech_{int(time.time())}.mp3"
    speech_file_path = AUDIO_FILES_DIRECTORY / file_name
    response.stream_to_file(speech_file_path)

    return file_name

# Route to add a message with voice reply
@router.post("/api/add_message_with_voice_reply/{thread_id}")
async def add_message_with_voice_reply(request: Request, thread_id: str, message: JustMessage):
    try:
        file_name = await process_voice_reply(thread_id, message.content)
        audio_url = str(request.base_url) + "audio_files/" + file_name

        return {"audio_url": audio_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#help function to create a message with data and run the assistant
async def create_new_message_with_data(thread_id, message_data, assistant_id):
    created_message = await asyncio.to_thread(
        client.beta.threads.messages.create,
        thread_id=thread_id,
        role="user",
        content=str(message_data)
    )
    run = await asyncio.to_thread(
        client.beta.threads.runs.create,
        thread_id=thread_id,
        assistant_id=assistant_id
    )

    run_check = await asyncio.to_thread(
        client.beta.threads.runs.retrieve,
        thread_id=thread_id,
        run_id=run.id

    )

    while run_check.status != "completed":
        await asyncio.sleep(0.1)  # Non-blocking sleep
        run_check = await asyncio.to_thread(
            client.beta.threads.runs.retrieve,
            thread_id=thread_id,
            run_id=run.id
        )

    messages = await asyncio.to_thread(
        client.beta.threads.messages.list,
        thread_id=thread_id
    )
    response = messages.data[0].content[0].text.value
    return response


# Route to create pertaining data
@router.post("/api/create_pertaining_data")
async def process_firebase_data():
    assistant_Id = 'asst_E5MPC5lXMaZvLEIdz8E0ocuB'
    check_response_message = "does this new conversation address the 'message' and 'whatWasWrong' array if yes only reply with 'yes' other wise reply with 'no'"
    file_name = f"____responses_{int(time.time())}.jsonl"

    try:


        #get the data from firebase
        docs = db.collection('fineTunningConversations').stream()
        data_list = [doc.to_dict() for doc in docs]
        list_of_fine_tunning_conversations = []
        num_todo = 0

        # with open(file_name, 'w') as file:
        for index,data in enumerate( data_list):
                print(index)
                if index == num_todo and num_todo != 0:
                    break
                if data.get('HasBeenFineTuned', False) == True:
                    continue

                #create thread
                thread = client.beta.threads.create()
                thread_id = thread.id
                print(thread_id)

                json_reply = await create_new_message_with_data(thread_id, data, assistant_Id)

                json_reply_check = await create_new_message_with_data(thread_id, check_response_message, assistant_Id)

                print(json_reply_check)

                todays_date = time.strftime("%Y-%m-%d", time.localtime())
                user_language = data.get(['language'], 'unknown')
                if json_reply_check == 'yes':


                    # Convert Unicode to Latin-1 if necessary
                    # json_reply = json_reply.encode('latin1').decode('unicode-escape')
                    print('worked first time: ', json_reply)

                     # Writing to the file in JSONL format
                    with open(f'../fineTunning/ft_{user_language}/ft_{user_language}_{todays_date}.jsonl', 'a') as file:
                        # jsonl_line = json.dumps(json.loads(json_reply)) + '\n'  # Converts to JSON and appends newline
                        file.write(json_reply + '\n')

                    list_of_fine_tunning_conversations.append(json_reply)

                    # update the document in firebase
                    doc_ref = db.collection('fineTunningConversations').document(data['id'])
                    doc_ref.setDoc({'HasBeenFineTuned': True, 'CorrectedConversation': json_reply}, merge=True)
                else:
                    # try again with the same data
                    print('trying again....')
                    new_prompt = f'try again, make sure your response takes into account "messages:{data["message"]}" and "whatWasWrong: {data["whatWasWrong"]}": {data}'
                    json_reply_retry = await create_new_message_with_data(thread_id, new_prompt, assistant_Id)
                    json_reply_check = await create_new_message_with_data(thread_id, check_response_message, assistant_Id)

                    if json_reply_check == 'yes':
                        # Convert Unicode to Latin-1 if necessary
                        # json_reply_retry = json_reply_retry.encode('latin1').decode('unicode-escape')
                        print('worked second time: ', json_reply_retry)

                        # Writing to the file in JSONL format
                        with open(f'../fineTunning/ft_{user_language}/ft_{user_language}_{todays_date}.jsonl', 'a') as file:
                            # jsonl_line = json.dumps(json.loads(json_reply)) + '\n'  # Converts to JSON and appends newline
                            file.write(json_reply + '\n')
                        list_of_fine_tunning_conversations.append(json_reply_retry)

                        # update the document in firebase
                        doc_ref = db.collection('fineTunningConversations').document(data['id'])
                        doc_ref.setDoc({'HasBeenFineTuned': True, 'CorrectedConversation': json_reply_retry}, merge=True)

                    else:
                        print('did not work', json_reply_check, json_reply_retry)


                #delete the thread
                client.beta.threads.delete(thread_id=thread_id)

        print(list_of_fine_tunning_conversations)


        return {"status": "completed", "data": list_of_fine_tunning_conversations}
        #update document in firebase



    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
