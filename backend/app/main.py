from fastapi import FastAPI
from controller.client_controller import router as client_router
from controller.system_controller import router as system_router
from controller.listing_controller import router as listing_router
from controller.message_controller import router as message_router

app = FastAPI()

# routers
app.include_router(client_router, prefix="/api", tags=["client"])
app.include_router(system_router, prefix="/api", tags=["system"])
app.include_router(listing_router, prefix="/api", tags=["listing"])
app.include_router(message_router, prefix="/api", tags=["message"])
