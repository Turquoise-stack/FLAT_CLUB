from fastapi import FastAPI
from client_controller import router as client_router

app = FastAPI()

app.include_router(client_router, prefix="/api")
