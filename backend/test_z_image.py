import os
import sys
from gradio_client import Client

# Add app to path
sys.path.append(os.getcwd())

from app.core.config import settings

def test_generation():
    print(f"Testing Z-Image generation with model: {settings.Z_IMAGE_MODEL}")
    
    try:
        client = Client(settings.Z_IMAGE_MODEL)
        print("Client initialized successfully.")
        
        print("Calling predict...")
        result = client.predict(
            prompt="A cute cat",
            height=1024,
            width=1024,
            num_inference_steps=4, # Low steps for speed
            seed=42,
            randomize_seed=True,
            api_name="/generate_image"
        )
        
        print(f"Result type: {type(result)}")
        print(f"Result: {result}")
        
        if isinstance(result, (list, tuple)):
            image_result = result[0]
        else:
            image_result = result
            
        print(f"Image result type: {type(image_result)}")
        
        if isinstance(image_result, dict):
            path = image_result.get("path")
            print(f"Path from dict: {path}")
        else:
            path = image_result
            print(f"Path from string: {path}")
            
        if path and os.path.exists(path):
            print("File exists locally.")
        else:
            print("File does NOT exist locally.")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_generation()
