from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    name: str
    surname: str
    role: Optional[str] = None
    preferences: Optional[dict] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr = Field(None, description="Email for requesting the password reset")
    token: str = Field(None, description="JWT token for verifying reset")
    new_password: str = Field(None, description="New password for resetting")
