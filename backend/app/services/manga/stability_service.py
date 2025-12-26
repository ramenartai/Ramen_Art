import httpx
import base64
from typing import Optional, List
from app.core.config import settings
import tempfile
import os


async def generate_manga_panel_stability(
    prompt: str,
    character_image_urls: Optional[List[str]] = None,
    width: int = 768,
    height: int = 1024,
    style: str = "manga"
) -> str:
    """
    Generate a manga panel using Stability AI's SDXL with optional character references.
    
    Stability AI supports:
    - Image-to-image generation (character references!)
    - High quality SDXL model
    - Control over style and parameters
    
    Args:
        prompt: Text description
        character_image_urls: Optional character reference images
        width: Image width
        height: Image height
        style: Art style
    
    Returns:
        Cloudinary URL of the generated image
    """
    if not settings.STABILITY_API_KEY:
        raise ValueError("Stability API key not configured. Add STABILITY_API_KEY to .env")
    
    # Enhance prompt for manga style
    if style == "manga":
        enhanced_prompt = f"{prompt}, manga art style, black and white, high contrast, clean lines, professional manga illustration, monochrome, detailed linework"
        negative_prompt = "color, photograph, realistic, 3d render, blurry, low quality, watermark, text"
    else:
        enhanced_prompt = prompt
        negative_prompt = "blurry, low quality, watermark"
    
    # Stability AI API endpoint
    # If character reference provided, use image-to-image (sketch-to-image)
    # Otherwise use text-to-image
    
    if character_image_urls and len(character_image_urls) > 0:
        # Use image-to-image with character reference
        api_url = "https://api.stability.ai/v2beta/stable-image/generate/sd3"
        
        # Download character reference image
        async with httpx.AsyncClient(timeout=60.0) as client:
            char_response = await client.get(character_image_urls[0])
            if char_response.status_code != 200:
                raise Exception(f"Failed to download character reference: {char_response.status_code}")
            
            character_image_data = char_response.content
        
        # Prepare multipart form data
        files = {
            "image": ("character.png", character_image_data, "image/png"),
        }
        
        data = {
            "prompt": enhanced_prompt,
            "negative_prompt": negative_prompt,
            "mode": "image-to-image",
            "strength": 0.6,  # How much to transform the reference (0-1)
            "output_format": "png"
        }
        
    else:
        # Use text-to-image
        api_url = "https://api.stability.ai/v2beta/stable-image/generate/sd3"
        
        files = None
        data = {
            "prompt": enhanced_prompt,
            "negative_prompt": negative_prompt,
            "aspect_ratio": f"{width}:{height}",
            "mode": "text-to-image",
            "output_format": "png"
        }
    
    headers = {
        "Authorization": f"Bearer {settings.STABILITY_API_KEY}",
        "Accept": "image/*"
    }
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            if files:
                response = await client.post(
                    api_url,
                    headers=headers,
                    files=files,
                    data=data
                )
            else:
                response = await client.post(
                    api_url,
                    headers=headers,
                    data=data
                )
            
            if response.status_code != 200:
                error_detail = response.text
                raise Exception(f"Stability AI error {response.status_code}: {error_detail}")
            
            # Save image temporarily
            from app.services.cloudinary.service import upload_image_to_cloudinary
            
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
                temp_file.write(response.content)
                temp_path = temp_file.name
            
            try:
                # Upload to Cloudinary
                cloudinary_url = upload_image_to_cloudinary(
                    temp_path,
                    folder="manga-panels"
                )
                
                return cloudinary_url
                
            finally:
                # Clean up
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                    
    except Exception as e:
        raise Exception(f"Stability AI generation failed: {str(e)}")
