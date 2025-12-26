# 📚 Ramen Art AI - API Documentation

This document provides comprehensive documentation for all backend APIs, database configuration, and technical implementation details.

---

## 🗄️ Database Configuration

### MongoDB Setup

**Database**: MongoDB with Motor (async driver)  
**Database Name**: `ramen_art_db`

#### Connection Configuration

```python
# File: app/db/mongodb.py
from motor.motor_asyncio import AsyncIOMotorClient

# Connection URI from environment
MONGODB_URI = os.getenv("MONGODB_URI")  # e.g., mongodb://localhost:27017
MONGODB_DB = os.getenv("MONGODB_DB")    # e.g., ramen_art_db

# Async connection
client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]
```

#### Collections

| Collection Name | Description | Key Fields |
|----------------|-------------|------------|
| `users` | User accounts and authentication | `_id`, `email`, `username`, `password_hash`, `provider`, `created_at` |
| `stories` | Generated stories | `_id`, `user_id`, `story_metadata`, `created_at`, `updated_at` |
| `characters` | Generated characters | `_id`, `user_id`, `story_id`, `character_name`, `image_url`, `prompt`, `created_at` |

#### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ramen_art_db
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ramen_art_db
```

---

## 🔐 Authentication APIs

**Base Path**: `/`  
**Tags**: `Auth`

### 1. Register (Email/Password)

**Endpoint**: `POST /register`

**Description**: Create a new user account with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "johndoe",
  "provider": "email",
  "created_at": "2024-01-01T12:00:00Z",
  "message": "User registered successfully"
}
```

**Errors**:
- `400`: Email already registered
- `500`: Registration failed

---

### 2. Login (Email/Password)

**Endpoint**: `POST /login`

**Description**: Authenticate user and receive JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "johndoe",
  "provider": "email",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "message": "Login successful"
}
```

**Notes**:
- Sets HTTP-only cookie with JWT token
- Cookie name: `access_token`

**Errors**:
- `401`: Invalid credentials
- `500`: Login failed

---

### 3. Google OAuth - Register

**Endpoint**: `GET /auth/google/register`

**Description**: Initiate Google OAuth registration flow.

**Response**: Redirects to Google OAuth consent screen

---

### 4. Google OAuth - Register Callback

**Endpoint**: `GET /auth/google/callback/register`

**Description**: Handle Google OAuth callback for registration.

**Query Parameters**:
- `code`: Authorization code from Google

**Response**: Redirects to frontend with success/error

---

### 5. Google OAuth - Login

**Endpoint**: `GET /auth/google/login`

**Description**: Initiate Google OAuth login flow.

**Response**: Redirects to Google OAuth consent screen

---

### 6. Google OAuth - Login Callback

**Endpoint**: `GET /auth/google/callback`

**Description**: Handle Google OAuth callback for login.

**Query Parameters**:
- `code`: Authorization code from Google

**Response**: Redirects to frontend with JWT token

---

### 7. Get Current User

**Endpoint**: `GET /me`

**Description**: Get authenticated user's information.

**Headers**:
```
Cookie: access_token=<jwt_token>
```

**Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "johndoe",
  "provider": "email"
}
```

**Errors**:
- `401`: Unauthorized (invalid/missing token)

---

### 8. Logout

**Endpoint**: `POST /logout`

**Description**: Logout user and clear authentication cookie.

**Headers**:
```
Cookie: access_token=<jwt_token>
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

### 9. Refresh Token

**Endpoint**: `POST /refresh`

**Description**: Refresh JWT access token.

**Headers**:
```
Cookie: access_token=<jwt_token>
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 📖 Story APIs

**Base Path**: `/api/story`  
**Tags**: `Story`  
**Authentication**: Required (JWT)

### 1. Save Story

**Endpoint**: `POST /api/story/save`

**Description**: Save a generated story to the database.

**Request Body**:
```json
{
  "story_metadata": {
    "title": "The Dragon's Quest",
    "genre": "Fantasy",
    "synopsis": "A young hero embarks on a journey...",
    "content": "Full story content here..."
  }
}
```

**Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "story_metadata": {
    "title": "The Dragon's Quest",
    "genre": "Fantasy",
    "synopsis": "A young hero embarks on a journey...",
    "content": "Full story content here..."
  },
  "message": "Story saved successfully",
  "created_at": "2024-01-01T12:00:00Z"
}
```

**Errors**:
- `401`: Unauthorized
- `500`: Failed to save story

---

### 2. Get User Stories

**Endpoint**: `GET /api/story/list`

**Description**: Retrieve all stories belonging to the authenticated user.

**Response** (200 OK):
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "The Dragon's Quest",
    "genre": "Fantasy",
    "created_at": "2024-01-01T12:00:00Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "Space Odyssey",
    "genre": "Sci-Fi",
    "created_at": "2024-01-02T12:00:00Z"
  }
]
```

**Notes**:
- Stories are sorted by creation date (newest first)
- Maximum 100 stories returned

---

### 3. Get Story by ID

**Endpoint**: `GET /api/story/{story_id}`

**Description**: Retrieve a specific story by its ID.

