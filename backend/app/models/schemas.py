from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class AssetType(str, Enum):
    TRACKSIDE = "trackside"
    ROLLING_STOCK = "rolling_stock"
    STATION = "station"
    OCC = "occ"
    KAVACH = "kavach"
    RAILTEL = "railtel"

class AssetStatus(str, Enum):
    SECURE = "secure"
    WARNING = "warning"
    CRITICAL = "critical"
    OFFLINE = "offline"

class Asset(BaseModel):
    id: str
    name: str
    type: AssetType
    location: str
    ip_address: Optional[str]
    status: AssetStatus
    last_seen: datetime
    vulnerabilities: int
    risk_score: float
    protocol: Optional[str]
    zone: str

class Threat(BaseModel):
    id: str
    title: str
    severity: SeverityLevel
    source_ip: Optional[str]
    target_asset: str
    threat_type: str
    description: str
    detected_at: datetime
    status: str
    confidence: float
    mitre_tactic: Optional[str]
    auto_response: bool

class Alert(BaseModel):
    id: str
    title: str
    severity: SeverityLevel
    asset_id: str
    asset_name: str
    message: str
    created_at: datetime
    resolved: bool
    alert_type: str

class ComplianceItem(BaseModel):
    standard: str
    score: float
    status: str
    controls_passed: int
    controls_total: int
    last_audit: datetime

class DashboardStats(BaseModel):
    total_assets: int
    secure_assets: int
    active_threats: int
    critical_alerts: int
    compliance_score: float
    threats_blocked_today: int
    network_health: float
    kavach_nodes_online: int

class MLPredictRequest(BaseModel):
    asset_id: str
    features: List[float]
    window_minutes: int = 60

class MLPredictResponse(BaseModel):
    asset_id: str
    threat_probability: float
    anomaly_score: float
    predicted_threat_type: Optional[str]
    confidence: float
    recommendation: str
    auto_response_triggered: bool
