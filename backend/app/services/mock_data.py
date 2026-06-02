import random
from datetime import datetime, timedelta
from app.models.schemas import (
    Asset, Threat, Alert, ComplianceItem, DashboardStats,
    AssetType, AssetStatus, SeverityLevel
)

def _rand_ip():
    return f"192.168.{random.randint(1,20)}.{random.randint(1,254)}"

def _past(minutes=0, hours=0, days=0):
    return datetime.utcnow() - timedelta(minutes=minutes, hours=hours, days=days)

ASSETS = [
    Asset(id="A001", name="Kavach ATP Node — New Delhi", type=AssetType.KAVACH,
          location="New Delhi Junction", ip_address="10.1.1.10", status=AssetStatus.SECURE,
          last_seen=_past(minutes=2), vulnerabilities=0, risk_score=8.2,
          protocol="Kavach v3.2", zone="Zone-1-NR"),
    Asset(id="A002", name="OCC Server — Mumbai Central", type=AssetType.OCC,
          location="Mumbai Central", ip_address="10.2.1.5", status=AssetStatus.WARNING,
          last_seen=_past(minutes=5), vulnerabilities=3, risk_score=62.4,
          protocol="SCADA/IEC-104", zone="Zone-2-WR"),
    Asset(id="A003", name="RailTel Gateway — Chennai", type=AssetType.RAILTEL,
          location="Chennai Egmore", ip_address="10.3.1.20", status=AssetStatus.SECURE,
          last_seen=_past(minutes=1), vulnerabilities=1, risk_score=15.0,
          protocol="RailTel MPLS", zone="Zone-3-SR"),
    Asset(id="A004", name="Trackside RTU — Howrah", type=AssetType.TRACKSIDE,
          location="Howrah Junction", ip_address="10.4.1.8", status=AssetStatus.CRITICAL,
          last_seen=_past(minutes=12), vulnerabilities=7, risk_score=88.5,
          protocol="DNP3", zone="Zone-4-ER"),
    Asset(id="A005", name="Rolling Stock ECU — Rajdhani 12301", type=AssetType.ROLLING_STOCK,
          location="En Route NR", ip_address="10.5.1.3", status=AssetStatus.SECURE,
          last_seen=_past(minutes=3), vulnerabilities=0, risk_score=12.1,
          protocol="MVB/CAN", zone="Zone-1-NR"),
    Asset(id="A006", name="Station BMS — Bengaluru City", type=AssetType.STATION,
          location="Bengaluru City Junction", ip_address="10.6.1.15", status=AssetStatus.SECURE,
          last_seen=_past(minutes=4), vulnerabilities=2, risk_score=28.0,
          protocol="BACnet/IP", zone="Zone-5-SWR"),
    Asset(id="A007", name="Kavach ATP Node — Lucknow", type=AssetType.KAVACH,
          location="Lucknow Charbagh", ip_address="10.1.2.11", status=AssetStatus.SECURE,
          last_seen=_past(minutes=1), vulnerabilities=0, risk_score=9.0,
          protocol="Kavach v3.2", zone="Zone-2-NER"),
    Asset(id="A008", name="OCC Server — Secunderabad", type=AssetType.OCC,
          location="Secunderabad Junction", ip_address="10.7.1.4", status=AssetStatus.WARNING,
          last_seen=_past(minutes=8), vulnerabilities=4, risk_score=55.3,
          protocol="SCADA/Modbus", zone="Zone-5-SCR"),
]

