from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.core.config import settings
from app.utils.auth_utils import get_current_user
from app.services.manga.manga_ai import suggest_panel_action, generate_panel_prompt
from app.services.manga.stability_service import generate_manga_panel_stability

router = APIRouter(tags=["Manga"], prefix="/api/manga")


# ==================== Request/Response Models ====================

class SuggestActionRequest(BaseModel):
    story_summary: str
    panel_number: int
    previous_panels: Optional[List[str]] = None
    characters_in_panel: Optional[List[str]] = None


class SuggestActionResponse(BaseModel):
    suggested_action: str


class GeneratePanelPromptRequest(BaseModel):
    panel_action: str
    characters: Optional[List[str]] = None
    style_notes: Optional[str] = "manga style, black and white"


class GeneratePanelPromptResponse(BaseModel):
    optimized_prompt: str


class GeneratePanelImageRequest(BaseModel):
    prompt: str
    character_image_urls: Optional[List[str]] = None
    width: Optional[int] = 768
    height: Optional[int] = 1024
    style: Optional[str] = "manga"


class GeneratePanelImageResponse(BaseModel):
    image_url: str
    prompt_used: str


# ==================== Endpoints ====================

@router.post("/suggest-action", response_model=SuggestActionResponse)
async def suggest_action(
    request: SuggestActionRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Suggest what should happen in a manga panel based on story context.
    Uses Gemini AI to generate contextually appropriate panel descriptions.
    """
    try:
        if not settings.GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured. Please add GEMINI_API_KEY to your .env file"
            )
        
        suggested_action = await suggest_panel_action(
            story_summary=request.story_summary,
            panel_number=request.panel_number,
            previous_panels=request.previous_panels,
            characters_in_panel=request.characters_in_panel
        )
        
        return SuggestActionResponse(suggested_action=suggested_action)
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to suggest panel action: {str(e)}"
        )


@router.post("/generate-panel-prompt", response_model=GeneratePanelPromptResponse)
async def generate_panel_prompt_endpoint(
    request: GeneratePanelPromptRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Convert a panel action description into an optimized prompt for image generation.
    This refines user input to work better with image generation models.
    """
    try:
        if not settings.GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured. Please add GEMINI_API_KEY to your .env file"
            )
        
        optimized_prompt = await generate_panel_prompt(
            panel_action=request.panel_action,
            characters=request.characters,
            style_notes=request.style_notes
        )
        
        return GeneratePanelPromptResponse(optimized_prompt=optimized_prompt)
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate panel prompt: {str(e)}"
        )


@router.post("/generate-panel-image", response_model=GeneratePanelImageResponse)
async def generate_panel_image_endpoint(
    request: GeneratePanelImageRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate manga panel using Stability AI SDXL with optional character references.
    
    Features:
    - High quality SDXL generation
    - Character reference support (image-to-image mode)
    - Uploaded to Cloudinary for permanent storage
    
    How it works:
    1. Takes your optimized prompt
    2. If character images provided, uses image-to-image mode
    3. Generates with Stability AI SDXL
    4. Uploads to Cloudinary
    5. Returns permanent Cloudinary URL
    
    Character References:
    - Pass character image URLs in character_image_urls
    - Stability will use them to maintain character consistency
    - Uses image-to-image transformation
    
    Cost: Stability AI credits (check your account)
    Time: ~15-30 seconds
    Quality: Excellent (SDXL)
    """
    try:
        if not settings.STABILITY_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="Stability API key not configured. Please add STABILITY_API_KEY to your .env file"
            )
        
        # Generate the image using Stability AI
        image_url = await generate_manga_panel_stability(
            prompt=request.prompt,
            character_image_urls=request.character_image_urls,
            width=request.width,
            height=request.height,
            style=request.style
        )
        
        return GeneratePanelImageResponse(
            image_url=image_url,
            prompt_used=request.prompt
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate panel image: {str(e)}"
        )
