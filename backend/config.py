from openai import OpenAI
from pathlib import Path
from firebase_admin import credentials, firestore, initialize_app


client = OpenAI(
    api_key='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'

    # Defaults to os.environ.get("OPENAI_API_KEY")
    # Otherwise use: api_key="Your_API_Key",
)

# Define the directory for audio files
AUDIO_FILES_DIRECTORY = Path(__file__).parent / "audio_files"
AUDIO_FILES_DIRECTORY.mkdir(exist_ok=True)

# Initialize Firebase
cred = credentials.Certificate('./lang-learning-app-gpt-firebase-adminsdk-h6lgl-379786af55.json')
initialize_app(cred)
db = firestore.client()
