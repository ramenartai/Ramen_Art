from gradio_client import Client
from app.core.config import settings
from app.services.z_image.constants import Z_IMAGE_MODEL

_client: Client | None = None

def get_z_image_client() -> Client:
    global _client

    if _client is None:
      

     _client = Client("Tongyi-MAI/Z-Image-Turbo")


    return _client
