from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import connect_db, close_db
from app.routes import test, auth, z_image, story, character, refine_prompt, manga
import weave
import os
from app.core.config import settings

# Initialize Weave globally to ensure it captures all traces
if settings.WANDB_API_KEY:
    os.environ["WANDB_API_KEY"] = settings.WANDB_API_KEY
    print(f"Initializing Weave with project: ramen-art-backend")
    # Disable implicit patching to avoid conflicts with manual decorators
    weave.init("ramen-art-backend")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

# Routes
app.include_router(test.router, prefix="/api")
app.include_router(auth.router)
app.include_router(z_image.router)
app.include_router(story.router)
app.include_router(character.router)
app.include_router(refine_prompt.router, prefix="/api")
app.include_router(manga.router)

@app.get("/")
def root():
    return {"status": "Backend running"}
