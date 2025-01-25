from pydantic import BaseModel, Field, EmailStr
from typing import Dict, List, Optional, Tuple

class LoginRequest(BaseModel):
    email: str
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr = Field(None, description="Email for requesting the password reset")
    token: str = Field(None, description="JWT token for verifying reset")
    new_password: str = Field(None, description="New password for resetting")

class PetsInfo(BaseModel):
    has_pets: Optional[bool]  # true if the user has pets
    species: Optional[List[str]]  # List of species ["Iguana", "Siberian Tiger"]

class UserPreferences(BaseModel):
    language: List[str]  # list of languages
    nationality: Optional[str] 
    smoking: Optional[bool]  # true for smoking, false for non-smoking
    pet_friendly: Optional[bool]  # true if user prefers pets, false not
    party_friendly: Optional[bool] # true if user is okay for partying indoor, false fo r not
    outgoing: Optional[bool] # true if user is socially active, false for not
    preferred_sex_to_live_with: Optional[List[str]]  # male fmale etc.
    religion: Optional[str]
    vegan: Optional[bool] # true for vegan, false for not
    quiet_hours: Optional[Dict[str, str]] = None  # ("22:00", "08:00")


class RegisterRequest(BaseModel):
    name: Optional[str] = None 
    surname: Optional[str] = None  
    username: str  
    email: Optional[EmailStr] = None  
    phone_number: Optional[str] = None  
    password: str  
    role: Optional[str] = "user"  
    bio: Optional[str] = None  
    preferences: Optional[UserPreferences] = None  
    pets: Optional[PetsInfo] = None

class UserProfileResponse(BaseModel):
    user_id: int
    name: Optional[str]
    surname: Optional[str]
    username: str
    email: Optional[EmailStr]
    phone_number: Optional[str]
    role: str
    bio: Optional[str]
    preferences: Optional[UserPreferences]
    pets: Optional[PetsInfo] = None
    created_at: str

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str]
    surname: Optional[str]
    phone_number: Optional[str]
    bio: Optional[str]
    preferences: Optional[UserPreferences]
    pets: Optional[PetsInfo] = None 

class UserSummary(BaseModel):
    user_id: int
    name: Optional[str]
    surname: Optional[str]
    username: str
    email: Optional[EmailStr]
    role: str

class UserListResponse(BaseModel):
    total: int
    users: List[UserSummary]
