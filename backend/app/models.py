from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship
    reports = relationship("Report", back_populates="user", cascade="all, delete-orphan")


class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Media files
    media_type = Column(String, nullable=False)  # 'image' or 'video'
    media_path = Column(String, nullable=False)
    
    # Report content
    description = Column(Text, nullable=False)  # Max 150 words
    behavior_rating = Column(Integer, nullable=False)  # 1-5 stars
    severity_index = Column(Integer, nullable=False)  # 0-100
    
    # Metadata
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    device_info = Column(String, nullable=True)
    camera_used = Column(String, nullable=True)  # 'front', 'environment', or 'upload'
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship
    user = relationship("User", back_populates="reports")