**Path Parameters**:
- `story_id`: MongoDB ObjectId of the story

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user_id": "507f1f77bcf86cd799439010",
  "story_metadata": {
    "title": "The Dragon's Quest",
    "genre": "Fantasy",
    "synopsis": "A young hero embarks on a journey...",
    "content": "Full story content here..."
  },
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

**Errors**:
- `404`: Story not found
- `401`: Unauthorized
- `500`: Failed to fetch story

---

### 4. Delete Story

**Endpoint**: `DELETE /api/story/{story_id}`

**Description**: Delete a story by its ID.

**Path Parameters**:
- `story_id`: MongoDB ObjectId of the story

**Response** (200 OK):
```json
{
  "message": "Story deleted successfully"
}
```

**Errors**:
- `404`: Story not found
- `401`: Unauthorized
- `500`: Failed to delete story

---

## 🎨 Character APIs

**Base Path**: `/api/character`  
**Tags**: `Character`  
**Authentication**: Required (JWT)

### 1. Save Character

**Endpoint**: `POST /api/character/save`

**Description**: Save a generated character to the database.

**Request Body**:
```json
{
  "story_id": "507f1f77bcf86cd799439011",
  "character_name": "Aria Shadowblade",
  "image_url": "https://example.com/character.jpg",
  "prompt": "A mysterious warrior with silver hair and piercing blue eyes"
}
```

