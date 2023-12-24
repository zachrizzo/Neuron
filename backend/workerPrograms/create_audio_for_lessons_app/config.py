import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("../../lang-learning-app-gpt-firebase-adminsdk-h6lgl-379786af55.json")
app_name = "my-app"  # Provide a unique app name
# if not len(firebase_admin._apps):
app = initialize_app(cred, {"storageBucket": "lang-learning-app-gpt.appspot.com"}, name=app_name)
# else:
#     app = firebase_admin.get_app(app_name)
#     print(app.name)

