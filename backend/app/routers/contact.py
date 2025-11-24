from fastapi import APIRouter, HTTPException, status
from .. import schemas
from ..config import settings
import logging

router = APIRouter(prefix="/contact", tags=["contact"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/", status_code=status.HTTP_200_OK)
async def send_contact_message(message: schemas.ContactMessage):
    """
    Send a contact message to admin
    For now, this logs the message. In production, integrate with email service.
    """
    # Log the contact message
    logger.info(f"Contact message from {message.name} ({message.email}): {message.message}")
    
    # In production, you would send an email here
    # Example using SMTP or a service like SendGrid, AWS SES, etc.
    
    return {
        "message": "Your message has been sent successfully",
        "admin_email": settings.ADMIN_EMAIL
    }
