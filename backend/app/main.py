from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import connect_db, close_db
from app.routes import test, auth, z_image, story, character, refine_prompt, manga
from app.core.config import settings
import weave

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await connect_db()
    
    # Initialize Weave for tracking Gemini API calls
    if settings.WANDB_API_KEY:
        project_name = f"{settings.WANDB_ENTITY}/{settings.WANDB_PROJECT_NAME}" if settings.WANDB_ENTITY else settings.WANDB_PROJECT_NAME
        weave.init(project_name)
        print(f"✅ Weave initialized for project: {project_name}")
    else:
        print("⚠️  WANDB_API_KEY not set. Weave tracking disabled.")

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
