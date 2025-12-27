from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from bson import ObjectId

import app.db.mongodb as mongodb
from app.schemas.character import CharacterRequest, CharacterResponse, CharacterListItem
from app.utils.auth_utils import get_current_user

router = APIRouter(
    prefix="/api/character",
    tags=["Character"]
)

CHARACTER_COLLECTION = "characters"


# ========== Save Character ==========
@router.post("/save", response_model=CharacterResponse, status_code=status.HTTP_201_CREATED)
async def save_character(
    payload: CharacterRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Save a generated character to MongoDB
    """
    try:
        # Prepare character document
        character_doc = payload.model_dump()
        character_doc["user_id"] = str(current_user["_id"])
        character_doc["created_at"] = datetime.utcnow()
        character_doc["updated_at"] = datetime.utcnow()

        # Insert into MongoDB
        result = await mongodb.db[CHARACTER_COLLECTION].insert_one(character_doc)

        # Return response
        return CharacterResponse(
            id=str(result.inserted_id),
            story_id=payload.story_id,
            character_name=payload.character_name,
            image_url=payload.image_url,
            prompt=payload.prompt,
            created_at=character_doc["created_at"],
            message="Character saved successfully"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save character: {str(e)}"
        )


# ========== Get All User Characters ==========
@router.get("/list", response_model=list[CharacterListItem])
async def get_user_characters(current_user: dict = Depends(get_current_user)):
    """
    Get all characters belonging to the current user
    """
    try:
        characters = await mongodb.db[CHARACTER_COLLECTION].find(
            {"user_id": str(current_user["_id"])}
        ).sort("created_at", -1).to_list(length=100)

        return [
            CharacterListItem(
                id=str(char["_id"]),
                story_id=char["story_id"],
                character_name=char["character_name"],
                image_url=char["image_url"],
                created_at=char["created_at"]
            )
            for char in characters
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch characters: {str(e)}"
        )


# ========== Get Characters by Story ==========
@router.get("/by-story/{story_id}", response_model=list[CharacterListItem])
async def get_characters_by_story(
    story_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all characters for a specific story
    """
    try:
        characters = await mongodb.db[CHARACTER_COLLECTION].find({
            "user_id": str(current_user["_id"]),
            "story_id": story_id
        }).sort("created_at", -1).to_list(length=100)

        return [
            CharacterListItem(
                id=str(char["_id"]),
                story_id=char["story_id"],
                character_name=char["character_name"],
                image_url=char["image_url"],
                created_at=char["created_at"]
            )
            for char in characters
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch characters: {str(e)}"
        )


# ========== Delete Character ==========
@router.delete("/{character_id}")
async def delete_character(
    character_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a character by ID
    """
    try:
        result = await mongodb.db[CHARACTER_COLLECTION].delete_one({
            "_id": ObjectId(character_id),
            "user_id": str(current_user["_id"])
        })

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Character not found"
            )

        return {"message": "Character deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete character: {str(e)}"
        )


@router.get("/by-story/{story_id}", response_model=list[CharacterListItem])
async def get_characters_by_story(
    story_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all characters for a specific story
    """
    try:
        characters = await mongodb.db[CHARACTER_COLLECTION].find({
            "user_id": str(current_user["_id"]),
            "story_id": story_id
        }).sort("created_at", -1).to_list(length=100)

        return [
            CharacterListItem(
                id=str(char["_id"]),
                story_id=char["story_id"],
                character_name=char["character_name"],
                image_url=char["image_url"],
                created_at=char["created_at"]
            )
            for char in characters
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch characters: {str(e)}"
        )