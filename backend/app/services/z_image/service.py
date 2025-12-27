import os
from app.services.z_image.client import get_z_image_client
from app.services.z_image.constants import (
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    DEFAULT_NUM_INFERENCE_STEPS,
    DEFAULT_SEED,
    Z_IMAGE_MODEL,
)
from app.services.cloudinary.service import upload_image_to_cloudinary


async def generate_image_service(
    prompt: str,
    resolution: str | None,
    steps: int | None,
    shift: int | None,
    seed: int | None,
    remove_background: bool = False,
) -> dict:
    """
    Generate image using Z-Image model and upload to Cloudinary.
    
    Args:
        prompt: Image generation prompt
        resolution: Image resolution (will be parsed to height/width)
        steps: Generation steps (maps to num_inference_steps)
        shift: Shift parameter (not used in new API)
        seed: Random seed
        remove_background: If True, removes background using Cloudinary AI
        
    Returns:
        Dict with image_url, model, seed_used, and seed
    """
    try:
        # Parse resolution to height and width
        # Format: "1024x1024 ( 1:1 )" -> height=1024, width=1024
        height = DEFAULT_HEIGHT
        width = DEFAULT_WIDTH
        
        if resolution:
            try:
                # Extract "1024x1024" from "1024x1024 ( 1:1 )"
                size_part = resolution.split('(')[0].strip()
                width_str, height_str = size_part.split('x')
                width = int(width_str.strip())
                height = int(height_str.strip())
            except:
                # If parsing fails, use defaults
                pass
        
        # 1. Call Z-Image API with new parameters
        client = get_z_image_client()

        result = client.predict(
            prompt=prompt,
            height=height,
            width=width,
            num_inference_steps=steps or DEFAULT_NUM_INFERENCE_STEPS,
            seed=seed or DEFAULT_SEED,
            randomize_seed=True,
            api_name="/generate_image"
        )

        # 2. Extract image path and seed from response
        # Response is a tuple: (image_dict, seed_used)
        if not result or len(result) < 2:
            raise Exception("Unexpected response format from Z-Image")

        image_dict = result[0]
        seed_used = result[1]
        
        # Get the local image path
        if not image_dict or 'path' not in image_dict:
            raise Exception("No image path in Z-Image response")
            
        local_image_path = image_dict['path']

        if not os.path.exists(local_image_path):
            raise Exception(f"Generated image not found at {local_image_path}")

        # 3. Upload to Cloudinary (with optional background removal)
        cloudinary_url = upload_image_to_cloudinary(
            image_path=local_image_path,
            folder="ramen-art-generations",
            remove_background=remove_background
        )

        # 4. Clean up local file (optional)
        try:
            os.remove(local_image_path)
        except:
            pass  # Ignore cleanup errors

        # 5. Return response
        return {
            "image_url": cloudinary_url,
            "model": Z_IMAGE_MODEL,
            "seed_used": str(seed_used),
            "seed": int(seed_used),
        }

    except Exception as e:
        # Single exit point for all failures
        raise Exception(f"Image generation failed: {str(e)}")