THREATS = [
    Threat(id="T001", title="Anomalous DNP3 Command Injection",
           severity=SeverityLevel.CRITICAL, source_ip="203.88.140.12",
           target_asset="Trackside RTU — Howrah", threat_type="Command Injection",
           description="Unauthorized DNP3 control commands detected targeting signal relay at Howrah Junction. Pattern matches known APT group targeting rail OT systems.",
           detected_at=_past(minutes=8), status="active", confidence=0.94,
           mitre_tactic="T0855 - Unauthorized Command Message", auto_response=True),
    Threat(id="T002", title="Suspicious SCADA Login Attempts",
           severity=SeverityLevel.HIGH, source_ip="91.214.23.55",
           target_asset="OCC Server — Mumbai Central", threat_type="Brute Force",
           description="52 failed login attempts in 3 minutes on OCC SCADA interface. Possible credential stuffing attack.",
           detected_at=_past(hours=1), status="investigating", confidence=0.87,
           mitre_tactic="T0834 - Native API", auto_response=False),
    Threat(id="T003", title="Kavach Network Anomaly",
           severity=SeverityLevel.MEDIUM, source_ip=None,
           target_asset="Kavach ATP Node — Lucknow", threat_type="Network Anomaly",
           description="Unusual broadcast traffic detected on Kavach ATP network segment. Possible reconnaissance activity.",
           detected_at=_past(hours=3), status="monitoring", confidence=0.71,
           mitre_tactic="T0840 - Network Sniffing", auto_response=False),
    Threat(id="T004", title="Rolling Stock ECU Firmware Tamper Attempt",
           severity=SeverityLevel.HIGH, source_ip="172.16.5.101",
           target_asset="Rolling Stock ECU — Rajdhani 12301", threat_type="Firmware Attack",
           description="Unauthorized firmware update request detected on train ECU. Blocked by auto-response policy.",
           detected_at=_past(hours=6), status="blocked", confidence=0.91,
           mitre_tactic="T0839 - Module Firmware", auto_response=True),
]

ALERTS = [
    Alert(id="AL001", title="Critical: RTU Under Attack", severity=SeverityLevel.CRITICAL,
          asset_id="A004", asset_name="Trackside RTU — Howrah",
          message="Active command injection attack detected. Auto-isolation initiated.",
          created_at=_past(minutes=8), resolved=False, alert_type="attack"),
    Alert(id="AL002", title="High: Brute Force on OCC", severity=SeverityLevel.HIGH,
          asset_id="A002", asset_name="OCC Server — Mumbai Central",
          message="52 failed auth attempts. Account lockout triggered.",
          created_at=_past(hours=1), resolved=False, alert_type="auth"),
    Alert(id="AL003", title="Medium: Kavach Network Anomaly", severity=SeverityLevel.MEDIUM,
          asset_id="A007", asset_name="Kavach ATP Node — Lucknow",
          message="Unusual broadcast traffic on ATP segment. Monitoring.",
          created_at=_past(hours=3), resolved=False, alert_type="anomaly"),
    Alert(id="AL004", title="High: Firmware Tamper Blocked", severity=SeverityLevel.HIGH,
          asset_id="A005", asset_name="Rolling Stock ECU — Rajdhani 12301",
          message="Unauthorized firmware update blocked. Source IP quarantined.",
          created_at=_past(hours=6), resolved=True, alert_type="firmware"),
    Alert(id="AL005", title="Info: Compliance Scan Complete", severity=SeverityLevel.INFO,
          asset_id="A001", asset_name="Kavach ATP Node — New Delhi",
          message="Scheduled IEC 62443 compliance scan completed. Score: 94%.",
          created_at=_past(days=1), resolved=True, alert_type="compliance"),
]

COMPLIANCE = [
    ComplianceItem(standard="IEC 62443-3-2", score=91.0, status="compliant",
                   controls_passed=87, controls_total=96, last_audit=_past(days=7)),
    ComplianceItem(standard="NIST 800-82", score=88.0, status="compliant",
                   controls_passed=132, controls_total=150, last_audit=_past(days=14)),
    ComplianceItem(standard="EN TS 50701", score=85.0, status="partial",
                   controls_passed=68, controls_total=80, last_audit=_past(days=3)),
    ComplianceItem(standard="CERT-In Guidelines", score=94.0, status="compliant",
                   controls_passed=47, controls_total=50, last_audit=_past(days=2)),
    ComplianceItem(standard="TSA Security Directives", score=79.0, status="partial",
                   controls_passed=55, controls_total=70, last_audit=_past(days=30)),
]

def get_dashboard_stats() -> DashboardStats:
    return DashboardStats(
        total_assets=len(ASSETS),
        secure_assets=sum(1 for a in ASSETS if a.status == AssetStatus.SECURE),
        active_threats=sum(1 for t in THREATS if t.status in ["active", "investigating"]),
        critical_alerts=sum(1 for a in ALERTS if a.severity == SeverityLevel.CRITICAL and not a.resolved),
        compliance_score=round(sum(c.score for c in COMPLIANCE) / len(COMPLIANCE), 1),
        threats_blocked_today=random.randint(12, 40),
        network_health=round(random.uniform(87, 97), 1),
        kavach_nodes_online=random.randint(1840, 2000),
    )
