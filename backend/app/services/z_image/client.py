from gradio_client import Client
from app.core.config import settings
from app.services.z_image.constants import Z_IMAGE_MODEL

_client: Client | None = None

def get_z_image_client() -> Client:
    global _client

    if _client is None:
        # Note: The installed version of gradio_client seems to not support hf_token in __init__
        # or the user is using a public space where it's not needed.
        # We use the simple initialization as requested.
        _client = Client(Z_IMAGE_MODEL)

    return _client
