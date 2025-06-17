from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from fastapi.responses import FileResponse
from controller.client_controller import router as client_router
from controller.system_controller import router as system_router
from controller.listing_controller import router as listing_router
from controller.message_controller import router as message_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://flatclub-production.up.railway.app",
    "http://localhost:5173"  # for dev
    ],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# Routers
app.include_router(client_router, prefix="/api", tags=["client"])
app.include_router(system_router, prefix="/api", tags=["system"])
app.include_router(listing_router, prefix="/api", tags=["listing"])
app.include_router(message_router, prefix="/api", tags=["message"])

# Serve static files
if not os.path.exists("uploads"):
    os.makedirs("uploads")

uploads_path = os.path.join(os.path.dirname(__file__), "uploads")
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")


app.mount("/", StaticFiles(directory="static", html=True), name="static")

# Fallback to React app for any non-API route
@app.get("/{full_path:path}")
async def frontend_fallback(full_path: str):
    return FileResponse("my-project/dist/index.html")