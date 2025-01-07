from pydantic import BaseModel
from typing import Optional

class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    location: str
    isRental : bool
    status: Optional[str] = "active"

class ListingResponse(BaseModel):
    listing_id: int
    owner_id : int
    title: str
    description: str
    price: float
    location: str
    isRental : bool
    images: Optional[int]
    created: str
    updated: Optional[str]
    status: Optional[str] = "active"

class ListingUpdateRequest(BaseModel):
    title: str
    description: str
    price: float
    location: str
    isRental : bool
    status: Optional[str] = "active"