**Response** (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439020",
  "story_id": "507f1f77bcf86cd799439011",
  "character_name": "Aria Shadowblade",
  "image_url": "https://example.com/character.jpg",
  "prompt": "A mysterious warrior with silver hair and piercing blue eyes",
  "created_at": "2024-01-01T12:00:00Z",
  "message": "Character saved successfully"
}
```

**Errors**:
- `401`: Unauthorized
- `500`: Failed to save character

---

### 2. Get All User Characters

**Endpoint**: `GET /api/character/list`

**Description**: Retrieve all characters belonging to the authenticated user.

**Response** (200 OK):
```json
[
  {
    "id": "507f1f77bcf86cd799439020",
    "story_id": "507f1f77bcf86cd799439011",
    "character_name": "Aria Shadowblade",
    "image_url": "https://example.com/character.jpg",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

**Notes**:
- Characters are sorted by creation date (newest first)
- Maximum 100 characters returned

---

### 3. Get Characters by Story

**Endpoint**: `GET /api/character/by-story/{story_id}`

**Description**: Retrieve all characters for a specific story.

**Path Parameters**:
- `story_id`: MongoDB ObjectId of the story

**Response** (200 OK):
```json
[
  {
    "id": "507f1f77bcf86cd799439020",
    "story_id": "507f1f77bcf86cd799439011",
    "character_name": "Aria Shadowblade",
    "image_url": "https://example.com/character.jpg",
    "created_at": "2024-01-01T12:00:00Z"
  }
]
```

---

### 4. Delete Character

**Endpoint**: `DELETE /api/character/{character_id}`

**Description**: Delete a character by its ID.

**Path Parameters**:
- `character_id`: MongoDB ObjectId of the character

**Response** (200 OK):
```json
{
  "message": "Character deleted successfully"
}
```

**Errors**:
- `404`: Character not found
- `401`: Unauthorized
- `500`: Failed to delete character

---

## 🖼️ Z-Image Generation API

**Base Path**: `/api/z-image`  
**Tags**: `Z-Image`  
**Authentication**: Not required

### Generate Image

**Endpoint**: `POST /api/z-image/generate`

**Description**: Generate an image using Z-Image-Turbo model from HuggingFace.

**Request Body**:
```json
{
  "prompt": "A mysterious warrior with silver hair and piercing blue eyes, wearing dark armor",
  "resolution": "1024x1024 ( 1:1 )",
  "steps": 8,
  "shift": 3,
  "seed": 42,
  "random_seed": true
}
```

**Request Fields**:
- `prompt` (required): Text description of the image to generate
- `resolution` (optional): Image resolution (default: "1024x1024 ( 1:1 )")
- `steps` (optional): Number of generation steps (default: 8)
- `shift` (optional): Shift parameter (default: 3)
- `seed` (optional): Random seed for reproducibility (default: 42)
- `random_seed` (optional): Use random seed (default: true)

**Response** (200 OK):
```json
{
  "image_url": "https://example.com/generated-image.jpg",
  "prompt": "A mysterious warrior with silver hair and piercing blue eyes, wearing dark armor",
  "resolution": "1024x1024 ( 1:1 )",
  "steps": 8
}
```

**Errors**:
- `400`: Empty prompt
- `500`: Image generation failed

**Notes**:
- Uses HuggingFace Gradio client
- Model: `Tongyi-MAI/Z-Image-Turbo`
- Generation typically takes 10-30 seconds

---

## ✨ AI Prompt Refinement API

**Base Path**: `/api`  
**Tags**: `Refine Prompt`  
**Authentication**: Required (JWT)

### Refine Prompt

**Endpoint**: `POST /api/refine-prompt`

**Description**: Refine a user's prompt using Google Gemini AI for better image/story generation.

**Request Body**:
```json
{
  "prompt": "cat girl, blue hair, glasses, shy"
}
```

**Response** (200 OK):
```json
{
  "refined_prompt": "A timid anime-style cat girl with vibrant azure blue hair cascading past her shoulders, wearing stylish round glasses that frame her gentle, bashful eyes. Her feline ears twitch nervously as she displays a shy, endearing demeanor with a slight blush on her cheeks."
}
```

**Errors**:
- `401`: Unauthorized
- `500`: Gemini API key not configured or refinement failed

**Notes**:
- Uses Google Gemini 2.5 Flash model
- Enhances prompts with vivid descriptions and better structure
- Improves generation quality for both images and stories

---

## 📖 Manga Generation APIs

**Base Path**: `/api/manga`  
**Tags**: `Manga`  
**Authentication**: Required (JWT)

### 1. Suggest Panel Action

**Endpoint**: `POST /api/manga/suggest-action`

**Description**: Suggest what should happen in a manga panel based on story context using Gemini AI.

**Request Body**:
```json
{
  "story_summary": "A hero exploring a dark cave...",
  "panel_number": 1,
  "previous_panels": ["Panel 0 description..."],
  "characters_in_panel": ["Hero Name"]
}
```

**Response** (200 OK):
```json
{
  "suggested_action": "The hero lights a torch, revealing ancient ruins on the cave walls."
}
```

---

### 2. Generate Panel Prompt

**Endpoint**: `POST /api/manga/generate-panel-prompt`

**Description**: Refine a panel action into a detailed prompt optimized for image generation models.

**Request Body**:
```json
{
  "panel_action": "Hero lights a torch in a cave",
  "characters": ["Hero Name"],
  "style_notes": "manga style, high contrast"
}
```

**Response** (200 OK):
```json
{
  "optimized_prompt": "Manga illustration, black and white, close up of a hero striking a match to light a wooden torch... intense shadows, dramatic lighting..."
}
```

---

### 3. Generate Panel Image

**Endpoint**: `POST /api/manga/generate-panel-image`

**Description**: Generate a high-quality manga panel using Stability AI SDXL with optional character references.

**Request Body**:
```json
{
  "prompt": "Manga illustration, hero lighting torch...",
  "character_image_urls": ["https://cloudinary.com/char1.jpg"],
  "width": 768,
  "height": 1024,
  "style": "manga"
}
```

**Response** (200 OK):
```json
{
  "image_url": "https://cloudinary.com/manga-panel-abc.jpg",
  "prompt_used": "Manga illustration, hero lighting torch..."
}
```

**Notes**:
- Uses Stability AI SDXL for generation
- Supports **Character Consistency** via image-to-image mode (passing `character_image_urls`)
- Automatically uploads result to **Cloudinary** for permanent storage
- Returns a safe, permanent CDN URL

---

## 🔧 Utility Endpoints

### Health Check

**Endpoint**: `GET /`

**Description**: Check if the backend is running.

**Response** (200 OK):
```json
{
  "status": "Backend running"
}
```

---

## 🔒 Authentication & Security

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ramen_art_db

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# AI APIs (Gemini & Stability)
GEMINI_API_KEY=your_google_gemini_api_key
STABILITY_API_KEY=your_stability_ai_api_key

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
VITE_BACKEND_URL=http://localhost:8000
```

### Token Structure

```python
{
  "sub": "user_id",
  "email": "user@example.com",
  "exp": 1234567890  # Expiration timestamp
}
```

### Protected Routes

All routes requiring authentication use the `get_current_user` dependency:

```python
from app.utils.auth_utils import get_current_user

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    # current_user contains user data from JWT
    pass
```

### CORS Configuration

```python
allow_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
]
allow_credentials = True
allow_methods = ["*"]
allow_headers = ["*"]
```

---

## 📦 Data Models

### User Model
```python
{
  "_id": ObjectId,
  "email": str,
  "username": str,
  "password_hash": str,  # Only for email/password users
  "provider": str,       # "email" or "google"
  "created_at": datetime,
  "updated_at": datetime
}
```

### Story Model
```python
{
  "_id": ObjectId,
  "user_id": str,
  "story_metadata": {
    "title": str,
    "genre": str,
    "synopsis": str,
    "content": str
  },
  "created_at": datetime,
  "updated_at": datetime
}
```

### Character Model
```python
{
  "_id": ObjectId,
  "user_id": str,
  "story_id": str,
  "character_name": str,
  "image_url": str,
  "prompt": str,
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## 🚀 Running the Backend

### Development Mode
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run with auto-reload
py -m uvicorn app.main:app --reload
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 📊 API Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get current user (with cookie)
curl -X GET http://localhost:8000/me \
  -b cookies.txt
```

### Interactive Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🐛 Error Handling

All endpoints follow consistent error response format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

---

## 📝 Notes

- All timestamps are in UTC
- MongoDB ObjectIds are converted to strings in responses
- File uploads use base64 encoding or direct URLs
- Rate limiting is not currently implemented
- All user data is isolated by `user_id`

---

**Last Updated**: December 26, 2024
