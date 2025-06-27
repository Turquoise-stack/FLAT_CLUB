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
    language: Optional[List[str]] 
    nationality: Optional[str] 
    smoking: Optional[bool] 
    pet_friendly: Optional[bool]  
    party_friendly: Optional[bool]
    preferred_sex_of_the_flat: Optional[List[str]]  
    quiet_hours: Optional[Dict[str, str]] 
    vegan: Optional[bool] 

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
    # Time format hh:mm
    start: str  
    end: str    

class LifestylePreference(BaseModel):
    rent_division: Optional[Dict[int, float]]  
    quiet_hours: Optional[QuietHours]
    ready_to_sign: Optional[List[int]] = []

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
