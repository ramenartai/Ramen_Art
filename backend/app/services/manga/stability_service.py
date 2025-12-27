import httpx
import base64
from typing import Optional, List
from app.core.config import settings
import tempfile
import os
from google import genai
from google.genai import types


async def generate_manga_panel_stability(
    prompt: str,
    character_image_urls: Optional[List[str]] = None,
    width: int = 768,
    height: int = 1024,
    style: str = "manga"
) -> str:
    """
    Generate a manga panel using Gemini's gemini-2.5-flash-image model with optional character references.
    
    Args:
        prompt: Text description
        character_image_urls: Optional character reference images
        width: Image width
        height: Image height
        style: Art style
    
    Returns:
        Cloudinary URL of the generated image
    """
    if not settings.GEMINI_IMAGE_API_KEY:
        raise ValueError("Gemini Image API key not configured. Add GEMINI_IMAGE_API_KEY to .env")
    
    # Initialize Gemini client
    client = genai.Client(api_key=settings.GEMINI_IMAGE_API_KEY)
    
    # Enhance prompt for manga style
    if style == "manga":
        enhanced_prompt = f"""Create a manga panel illustration with the following scene:

{prompt}

Style requirements:
- Black and white manga art style
- High contrast with clean lines
- Professional manga illustration quality
- Monochrome with detailed linework
- Dynamic composition suitable for manga panels
- No color, pure black and white manga aesthetic"""
    else:
        enhanced_prompt = prompt
    
    try:
        # If character reference images provided, download and include them
        reference_images = []
        if character_image_urls and len(character_image_urls) > 0:
            async with httpx.AsyncClient(timeout=60.0) as http_client:
                for url in character_image_urls[:3]:  # Limit to 3 references
                    try:
                        char_response = await http_client.get(url)
                        if char_response.status_code == 200:
                            # Convert to base64 for Gemini
                            image_data = base64.b64encode(char_response.content).decode('utf-8')
                            reference_images.append({
                                "data": image_data,
                                "mime_type": "image/png"
                            })
                    except Exception as e:
                        print(f"Failed to download reference image: {e}")
                        continue
            
            # Add character reference context to prompt
            if reference_images:
                enhanced_prompt = f"""Use the provided character reference image(s) as visual guides for the characters in this manga panel.

{enhanced_prompt}

Important: Maintain the character designs from the reference images while adapting them to the manga art style."""
        
        # Build contents for Gemini
        contents = []
        
        # Add reference images if available
        for ref_img in reference_images:
            contents.append(
                types.Part.from_bytes(
                    data=base64.b64decode(ref_img["data"]),
                    mime_type=ref_img["mime_type"]
                )
            )
        
        # Add the text prompt
        contents.append(enhanced_prompt)
        
        # Generate image using Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=['Text', 'Image']
            )
        )
        
        # Extract generated image from response
        image_data = None
        if response.candidates and response.candidates[0].content.parts:
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_data = part.inline_data.data
                    break
        
        if not image_data:
            raise Exception("No image generated in Gemini response")
        
        # Save image temporarily
        from app.services.cloudinary.service import upload_image_to_cloudinary
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
            temp_file.write(image_data)
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
        raise Exception(f"Gemini image generation failed: {str(e)}")
