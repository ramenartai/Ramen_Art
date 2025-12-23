from fastapi import APIRouter, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
import httpx

from app.db.mongodb import db
from app.schemas.user import UserOut
from app.models.user import USER_COLLECTION, user_dict
from app.core.config import settings

from google.oauth2 import id_token
from google.auth.transport import requests as grequests

router = APIRouter(prefix="/api/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Schemas

class RegisterRequest(BaseModel):
    email: EmailStr
    user_name: str
    password: str
    name: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    rememberMe: bool = False


# Helpers

def create_jwt(user_id: str, email: str, remember: bool = False):
    expire = datetime.utcnow() + timedelta(
        minutes=settings.JWT_EXPIRE_MINUTES * (24 if remember else 1)
    )
    payload = {"sub": user_id, "email": email, "exp": expire}
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


# Email / Password Auth

@router.post("/register", status_code=201)
async def register(data: RegisterRequest):
    existing = await db[USER_COLLECTION].find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = pwd_context.hash(data.password)

    user = {
        "email": data.email,
        "name": data.name,
        "password": hashed_pw,
        "created_at": datetime.utcnow(),
    }

    result = await db[USER_COLLECTION].insert_one(user)
    user["_id"] = result.inserted_id

    return UserOut(
        email=user["email"],
        name=user["name"],
        picture=None,
    )


@router.post("/login")
async def login(data: LoginRequest):
    user = await db[USER_COLLECTION].find_one({"email": data.email})
    if not user or "password" not in user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_jwt(str(user["_id"]), user["email"], data.rememberMe)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(
            email=user["email"],
            name=user.get("name"),
            picture=user.get("picture"),
        ),
    }


# Google OAuth


@router.get("/login/google")
def google_login():
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=openid email profile"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return RedirectResponse(auth_url)


@router.get("/google/callback")
async def google_callback(code: str | None = None):
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Token exchange failed")

    token_data = resp.json()
    id_tok = token_data.get("id_token")

    id_info = id_token.verify_oauth2_token(
        id_tok,
        grequests.Request(),
        settings.GOOGLE_CLIENT_ID,
    )

    google_id = id_info["sub"]
    email = id_info["email"]
    name = id_info.get("name")
    picture = id_info.get("picture")

    user = await db[USER_COLLECTION].find_one(
        {"$or": [{"google_id": google_id}, {"email": email}]}
    )

    if not user:
        user = user_dict(
            email=email,
            name=name,
            google_id=google_id,
            picture=picture,
        )
        result = await db[USER_COLLECTION].insert_one(user)
        user["_id"] = result.inserted_id

    token = create_jwt(str(user["_id"]), user["email"])

    return JSONResponse(
        {
            "access_token": token,
            "token_type": "bearer",
            "user": UserOut(
                email=user["email"],
                name=user.get("name"),
                picture=user.get("picture"),
            ),
        }
    )
