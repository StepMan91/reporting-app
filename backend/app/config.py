from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # JWT Configuration
    SECRET_KEY: str = "your-super-secret-jwt-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./app_v2.db"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_IMAGE_SIZE: int = 10485760  # 10MB
    MAX_VIDEO_SIZE: int = 52428800  # 50MB
    
    # Admin
    ADMIN_EMAIL: str = "admin@example.com"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"


settings = Settings()
