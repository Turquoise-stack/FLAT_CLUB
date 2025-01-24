from pydantic import BaseModel
from typing import Dict, Tuple, List, Optional

class ListingUpdateRequest(BaseModel):
    title: str
    description: str
    price: float
    location: str
    isRental : bool
    status: Optional[str] = "active"

class ListingPreferences(BaseModel):
    language: Optional[List[str]]  # list of languages being spoken in the flat
    nationality: Optional[str] # list of nationalities are in the flat
    smoking: Optional[bool]  # true for smoking, false for non-smoking
    pet_friendly: Optional[bool]  
    party_friendly: Optional[bool]
    preferred_sex_of_the_flat: Optional[List[str]]  # male fmale etc.
    quiet_hours: Optional[Dict[str, str]]  # E.g., ("22:00", "08:00")
    vegan: Optional[bool] # true for vegan, false for not

class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    location: str
    isRental : bool
    status: Optional[str] = "ACTIVE"
    preferences: Optional[ListingPreferences] 

class ListingResponse(BaseModel):
    listing_id: int
    owner_id: int
    title: str
    description: str
    price: float
    location: str
    isRental: bool
    images: Optional[int]
    created: str  # Changed from datetime to str
    updated: Optional[str]  # Changed from datetime to str
    status: Optional[str] = "active"
    preferences: Optional[dict]  # Assuming preferences are JSON

    class Config:
        orm_mode = True  # Allows SQLAlchemy objects to be directly serialized