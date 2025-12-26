import httpx
from typing import Optional, List
import urllib.parse


async def generate_manga_panel_free(
    prompt: str,
    width: int = 768,
    height: int = 1024,
    style: str = "manga"
) -> str:
    """
    Generate a manga panel image using Pollinations.ai and upload to Cloudinary.
    
    Args:
        prompt: The text description of what to generate
        width: Image width (default: 768)
        height: Image height (default: 1024 for manga panels)
        style: Art style preset (default: manga)
    
    Returns:
        Cloudinary URL of the uploaded image (permanent and safe)
    
    How it works:
    1. Generate image using Pollinations.ai (FREE)
    2. Download the generated image
    3. Upload to Cloudinary (your permanent storage)
    4. Return Cloudinary URL (safe, permanent, fast CDN)
    
    Why upload to Cloudinary?
    -------------------------
    - Pollinations URLs work but are external
    - Cloudinary gives you control and permanence
    - Your images, your storage
    - Fast CDN delivery
    - Image transformations available
    """
    
    # Add style-specific enhancements
    if style == "manga":
        enhanced_prompt = f"{prompt}, manga art style, black and white, high contrast, clean lines, professional manga illustration, monochrome"
        negative = "color, photograph, realistic, 3d render, blurry, low quality"
    else:
        enhanced_prompt = prompt
        negative = "blurry, low quality"
    
    # URL encode the prompt
    encoded_prompt = urllib.parse.quote(enhanced_prompt)
    encoded_negative = urllib.parse.quote(negative)
    
    # Construct the Pollinations.ai URL
    pollinations_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={width}&height={height}&nologo=true&enhance=true&negative={encoded_negative}"
    
    try:
        # Download the image from Pollinations
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(pollinations_url)
            
            if response.status_code != 200:
                raise Exception(f"Failed to generate image from Pollinations: HTTP {response.status_code}")
            
            # Save temporarily
            import tempfile
            import os
            from app.services.cloudinary.service import upload_image_to_cloudinary
            
            # Create temp file
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
                # Clean up temp file
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                    
    except Exception as e:
        raise Exception(f"Failed to generate and upload manga panel: {str(e)}")


async def generate_manga_panel_huggingface(
    prompt: str,
    hf_token: Optional[str] = None,
    width: int = 768,
    height: int = 1024
) -> str:
    """
    Alternative: Generate using Hugging Face Inference API (Free tier available)
    
    Requires: HF_TOKEN in .env (free to get from huggingface.co)
    
    Free tier limits:
    - 1000 requests/day
    - Rate limited
    - Good quality (SDXL models)
    """
    if not hf_token:
        raise ValueError("Hugging Face token required. Get free token from huggingface.co")
    
    API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    # Enhance prompt for manga style
    enhanced_prompt = f"{prompt}, manga art style, black and white, high contrast, professional illustration"
    
    payload = {
        "inputs": enhanced_prompt,
        "parameters": {
            "width": width,
            "height": height,
            "num_inference_steps": 30,
            "guidance_scale": 7.5,
            "negative_prompt": "color, blurry, low quality, photograph"
        }
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(API_URL, headers=headers, json=payload)
            
            if response.status_code == 200:
                # HF returns the image bytes directly
                # We need to upload it somewhere or return base64
                import base64
                image_base64 = base64.b64encode(response.content).decode()
                return f"data:image/png;base64,{image_base64}"
            else:
                raise Exception(f"HuggingFace API error: {response.status_code} - {response.text}")
                
    except Exception as e:
        raise Exception(f"HuggingFace generation failed: {str(e)}")
