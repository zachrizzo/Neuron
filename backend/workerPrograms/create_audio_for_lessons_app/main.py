import os
import random
import streamlit as st
import json
import string
from create_audio import Create_audio  # Ensure this is correctly imported



def get_array_from_json(json_file_path, array_key):
    try:
        with open(json_file_path, 'r') as file:
            data = json.load(file)
            return data.get(array_key, None)
    except FileNotFoundError:
        st.error("File not found!")
        return None

# [Previous helper functions: conversation_audio_exists, remove_punctuation, audio_file_exists]
def audio_file_exists(text):
    try:
        normalized_text = text.lower()
        return os.path.exists(f"lesson_audio/{normalized_text}.mp3")
    except FileNotFoundError:
        return False

def conversation_audio_exists(conversation_steps):
    for step in conversation_steps:
        question_text = step.get('question', '')
        response_text = step.get('expectedResponse', '')
        if question_text and not audio_file_exists(question_text):
            return False
        if response_text and not audio_file_exists(response_text):
            return False
    return True

# Streamlit app setup
st.title("Create Audio for Lessons")

# Initialize session state variables
if "selected_exercise" not in st.session_state:
    st.session_state.selected_exercise = {}

if "conversation_part" not in st.session_state:
    st.session_state.conversation_part = None

if "conversation_text" not in st.session_state:
    st.session_state.conversation_text = None

if "array_data" not in st.session_state:
    st.session_state.array_data = None

if 'create_audio' not in st.session_state:
    st.session_state.create_audio = Create_audio()

if 'audio_file_path' not in st.session_state:
    st.session_state.audio_file_path = None

if "all_exercises" not in st.session_state:
    st.session_state.all_exercises = []

# JSON file path input
default_dir = '/Users/zachrizzo/programing/language_learning_app/backend/workerPrograms/lessons/french/basic_phrases_and_greeting_people/lesson1.json'
json_file_path = st.text_input("Enter JSON File Path:", value=default_dir)

# Voice selection
voice_col1, voice_col2 = st.columns(2)
with voice_col1:
    female_voice = st.radio("Female Voice", ('alloy', 'nova', 'shimmer'))
with voice_col2:
    male_voice = st.radio("Male Voice", ('echo', 'fable', 'onyx'), index=2)

# Task type selection
selected_task_types = st.multiselect('Select Task Types', ['Speaking', 'Reading', 'Writing', 'Listening', 'Grammar', 'Vocabulary', 'Conversation'])

if st.button("Fetch Exercises"):
    st.session_state.array_data = get_array_from_json(json_file_path, 'exercises')

# Filter and display exercises
st.sidebar.title("Filtered Exercise Texts")
if st.sidebar.button('Create Audio for All Exercises'):

    st.session_state.create_audio.create_audio_for_all_more_then_one_lesson(
        st.session_state.all_exercises,male_voice,female_voice,None,None,None
    )






st.sidebar.divider()

if st.session_state.array_data:

    for index_item,item in enumerate(st.session_state.array_data):
        if item.get('taskType') in selected_task_types:
            st.session_state.all_exercises.append(item)
            if item['taskType'] == 'Conversation':


                for index, step in enumerate(item.get('conversationSteps', [])):
                    #if step is question

                    question_text = st.session_state.create_audio.remove_punctuation(step.get('question', '')).lower()
                    response_text = st.session_state.create_audio.remove_punctuation(step.get('expectedResponse', '')).lower()


                    if question_text:
                        audio_exists = audio_file_exists(question_text)
                        display_text = question_text
                        button_label = f"✅ {display_text}" if audio_exists else f"❌ {display_text}"

                        if st.sidebar.button(button_label, key=f"conversation_step_{index}_{index_item}_question"):

                            st.session_state['selected_exercise'] = item
                            st.session_state.conversation_part = 'question'
                            st.session_state.conversation_text = step.get('question', '')

                    if response_text:

                        audio_exists = audio_file_exists(response_text)
                        display_text = response_text
                        button_label = f"✅ {display_text}" if audio_exists else f"❌ {display_text}"

                        if st.sidebar.button(button_label, key=f"conversation_step_{index}_{index_item}_response"):

                            st.session_state['selected_exercise'] = item
                            st.session_state.conversation_part = 'response'
                            st.session_state.conversation_text = step.get('expectedResponse', '')




            elif 'text' in item:
                text = st.session_state.create_audio.remove_punctuation(item['text'])
                audio_exists = audio_file_exists(text)
                button_label = f"✅ {text}" if audio_exists else f"❌ {text}"
                if st.sidebar.button(button_label, key=f"exercise_{index_item}"):
                    st.session_state.selected_exercise = item
                    st.session_state.conversation_part = None



