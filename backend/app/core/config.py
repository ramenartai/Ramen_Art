from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: Optional[str] = "MangaAI"
    DEBUG: Optional[bool] = True
    FRONTEND_URL: Optional[str] = "http://localhost:5173"  # ✅ Added

    # Mongo
    MONGODB_URI: str
    MONGODB_DB: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: Optional[str] = "HS256"
    JWT_EXPIRE_MINUTES: Optional[int] = 60

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str]
    GOOGLE_CLIENT_SECRET: Optional[str]
    GOOGLE_REDIRECT_URI: Optional[str]

    # Gemini AI
    GEMINI_API_KEY: Optional[str] = None

    # Replicate AI (Image Generation)
    REPLICATE_API_TOKEN: Optional[str] = None

    # Stability AI (Image Generation)
    STABILITY_API_KEY: Optional[str] = None

    # ================= Z-IMAGE =================
    Z_IMAGE_MODEL: str
    Z_IMAGE_DEFAULT_RESOLUTION: str
    Z_IMAGE_DEFAULT_STEPS: int
    Z_IMAGE_DEFAULT_SHIFT: int
    Z_IMAGE_DEFAULT_SEED: int

    HF_TOKEN: str | None = None

    # Cloudinary (NEW)
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    ENVIRONMENT: Optional[str] = 'local'
    
    class Config:
        env_file = ".env"


settings = Settings()