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
    status: Optional[str] = "active"
    preferences: Optional[ListingPreferences] 

class ListingResponse(BaseModel):
    listing_id: int
    owner_id: int
    title: str
    description: str
    price: float
    location: str
    isRental: bool
    images: Optional[List[str]]  
    created: str 
    updated: Optional[str]  
    status: Optional[str] = "active"
    preferences: Optional[dict] 

    class Config:
        from_attributes = True

class GroupMemberResponse(BaseModel):
    user_id: int
    name: Optional[str]
    surname: Optional[str]
    username: str
    status: str 

    class Config:
        from_attributes = True

class GroupCreate(BaseModel):
    name: str
    description: Optional[str]
    listing_id: int

class RentDivision(BaseModel):
    member_id: int
    percentage: float

class QuietHours(BaseModel):
    start: str  # Time in HH:MM format
    end: str    # Time in HH:MM format

class LifestylePreference(BaseModel):
    rent_division: Optional[Dict[int, float]]  # Keyed by user_id
    quiet_hours: Optional[QuietHours]
    ready_to_sign: Optional[List[int]] = []  # List of member IDs ready to sign

class UpdateGroupPreferenceRequest(BaseModel):
    lifestyle_preference: LifestylePreference

class GroupResponse(BaseModel):
    group_id: int
    name: str
    description: Optional[str]
    listing_id: int
    owner_id: int
    members: List[GroupMemberResponse]
    lifestyle_preference: Optional[LifestylePreference]

    class Config:
        from_attributes = True
