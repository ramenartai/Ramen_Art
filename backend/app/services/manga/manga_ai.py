from google import genai
from app.core.config import settings
from typing import List, Optional

# Configure Gemini API from settings
if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)


async def suggest_panel_action(
    story_summary: str,
    panel_number: int,
    previous_panels: Optional[List[str]] = None,
    characters_in_panel: Optional[List[str]] = None
) -> str:
    """
    Use Gemini to suggest what should happen in a specific manga panel
    based on the story context and previous panels.
    """
    if not settings.GEMINI_API_KEY:
        raise ValueError("Gemini API key not configured")
    
    # Build context
    context_parts = [f"Story: {story_summary}"]
    
    if previous_panels:
        context_parts.append("\nPrevious panels:")
        for i, panel_desc in enumerate(previous_panels, 1):
            context_parts.append(f"Panel {i}: {panel_desc}")
    
    if characters_in_panel:
        context_parts.append(f"\nCharacters in this panel: {', '.join(characters_in_panel)}")
    
    context = "\n".join(context_parts)
    
    # System instruction for panel suggestion
    system_instruction = """You are a manga storyboard artist. Given a story and context, suggest what should happen in the next panel.

Your suggestion should be:
- A single, clear visual scene description
- Focused on ACTION and EMOTION (what the character is doing, their expression)
- Cinematically described (camera angle, framing like "close-up", "wide shot", etc.)
- Concise (1-2 sentences max)

Example: "Close-up of Hero's eyes widening in shock as he realizes the truth"
Example: "Wide shot of the villain laughing maniacally on the rooftop, lightning crackling in the background"

Provide ONLY the panel description, nothing else."""
    
    # Generate suggestion
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=f"{system_instruction}\n\n{context}\n\nSuggest what happens in Panel {panel_number}:"
    )
    
    return response.text.strip()


async def generate_panel_prompt(
    panel_action: str,
    characters: Optional[List[str]] = None,
    style_notes: Optional[str] = None
) -> str:
    """
    Convert a panel action description into an optimized prompt for image generation.
    This refines the user's input into something that works better with image models.
    """
    if not settings.GEMINI_API_KEY:
        raise ValueError("Gemini API key not configured")
    
    # Build context
    context_parts = [f"Panel action: {panel_action}"]
    
    if characters:
        context_parts.append(f"Characters: {', '.join(characters)}")
    
    if style_notes:
        context_parts.append(f"Style: {style_notes}")
    
    context = "\n".join(context_parts)
    
    # System instruction for prompt optimization
    system_instruction = """You are an expert at writing prompts for manga/anime image generation.

Convert the panel description into a detailed image generation prompt that includes:
- The main action/scene
- Character positions and expressions
- Camera angle and framing
- Mood and atmosphere
- Manga/anime art style keywords

Keep it under 100 words. Focus on visual elements only.

Example input: "Hero punches villain"
Example output: "Dynamic action shot, muscular hero in fighting stance throwing powerful punch at villain, motion lines, intense expression, dramatic lighting, black and white manga art style, high contrast, speed lines"

Provide ONLY the optimized prompt, nothing else."""
    
    # Generate optimized prompt
    response = client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=f"{system_instruction}\n\n{context}\n\nOptimized prompt:"
    )
    
    return response.text.strip()
