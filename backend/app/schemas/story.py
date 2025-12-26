from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# ========== Nested Schemas ==========

class PowerSystem(BaseModel):
    name: str
    description: str
    limitations: List[str] = []


class WorldBuilding(BaseModel):
    setting: str
    time_period: str
    rules_of_world: List[str] = []
    power_system: Optional[PowerSystem] = None


class StoryMetadata(BaseModel):
    title: str
    genre: List[str] = []
    tone: str
    target_audience: str
    themes: List[str] = []


class Character(BaseModel):
    id: str
    name: str
    role: str
    personality_traits: List[str] = []
    backstory: str
    goals: str
    fears: str
    character_arc: str


class Scene(BaseModel):
    scene_id: str
    setting: str
    characters_involved: List[str] = []
    scene_summary: str
    emotional_beat: str
    cliffhanger: bool = False


class Chapter(BaseModel):
    chapter_id: str
    chapter_title: str
    chapter_purpose: str
    scenes: List[Scene] = []


class StoryArc(BaseModel):
    arc_id: str
    arc_title: str
    arc_summary: str
    chapters: List[Chapter] = []


class EndingDirection(BaseModel):
    type: str
    foreshadowing_elements: List[str] = []


# ========== Main Request/Response Schemas ==========

class StoryRequest(BaseModel):
    """Request schema for saving a story"""
    story_metadata: StoryMetadata
    world_building: WorldBuilding
    main_characters: List[Character]
    story_arcs: List[StoryArc]
    ending_direction: EndingDirection
    user_id: Optional[str] = None  # Optional: associate story with user


class StoryResponse(BaseModel):
    """Response schema after saving a story"""
    id: str = Field(..., description="MongoDB ObjectId as string")
    story_metadata: StoryMetadata
    message: str = "Story saved successfully"
    created_at: datetime


class StoryListResponse(BaseModel):
    """Response schema for listing stories"""
    id: str
    title: str
    genre: List[str]
    created_at: datetime
