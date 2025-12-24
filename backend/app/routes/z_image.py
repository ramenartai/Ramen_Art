from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import app.db.mongodb as mongodb
from app.schemas.z_image import ZImageRequest, ZImageResponse
from app.services.z_image.service import generate_image_service

router = APIRouter(
    prefix="/api/z-image",
    tags=["Z-Image"]
)


# ---------- Route ----------
@router.post("/generate", response_model=ZImageResponse)
async def generate_z_image(payload: ZImageRequest):
    """
    Generate image using Z-Image-Turbo model
    """
    if not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        result = await generate_image_service(
            prompt=payload.prompt,
            resolution=payload.resolution,
            steps=payload.steps,
            shift=payload.shift,
            seed=payload.seed,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image generation failed: {str(e)}"
        )
