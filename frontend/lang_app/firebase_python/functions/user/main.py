# The Cloud Functions for Firebase SDK to set up triggers and logging.
from firebase_functions import scheduler_fn, logger

# The Firebase Admin SDK for database operations.
import firebase_admin
from firebase_admin import firestore

@scheduler_fn.on_schedule(schedule="0 */12 * * *")  # Every 12 hours
def user_refill(event: scheduler_fn.ScheduledEvent) -> None:
    """Refills user data every 12 hours."""
    db = firestore.client()
    users_ref = db.collection('users')

    # Example operation: Update user data
    users = users_ref.stream()
    for user in users:
        user_ref = users_ref.document(user.id)
        # Perform your update operations here, e.g., resetting counts, updating last refill time, etc.
        user_ref.set({
            'messagesLastRefill': firebase_admin.firestore.SERVER_TIMESTAMP,  # Example: Setting last refill timestamp
            'hearts': 5,  # Example: Resetting hearts to 5
            'numberOfMessages': 50,
            'heartsLastRefill': firebase_admin.firestore.SERVER_TIMESTAMP,
        }, merge=True)

        # Convert DocumentSnapshot to a dictionary before logging
        user_dict = user.to_dict()
        logger.log("Updated user:", user_dict)

    logger.log("Refilled user data.")
