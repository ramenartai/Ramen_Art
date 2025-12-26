from pydantic import BaseModel
from typing import Optional


class ZImageRequest(BaseModel):
    prompt: str
    resolution: Optional[str] = "1024x1024 ( 1:1 )"
    steps: Optional[int] = 8
    shift: Optional[int] = 3
    seed: Optional[int] = 42
    random_seed: Optional[bool] = True


class ZImageResponse(BaseModel):
    image_url: str  # Cloudinary public URL
    model: str 
    seed_used: Optional[str] = None
    seed: Optional[int] = None