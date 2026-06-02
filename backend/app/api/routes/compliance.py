from fastapi import APIRouter
from app.services.mock_data import COMPLIANCE

router = APIRouter()

@router.get("/")
def get_compliance():
    return COMPLIANCE

@router.get("/score")
def overall_score():
    avg = sum(c.score for c in COMPLIANCE) / len(COMPLIANCE)
    return {"overall_score": round(avg, 1), "status": "partial" if avg < 90 else "compliant"}
