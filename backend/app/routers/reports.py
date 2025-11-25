from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from pathlib import Path
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user
from ..config import settings

router = APIRouter(prefix="/reports", tags=["reports"])


def save_upload_file(upload_file: UploadFile, upload_dir: str) -> str:
    """
    Save uploaded file and return the file path
    """
    # Create upload directory if it doesn't exist
    Path(upload_dir).mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = upload_file.file.read()
        buffer.write(content)
    
    return file_path


@router.post("/", response_model=schemas.ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    request: Request,
    media: UploadFile = File(...),
    description: str = Form(...),
    behavior_rating: int = Form(..., ge=1, le=5),
    severity_index: int = Form(..., ge=0, le=100),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    camera_used: Optional[str] = Form(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new report with media upload
    """
    # Validate word count
    word_count = len(description.split())
    if word_count > 150:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description must not exceed 150 words"
        )
    
    # Determine media type and validate size
    media_type = "image" if media.content_type.startswith("image/") else "video"
    file_size = 0
    
    # Read file to check size
    content = await media.read()
    file_size = len(content)
    await media.seek(0)  # Reset file pointer
    
    if media_type == "image" and file_size > settings.MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image size must not exceed {settings.MAX_IMAGE_SIZE / 1024 / 1024}MB"
        )
    elif media_type == "video" and file_size > settings.MAX_VIDEO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Video size must not exceed {settings.MAX_VIDEO_SIZE / 1024 / 1024}MB"
        )
    
    # Save media file
    media_path = save_upload_file(media, settings.UPLOAD_DIR)
    
    # Get device info from User-Agent
    device_info = request.headers.get("user-agent", "Unknown")
    
    # Create report
    db_report = models.Report(
        user_id=current_user.id,
        media_type=media_type,
        media_path=media_path,
        description=description,
        behavior_rating=behavior_rating,
        severity_index=severity_index,
        latitude=latitude,
        longitude=longitude,
        device_info=device_info,
        camera_used=camera_used
    )
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return db_report


@router.get("/", response_model=List[schemas.ReportResponse])
async def list_reports(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all reports for the current user
    """
    reports = db.query(models.Report).filter(
        models.Report.user_id == current_user.id
    ).order_by(models.Report.created_at.desc()).all()
    
    return reports


@router.get("/{report_id}", response_model=schemas.ReportResponse)
async def get_report(
    report_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific report by ID
    """
    report = db.query(models.Report).filter(
        models.Report.id == report_id,
        models.Report.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a report
    """
    report = db.query(models.Report).filter(
        models.Report.id == report_id,
        models.Report.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Delete media file
    if os.path.exists(report.media_path):
        os.remove(report.media_path)
    
    db.delete(report)
    db.commit()
    
    return None
