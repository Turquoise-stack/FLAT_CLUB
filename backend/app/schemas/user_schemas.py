from pydantic import BaseModel, Field, EmailStr
from typing import Dict, List, Optional, Tuple

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

class LoginRequest(BaseModel):
    email: str
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr = Field(None, description="Email for requesting the password reset")
    token: str = Field(None, description="JWT token for verifying reset")
    new_password: str = Field(None, description="New password for resetting")

class PetsInfo(BaseModel):
    has_pets: Optional[bool] 
    species: Optional[List[str]] 

class UserPreferences(BaseModel):
    language: List[str] 
    nationality: Optional[str] 
    smoking: Optional[bool] 
    pet_friendly: Optional[bool]  
    party_friendly: Optional[bool] 
    outgoing: Optional[bool] 
    preferred_sex_to_live_with: Optional[List[str]] 
    religion: Optional[str]
    vegan: Optional[bool] 
    quiet_hours: Optional[Dict[str, str]] = None


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
