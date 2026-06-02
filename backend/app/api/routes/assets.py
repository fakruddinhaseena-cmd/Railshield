from fastapi import APIRouter, HTTPException
from app.services.mock_data import ASSETS

router = APIRouter()

@router.get("/")
def get_assets():
    return ASSETS

@router.get("/{asset_id}")
def get_asset(asset_id: str):
    asset = next((a for a in ASSETS if a.id == asset_id), None)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset
