import os
from gradio_client import Client

def test_generation():
    model = "anithing212/Z-Image-Turbo"
    print(f"Testing Z-Image generation with model: {model}")
    
    try:
        client = Client(model)
        print("Client initialized successfully.")
        
        print("Calling predict...")
        result = client.predict(
            prompt="A cute cat",
            height=1024,
            width=1024,
            num_inference_steps=4,
            seed=42,
            randomize_seed=True,
            api_name="/generate_image"
        )
        
        print(f"Result type: {type(result)}")
        print(f"Result: {result}")
        
        image_result = None
        if isinstance(result, (list, tuple)):
            print(f"Result is a list/tuple of length {len(result)}")
            image_result = result[0]
        else:
            print("Result is not a list/tuple")
            image_result = result
            
        print(f"Image result type: {type(image_result)}")
        print(f"Image result: {image_result}")
        
        path = None
        if isinstance(image_result, dict):
            path = image_result.get("path")
            print(f"Path from dict: {path}")
            if not path:
                 # Sometimes keys are different
                 print(f"Dict keys: {image_result.keys()}")
                 if 'image' in image_result:
                     path = image_result['image']
                     print(f"Found 'image' key: {path}")
        elif isinstance(image_result, str):
            path = image_result
            print(f"Path from string: {path}")
            
        if path and os.path.exists(path):
            print(f"File exists locally at: {path}")
        else:
            print(f"File does NOT exist locally at: {path}")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_generation()
