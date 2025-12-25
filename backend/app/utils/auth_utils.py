from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import bcrypt
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from app.core.config import settings
import app.db.mongodb as mongodb
from app.models.user import USER_COLLECTION
from fastapi import Request
security = HTTPBearer()

# ==================== JWT HELPERS ====================

def create_jwt(user_id: str, email: str, remember: bool = False) -> str:
    expire = datetime.utcnow() + timedelta(
        minutes=settings.JWT_EXPIRE_MINUTES * (24 if remember else 1)
    )
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def verify_jwt(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated: No token found",
        )
    payload = verify_jwt(token)
    user_id_str = payload.get("sub")
    
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing subject",
        )

    try:
        user = await mongodb.db[USER_COLLECTION].find_one(
            {"_id": ObjectId(user_id_str)}
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID format",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


# ==================== LOGIN HELPERS ======================
# Create a helper for cookie settings to keep it clean
def set_auth_cookie(response: Response, token: str, max_age: int = 604800):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        # Set to True only if not on localhost
        secure=settings.ENVIRONMENT == "production", 
        samesite="lax",
        max_age=max_age,
        path="/"
    )


# ==================== PASSWORD HELPERS ====================
def hash_password(password: str) -> str:
    """Hash password with bcrypt, truncating to 72 bytes."""
    password_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash, truncating to 72 bytes."""
    password_bytes = plain_password.encode("utf-8")[:72]
    return bcrypt.checkpw(password_bytes, hashed_password.encode("utf-8"))
