import time
import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)


def upload_image_to_cloudinary(image_path: str, folder: str = "ramen-art") -> str:
    max_retries = 3
    delay = 2  # seconds

    for attempt in range(1, max_retries + 1):
        try:
            result = cloudinary.uploader.upload(
                image_path,
                folder=folder,
                resource_type="image",
                format="jpg",
                quality="auto:good",
                transformation=[
                    {"width": 1024, "height": 1024, "crop": "limit"},
                    {"quality": 85}
                ]
            )

            return result["secure_url"]

        except Exception as e:
            if attempt == max_retries:
                raise Exception(f"Cloudinary upload failed after {max_retries} attempts: {str(e)}")

            time.sleep(delay)
