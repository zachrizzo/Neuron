from openai import OpenAI


client = OpenAI(
    api_key='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'
)
# messages_list =[]
# messages_list.append({"role": "system", "content": "let me kow what conversation you want to have with me in french"})
# messages_list.append({"role": "user", "content": "I want to learn to talk about family in french"})


# messages_list

# while True:
#     response = client.chat.completions.create(
#     model="ft:gpt-3.5-turbo-1106:personal::8Mgpr2US",
#     messages=messages_list,
#     )
#     # ChatCompletion(id='chatcmpl-8Mhyg35JgJlS3Lk5DuS1zI29qpL2F', choices=[Choice(finish_reason='stop', index=0, message=ChatCompletionMessage(content="D'accord. How do you say 'My sister is 25 years old' in French?", role='assistant', function_call=None, tool_calls=None))], created=1700422958, model='ft:gpt-3.5-turbo-1106:personal::8Mgpr2US', object='chat.completion', system_fingerprint=None, usage=CompletionUsage(completion_tokens=20, prompt_tokens=32, total_tokens=52))


#     choice = response.choices[0]
#     message = choice.message
#     print(message.content)

#     messages_list.append({"role": "assistant", "content": message.content})

#     # allow user to respond
#     user_input = str(input("Your response: "))
#     messages_list.append({"role": "user", "content": user_input})



# audio_file= open("/Users/zachrizzo/programing/language_learning_app/backend/GMT20231120-171042_Recording.m4a", "rb")
# transcript = client.audio.transcriptions.create(
#   model="whisper-1",
#   file=audio_file
# )
# print(transcript)

