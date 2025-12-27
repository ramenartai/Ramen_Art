from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from google import genai
from app.core.config import settings
from app.utils.auth_utils import get_current_user

router = APIRouter(tags=["Refine Prompt"])

# Configure Gemini API from settings
if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

class RefinePromptRequest(BaseModel):
    prompt: str

class RefinePromptResponse(BaseModel):
    refined_prompt: str

@router.post("/refine-prompt", response_model=RefinePromptResponse)
async def refine_prompt(request: RefinePromptRequest, current_user: dict = Depends(get_current_user)):
    """
    Refine a user's prompt using Gemini AI
    """
    try:
        if not settings.GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        # System prompt for refinement
        system_instruction = """You are an expert prompt engineer. Refine the following prompt to be more detailed, descriptive, and effective for AI image/story generation. 

Keep the core idea but enhance it with:
- More vivid descriptions
- Better structure and clarity
- Specific details that will improve generation quality
- Artistic/narrative elements as appropriate

Provide only the refined prompt, nothing else."""
        
        # Generate refined prompt using new API
        response = client.models.generate_content(
            model='models/gemini-3-flash-preview',
            contents=f"{system_instruction}\n\nOriginal prompt: {request.prompt}"
        )
        
        refined_prompt = response.text.strip()
        
        return RefinePromptResponse(refined_prompt=refined_prompt)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refine prompt: {str(e)}")
