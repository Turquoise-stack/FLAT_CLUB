from pydantic import BaseModel, Field, EmailStr

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr = Field(None, description="Email for requesting the password reset")
    token: str = Field(None, description="JWT token for verifying reset")
    new_password: str = Field(None, description="New password for resetting")