# Audio creation column
create_audio_col1, play_audio_col2 = st.columns(2)

with create_audio_col1:
    st.write("Selected Exercise:", st.session_state.selected_exercise)

    overwrite_audio = st.checkbox("Overwrite Audio")
    overwrite_voice = None

    if overwrite_audio:
        overwrite_voice = st.radio("Overwrite Audio", ('Man', 'Women'), index=1)

    if st.session_state.selected_exercise:
        selected_exercise = st.session_state.selected_exercise
        conversation_part = st.session_state.conversation_part
        conversation_text = st.session_state.conversation_text

        if conversation_part in ['question', 'response']:
            text = conversation_text
            gender = None
            if overwrite_audio:
                if overwrite_voice == 'Man':
                    chosen_voice = male_voice
                else:
                    chosen_voice = female_voice
            else:
                chosen_voice = None

            if text and st.button("Create Audio for Selected Step"):
                with st.spinner("Creating audio..."):
                    audio_path = st.session_state.create_audio.create_audio(male_voice,female_voice,chosen_voice,text,gender,overwrite_voice)
                    if audio_path:
                        st.success("Audio created successfully!")
                        raise st.rerun()

        else:
            if st.button("Create Audio"):
                with st.spinner("Creating audio..."):
                    gender = selected_exercise.get('gender', None)
                    if overwrite_audio:
                        if overwrite_voice == 'Man':
                            chosen_voice = male_voice
                        else:
                            chosen_voice = female_voice
                    else:
                        chosen_voice = None

                    audio_path = st.session_state.create_audio.create_audio(male_voice,female_voice,chosen_voice,selected_exercise.get('text',''),gender,overwrite_voice)
                    if audio_path:
                        st.success("Audio created successfully!")
                        raise st.rerun()


    if st.button('refresh'):
        raise st.rerun()

with play_audio_col2:
    if st.session_state['selected_exercise']:
        if st.session_state['selected_exercise'].get('taskType') == 'Conversation':
            st.subheader("Play Created Audio for Conversation")
            for step in st.session_state['selected_exercise'].get('conversationSteps', []):
                question_text = st.session_state.create_audio.remove_punctuation(step.get('question', '')).lower()
                response_text = st.session_state.create_audio.remove_punctuation(step.get('expectedResponse', '')).lower()

                question_audio_path = f"./lesson_audio/{question_text}.mp3"
                response_audio_path = f"./lesson_audio/{response_text}.mp3"

                if os.path.exists(question_audio_path):
                    st.write(f"Question: {step['question']}")
                    st.audio(question_audio_path, format='audio/mp3')
                if os.path.exists(response_audio_path):
                    st.write(f"Response: {step['expectedResponse']}")
                    st.audio(response_audio_path, format='audio/mp3')
        else:

            clean_text = st.session_state.create_audio.remove_punctuation(st.session_state['selected_exercise'].get('text', '')).lower()
            audio_path = f"./lesson_audio/{clean_text}.mp3"
            st.subheader("Play Created Audio")
            if os.path.exists(audio_path):
                st.audio(audio_path, format='audio/mp3')

st.divider()
st.subheader("Add All Filtered Audio to Firebase (vocab doesn't work rn)")

if st.button("Add To Firebase"):
    with st.spinner("Adding to Firebase..."):
        st.session_state['create_audio'].add_to_firebase_storage_and_firestore(st.session_state['all_exercises'], json_file_path)
