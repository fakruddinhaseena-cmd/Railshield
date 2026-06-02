from fastapi import APIRouter, HTTPException
from app.services.mock_data import THREATS
from app.models.schemas import Threat

router = APIRouter()

@router.get("/")
def get_threats():
    return THREATS

@router.get("/{threat_id}")
def get_threat(threat_id: str):
    threat = next((t for t in THREATS if t.id == threat_id), None)
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    return threat

@router.post("/analyze")
def analyze_threat(payload: dict):
    return {
        "status": "analyzed",
        "threat_detected": True,
        "severity": "high",
        "recommendation": "Isolate affected asset and run deep packet inspection."
    }
