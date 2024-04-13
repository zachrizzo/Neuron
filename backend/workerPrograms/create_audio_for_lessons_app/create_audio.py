
from openai import OpenAI
import os
from firebase_admin import credentials, firestore, initialize_app
from firebase_admin import storage
import json
from string import punctuation
import time
import firebase_admin
# from config import app

cred = credentials.Certificate("lang-learning-app-gpt-firebase-adminsdk-h6lgl-379786af55.json")

if not len(firebase_admin._apps):
    app = initialize_app(cred, {"storageBucket": "lang-learning-app-gpt.appspot.com"})
else:
    app = firebase_admin.get_app()
    print(app.name)


class Create_audio:
    def __init__(self, openai_secret=None,):
        # # Load .env file
        # load_dotenv('../../../backend/.env')

        self.client = OpenAI(api_key=openai_secret)


        self.db = firestore.client(app=app)
        self.bucket = storage.bucket(app=app)


        if not os.path.exists('lesson_audio'):
            os.makedirs('lesson_audio')

        self.list_of_audio_files = os.listdir('lesson_audio')


    def create_audio(self, male_voice, female_voice, chosen_voice, text, gender= None, overwrite_voice=None):
        if not text:
            return {'error': 'Text is empty'}

        if gender == 'Masculine':
            voice = male_voice
        elif gender == 'Feminine':
            voice = female_voice
        else:
            voice = chosen_voice if overwrite_voice else 'alloy'


        audio_file_path = self._send_audio_to_openai(voice, text)
        return audio_file_path

    def _audio_file_exists(self,text):
        try:
            normalized_text = self.remove_punctuation(text).lower()

            return os.path.exists(f"lesson_audio/{normalized_text}.mp3")
        except FileNotFoundError:
            return False

    def create_audio_for_all_more_then_one_lesson(self, lessons, male_voice, chosen_voice, female_voice,gender = None, overwrite_voice = None ):
        for lesson in lessons:
            try:
                if lesson['taskType'] == 'Conversation':
                    list_of_conversation_steps = lesson['conversationSteps']
                    for step in list_of_conversation_steps:
                        question = step['question']
                        response = step['expectedResponse']

                        question_audio_exists = self._audio_file_exists(question)
                        response_audio_exists = self._audio_file_exists(response)

                        if question and question_audio_exists==False:
                            self.create_audio(male_voice,female_voice,chosen_voice,question,gender,overwrite_voice)
                        else:
                            print(f'{question} already exists')

                        if response and response_audio_exists==False:
                            self.create_audio(male_voice,female_voice,chosen_voice,response,gender,overwrite_voice)
                        else:
                            print(f'{response} already exists')
                else:
                    print('----------------------------------')
                    text = lesson['text']
                    text_audio_exists = self._audio_file_exists(text)

                    if text and text_audio_exists==False:
                        self.create_audio(male_voice,female_voice,chosen_voice,text,gender,overwrite_voice)
                    else:
                        print(f'{text} already exists')
            except Exception as e:
                print(e)
                print(lesson,'failed')

    def add_to_firebase_storage_and_firestore(self, lessons, json_file_path):
        all_lesson_audio = {}
        bucket = storage.bucket()
        for file in self.list_of_audio_files:
            if file.endswith('.mp3'):
                # blob = bucket.blob(f'lessons/{lessons["lessonTitle"]}/{file}')
                blob = bucket.blob(f'lesson_audio/french/{file}')
                upload_location = f'lesson_audio/{file}'
                blob.upload_from_filename(upload_location)
                blob.make_public()
                url = blob.public_url
                self._update_JSON_file(url, lessons, file,json_file_path)

                # add the url to all_lesson_audio as the key as the audio file name
                all_lesson_audio[file] = url

        #save the all lesson audio to a json file
        with open('all_lesson_audio_french.json', 'w', encoding='utf-8') as f:
            json.dump(all_lesson_audio, f, indent=4, ensure_ascii=False)



        # with open(json_file_path, 'w') as f:
        #     json.dump(lessons, f, indent=4)

        self.add_to_fire_store( json_file_path)

    def add_to_fire_store(self, json_file_path):
        # Load lesson data from the provided JSON file
        with open(json_file_path) as f:
            data = json.load(f)

        # Load all_lesson_audio_french data
        all_lesson_audio_french_path = 'all_lesson_audio_french.json'
        try:
            with open(all_lesson_audio_french_path) as audio_f:
                all_lesson_audio_french = json.load(audio_f)
        except FileNotFoundError:
            print(f"File not found: {all_lesson_audio_french_path}")
            all_lesson_audio_french = {}

        # Include the all_lesson_audio_french data in the Firestore document
        firestore_data = data
        firestore_data['all_lesson_audio_french'] = all_lesson_audio_french

        # Add or update the Firestore document
        doc_ref = self.db.collection(u'lessons').document(firestore_data['lessonTitle'])
        doc_ref.set(firestore_data)


    def remove_punctuation(self,text):
        return ''.join(c for c in text if c not in punctuation)

    # def remove_punctuation(self, text, remove_unicode = False):
    #     if remove_unicode:
    #         # Normalize Unicode characters to their closest ASCII equivalent
    #         normalized_text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')

    #         # Remove punctuation
    #         return normalized_text.translate(str.maketrans('', '', string.punctuation)).lower()
    #     else:
    #         return ''.join(c for c in text if c not in punctuation)

    def _update_JSON_file(self, url, lessons, file, lesson_file_path):
       # Load existing JSON data from file
        print("Loading data from file:", lesson_file_path)
        with open(lesson_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Iterate through each exercise in the data
        for existing_lesson in data['exercises']:
            # Find the corresponding lesson update
            lesson_update = next((l for l in lessons if l['taskType'] == existing_lesson['taskType']), None)
            if not lesson_update:
                continue



            if existing_lesson['taskType'] == 'Conversation':
                for existing_step in existing_lesson['conversationSteps']:
                    question_text = self.remove_punctuation(existing_step['question']).lower() + ".mp3"
                    response_text = self.remove_punctuation(existing_step['expectedResponse']).lower() + ".mp3"

                    if file == question_text:
                        print("Updating audio file path for question:", question_text)
                        existing_step['audioFilePathQuestion'] = url

                    if file == response_text:
                        print("Updating audio file path for response:", response_text)
                        existing_step['audioFilePathResponse'] = url

            elif existing_lesson['taskType'] == 'Vocabulary':
                for french_phrase in lesson_update['options']['French']:
                    phrase_audio = self.remove_punctuation(french_phrase).lower() + ".mp3"
                    if file == phrase_audio:
                        print(f"Updating audio file path for French phrase: {french_phrase}")
                        existing_lesson['audioFilePaths'][french_phrase] = url

            elif existing_lesson['taskType'] == 'Grammar':
                for sentence_index, sentence in enumerate(existing_lesson['sentences']):
                    sentence_text = self.remove_punctuation(sentence['sentence']).lower() + ".mp3"
                    if file == sentence_text:
                        print(f"Updating audio file path for sentence in index {sentence_index}")
                        existing_lesson['sentences'][sentence_index]['audioFilePath'] = url

            elif existing_lesson['taskType'] in ['Reading', 'Speaking', 'Listening']:
                lesson_audio = self.remove_punctuation(existing_lesson['text']).lower() + ".mp3"
                if file == lesson_audio:
                    print("Updating audio file path for task type:", existing_lesson['taskType'])
                    existing_lesson['audioFilePath'] = url

        # Write the updated data back to the file
        print(f"Writing updated data back to file: {lesson_file_path}")
        with open(lesson_file_path, 'w',encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        print("Update complete.")






    def _send_audio_to_openai(self, voice, text):
        try:

            response = self.client.audio.speech.create(
                model="tts-1-hd",
                voice=voice,
                input=text
            )
              # Make all letters lowercase and remove punctuation from text
            clean_text = ''.join(c.lower() for c in text if c.isalpha() or c.isspace())

            file_path = os.path.join('lesson_audio', f'{clean_text}.mp3')
            response.stream_to_file(file_path)
            return file_path
        except Exception as e:
            print(e)
            time.sleep(21)
            response = self.client.audio.speech.create(
                model="tts-1-hd",
                voice=voice,
                input=text
            )
              # Make all letters lowercase and remove punctuation from text
            clean_text = ''.join(c.lower() for c in text if c.isalpha() or c.isspace())

            file_path = os.path.join('lesson_audio', f'{clean_text}.mp3')
            response.stream_to_file(file_path)
            return file_path




