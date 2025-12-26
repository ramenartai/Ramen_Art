from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from bson import ObjectId

import app.db.mongodb as mongodb
from app.schemas.story import StoryRequest, StoryResponse, StoryListResponse
from app.utils.auth_utils import get_current_user

router = APIRouter(
    prefix="/api/story",
    tags=["Story"]
)

STORY_COLLECTION = "stories"


# ========== Save Story ==========
@router.post("/save", response_model=StoryResponse, status_code=status.HTTP_201_CREATED)
async def save_story(
    payload: StoryRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Save a generated story to MongoDB
    """
    try:
        # Prepare story document
        story_doc = payload.model_dump()
        story_doc["user_id"] = str(current_user["_id"])
        story_doc["created_at"] = datetime.utcnow()
        story_doc["updated_at"] = datetime.utcnow()

        # Insert into MongoDB
        result = await mongodb.db[STORY_COLLECTION].insert_one(story_doc)

        # Return response
        return StoryResponse(
            id=str(result.inserted_id),
            story_metadata=payload.story_metadata,
            message="Story saved successfully",
            created_at=story_doc["created_at"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save story: {str(e)}"
        )


# ========== Get User Stories ==========
@router.get("/list", response_model=list[StoryListResponse])
async def get_user_stories(current_user: dict = Depends(get_current_user)):
    """
    Get all stories belonging to the current user
    """
    try:
        stories = await mongodb.db[STORY_COLLECTION].find(
            {"user_id": str(current_user["_id"])}
        ).sort("created_at", -1).to_list(length=100)

        return [
            StoryListResponse(
                id=str(story["_id"]),
                title=story["story_metadata"]["title"],
                genre=story["story_metadata"]["genre"],
                created_at=story["created_at"]
            )
            for story in stories
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch stories: {str(e)}"
        )


# ========== Get Story by ID ==========
@router.get("/{story_id}")
async def get_story(
    story_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific story by ID
    """
    try:
        story = await mongodb.db[STORY_COLLECTION].find_one({
            "_id": ObjectId(story_id),
            "user_id": str(current_user["_id"])
        })

        if not story:
            raise HTTPException(
                status_code=404,
                detail="Story not found"
            )

        # Convert ObjectId to string
        story["_id"] = str(story["_id"])
        return story

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch story: {str(e)}"
        )


# ========== Delete Story ==========
@router.delete("/{story_id}")
async def delete_story(
    story_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a story by ID
    """
    try:
        result = await mongodb.db[STORY_COLLECTION].delete_one({
            "_id": ObjectId(story_id),
            "user_id": str(current_user["_id"])
        })

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Story not found"
            )

        return {"message": "Story deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete story: {str(e)}"
        )
