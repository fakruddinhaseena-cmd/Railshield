from fastapi import APIRouter
from app.services.mock_data import get_dashboard_stats, THREATS, ALERTS, ASSETS

router = APIRouter()

@router.get("/stats")
def dashboard_stats():
    return get_dashboard_stats()

@router.get("/summary")
def dashboard_summary():
    return {
        "stats": get_dashboard_stats(),
        "recent_threats": [t for t in THREATS[:3]],
        "recent_alerts": [a for a in ALERTS if not a.resolved][:4],
        "top_risk_assets": sorted(ASSETS, key=lambda x: x.risk_score, reverse=True)[:3],
    }
