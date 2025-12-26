from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ========== Request/Response Schemas ==========

class CharacterRequest(BaseModel):
    """Request schema for saving a character"""
    story_id: str = Field(..., description="Associated story ID")
    character_name: str = Field(..., description="Character name")
    image_url: str = Field(..., description="Generated character image URL")
    prompt: str = Field(..., description="Prompt used to generate the character")


class CharacterResponse(BaseModel):
    """Response schema after saving a character"""
    id: str = Field(..., description="MongoDB ObjectId as string")
    story_id: str
    character_name: str
    image_url: str
    prompt: str
    created_at: datetime
    message: str = "Character saved successfully"


class CharacterListItem(BaseModel):
    """Response schema for listing characters"""
    id: str
    story_id: str
    character_name: str
    image_url: str
    created_at: datetime
