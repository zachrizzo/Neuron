from config import db, client
import asyncio
import json
import time
import os
import json
import unidecode


def convert_unicode(obj):
    if isinstance(obj, str):
        return unidecode.unidecode(obj)
    elif isinstance(obj, dict):
        return {convert_unicode(key): convert_unicode(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_unicode(element) for element in obj]
    else:
        return obj

def fix_quotes(json_string):
    # Replace escaped double quotes with single quotes
    return json_string.replace('\\"', "'")

def convert_unicode_in_json_file(input_file_path, output_file_path):
    with open(input_file_path, 'r', encoding='utf-8') as input_file, \
         open(output_file_path, 'w', encoding='utf-8') as output_file:
        for line in input_file:
            if not line.strip():
                continue  # Skip empty lines
            try:
                data = json.loads(line)
                converted_data = convert_unicode(data)
                fixed_line = fix_quotes(json.dumps(converted_data, ensure_ascii=False))
                output_file.write(fixed_line + '\n')
                print(f"Converted line in file {input_file_path}")
                # Apply character fixing logic

                print('line is: ', line)
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON on line in file {input_file_path}: {e}")

def process_directory(directory):
    for subdir, dirs, files in os.walk(directory):
        for filename in files:
            filepath = os.path.join(subdir, filename)
            if filepath.endswith('.jsonl'):
                output_file_path = filepath[:-5] + "_converted.jsonl"  # Change extension or adjust naming as needed
                convert_unicode_in_json_file(filepath, output_file_path)
                print(f"Processed {filepath}")

##########################################

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



async def process_firebase_data():
    assistant_Id = 'asst_E5MPC5lXMaZvLEIdz8E0ocuB'
    check_response_message = "does this new conversation address the 'message' and 'whatWasWrong' array if yes only reply with 'yes' other wise reply with 'no'"


    try:


        #get the data from firebase
        docs = db.collection('fineTunningConversations').stream()
        data_list = [{'id': doc.id, 'data': doc.to_dict()} for doc in docs]
        list_of_fine_tunning_conversations = []
        num_todo = 0


        for index,item in enumerate(data_list):

                doc_id = item['id']
                data = item['data']

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
                user_language = data.get('language', 'unknown')



                path_to_file = f'./fineTunning/ft_{user_language}/ft_{user_language}_{todays_date}.jsonl'
                # Create the directory if it does not exist
                os.makedirs(os.path.dirname(path_to_file), exist_ok=True)

                # Create the file if it does not exist
                with open(path_to_file, 'a') as file:
                    print('created file: ', path_to_file)
                    pass



                if json_reply_check == 'yes':


                    # Convert Unicode to Latin-1 if necessary
                    # json_reply = json_reply.encode('latin1').decode('unicode-escape')
                    print('worked first time: ', json_reply)

                     # Writing to the file in JSONL format
                    with open(path_to_file, 'a') as file:
                        # jsonl_line = json.dumps(json.loads(json_reply)) + '\n'  # Converts to JSON and appends newline
                        file.write(json_reply + '\n')

                    list_of_fine_tunning_conversations.append(json_reply)

                    # update the document in firebase
                    doc_ref = db.collection('fineTunningConversations').document(doc_id)
                    doc_ref.set({'HasBeenFineTuned': True, 'CorrectedConversation': json_reply}, merge=True)
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
                        with open(path_to_file, 'a') as file:
                            # jsonl_line = json.dumps(json.loads(json_reply)) + '\n'  # Converts to JSON and appends newline
                            file.write(json_reply + '\n')
                        list_of_fine_tunning_conversations.append(json_reply_retry)

                        # update the document in firebase
                        doc_ref = db.collection('fineTunningConversations').document(doc_id)
                        doc_ref.set({'HasBeenFineTuned': True, 'CorrectedConversation': json_reply_retry}, merge=True)

                    else:
                        print(json_reply_check)
                        print('did not work', json_reply_retry)


                #delete the thread
                client.beta.threads.delete(thread_id=thread_id)

        print(list_of_fine_tunning_conversations)





        return {"status": "completed", "data": list_of_fine_tunning_conversations}
        #update document in firebase



    except Exception as e:
        print(e)
        return {"status": "error", "error": str(e)}




if __name__ == "__main__":
    main_dir = './fineTunning'
    asyncio.run(process_firebase_data())
    #remove the unicode from all the files in the directory
    process_directory(main_dir)



