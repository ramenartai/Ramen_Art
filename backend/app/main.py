from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import connect_db, close_db
from app.routes import test, auth, z_image, story, character, refine_prompt, manga

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
