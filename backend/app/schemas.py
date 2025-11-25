from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional


# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    id: Optional[int] = None
    email: str
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Report Schemas
class ReportCreate(BaseModel):
    description: str = Field(..., max_length=1000)
    behavior_rating: int = Field(..., ge=1, le=5)
    severity_index: int = Field(..., ge=0, le=100)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    @validator('description')
    def validate_word_count(cls, v):
        word_count = len(v.split())
        if word_count > 150:
            raise ValueError('Description must not exceed 150 words')
        return v


class ReportResponse(BaseModel):
    id: int
    user_id: int
    media_type: str
    media_path: str
    description: str
    behavior_rating: int
    severity_index: int
    latitude: Optional[float]
    longitude: Optional[float]
    device_info: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Contact Schema
class ContactMessage(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=1000)
