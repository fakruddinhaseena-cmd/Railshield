from fastapi import APIRouter
from app.services.mock_data import ALERTS

router = APIRouter()

@router.get("/")
def get_alerts():
    return ALERTS

@router.get("/active")
def get_active_alerts():
    return [a for a in ALERTS if not a.resolved]
