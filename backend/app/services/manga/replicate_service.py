import replicate
from app.core.config import settings
from typing import Optional, List
import base64
import httpx


async def generate_manga_panel(
    prompt: str,
    character_image_urls: Optional[List[str]] = None,
    aspect_ratio: str = "3:4",
    style: str = "manga"
) -> str:
    """
    Generate a manga panel image using Replicate's SDXL model.
    
    Args:
        prompt: The text description of what to generate
        character_image_urls: Optional list of character reference images for IP-Adapter
        aspect_ratio: Image aspect ratio (default: 3:4 for manga panels)
        style: Art style preset (default: manga)
    
    Returns:
        URL of the generated image
    
    How Replicate Works:
    ---------------------
    1. You send a request to a specific AI model (like SDXL)
    2. Replicate runs the model on their GPUs (you don't need powerful hardware!)
    3. They return the generated image URL
    4. You pay per generation (very cheap, ~$0.01 per image)
    
    Why Replicate?
    --------------
    - No need for expensive GPUs
    - Access to latest models (SDXL, ControlNet, IP-Adapter)
    - Pay-as-you-go pricing
    - Fast generation (~10-30 seconds)
    """
    if not settings.REPLICATE_API_TOKEN:
        raise ValueError("Replicate API token not configured")
    
    # Set the API token
    replicate_client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)
    
    # Build the input parameters
    input_params = {
        "prompt": prompt,
        "aspect_ratio": aspect_ratio,
        "output_format": "png",
        "output_quality": 90,
        "num_inference_steps": 30,  # More steps = better quality but slower
        "guidance_scale": 7.5,  # How closely to follow the prompt
    }
    
    # Add style-specific parameters
    if style == "manga":
        # Enhance prompt with manga-specific keywords
        enhanced_prompt = f"{prompt}, manga art style, black and white, high contrast, clean lines, professional manga illustration"
        input_params["prompt"] = enhanced_prompt
        input_params["negative_prompt"] = "color, photograph, realistic, 3d render, blurry, low quality"
    
    # If character references are provided, use IP-Adapter model
    # IP-Adapter allows the model to "see" reference images and maintain character consistency
    if character_image_urls and len(character_image_urls) > 0:
        # Use SDXL with IP-Adapter for character consistency
        model = "lucataco/sdxl-ip-adapter:9d03b1f3b9c8f0e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8"
        input_params["image"] = character_image_urls[0]  # Primary character reference
        input_params["ip_adapter_scale"] = 0.6  # How much to use the reference (0-1)
    else:
        # Use standard SDXL for general generation
        model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
    
    try:
        # Run the model
        output = replicate_client.run(
            model,
            input=input_params
        )
        
        # Output is usually a list of URLs or a single URL
        if isinstance(output, list):
            return output[0]
        else:
            return str(output)
            
    except Exception as e:
        raise Exception(f"Replicate generation failed: {str(e)}")


async def generate_manga_panel_with_controlnet(
    prompt: str,
    panel_layout_image: str,
    character_image_urls: Optional[List[str]] = None
) -> str:
    """
    Generate a manga panel that follows a specific layout using ControlNet.
    
    ControlNet is like giving the AI a "sketch" to follow.
    It ensures the generated image matches the panel boundaries.
    
    Args:
        prompt: What to generate
        panel_layout_image: URL or base64 of the panel layout (the rectangles)
        character_image_urls: Character references for consistency
    
    Returns:
        URL of the generated image
    """
    if not settings.REPLICATE_API_TOKEN:
        raise ValueError("Replicate API token not configured")
    
    replicate_client = replicate.Client(api_token=settings.REPLICATE_API_TOKEN)
    
    # Use SDXL with ControlNet for layout control
    model = "lucataco/sdxl-controlnet:4ff8f9ca91d0e0a63e6f8a7e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e"
    
    input_params = {
        "prompt": f"{prompt}, manga art style, black and white, professional illustration",
        "image": panel_layout_image,  # The layout to follow
        "controlnet_conditioning_scale": 0.8,  # How strictly to follow the layout
        "num_inference_steps": 30,
        "guidance_scale": 7.5,
        "negative_prompt": "color, blurry, low quality, deformed"
    }
    
    try:
        output = replicate_client.run(model, input=input_params)
        
        if isinstance(output, list):
            return output[0]
        else:
            return str(output)
            
    except Exception as e:
        raise Exception(f"ControlNet generation failed: {str(e)}")
