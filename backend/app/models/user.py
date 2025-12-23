# MongoDB collection reference for users
USER_COLLECTION = "users"

# Optional: helper function to prepare user dict
def user_dict(email: str, name: str, user_name: str, google_id: str, picture: str = None):
    return {
        "email": email,
        "name": name,
        "user_name": user_name,
        "google_id": google_id,
        "picture": picture
    }
