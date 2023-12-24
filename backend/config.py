from openai import OpenAI
from pathlib import Path
from firebase_admin import credentials, firestore, initialize_app
import os
from dotenv import load_dotenv
# Load .env file
load_dotenv()


# get secert key from .env
client_secret = os.getenv("OPENAI_SECERT")

print(client_secret)
client = OpenAI(
    api_key=client_secret,
)
print(client.api_key)

# Define the directory for audio files
AUDIO_FILES_DIRECTORY = Path(__file__).parent / "audio_files"
AUDIO_FILES_DIRECTORY.mkdir(exist_ok=True)

# Initialize Firebase
cred = credentials.Certificate('./lang-learning-app-gpt-firebase-adminsdk-h6lgl-379786af55.json')
app = initialize_app(cred)
db = firestore.client()
