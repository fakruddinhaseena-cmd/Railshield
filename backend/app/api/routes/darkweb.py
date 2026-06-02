from fastapi import APIRouter
from datetime import datetime, timedelta
import random

router = APIRouter()

DARK_WEB_FEEDS = [
    {
        "id": "DW001",
        "title": "Railway SCADA Exploit Kit Listed on Dark Web Forum",
        "source": "RailHack Forum (Tor)",
        "severity": "critical",
        "summary": "A threat actor is selling a 0-day exploit targeting IEC-104 SCADA systems used in Indian Railways. Price: $45,000. Buyer interest from 3 nation-state groups.",
        "tags": ["IEC-104", "0-day", "SCADA", "Indian Railways"],
        "detected_at": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
        "credibility": 0.87,
        "threat_actor": "APT-RAILGH0ST",
        "target": "Indian Railways OCC Systems",
        "mitigations": ["Apply IEC-104 vendor patches", "Segment OCC from internet", "Enable DPI monitoring"],
    },
    {
        "id": "DW002",
        "title": "Kavach ATP Credentials Leaked in Paste Site",
        "source": "PasteDB Mirror",
        "severity": "high",
        "summary": "220 Kavach ATP system credentials found in a public paste. Includes admin credentials for Northern Railway zones. Source appears to be a phishing campaign targeting IR staff.",
        "tags": ["Kavach", "Credentials", "Phishing", "Northern Railway"],
        "detected_at": (datetime.utcnow() - timedelta(hours=18)).isoformat(),
        "credibility": 0.91,
        "threat_actor": "Unknown",
        "target": "Kavach ATP — Zone NR",
        "mitigations": ["Force password reset for all ATP admins", "Enable MFA", "Audit login logs"],
    },
    {
        "id": "DW003",
        "title": "DDoS-for-hire Service Targeting Rail Infrastructure",
        "source": "BreachForums Clone",
        "severity": "medium",
        "summary": "A booter service is offering DDoS attacks on 'critical Indian infrastructure' including railway ticketing and control systems. Pricing starts at $200/hour.",
        "tags": ["DDoS", "Infrastructure", "Ticketing"],
        "detected_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
        "credibility": 0.68,
        "threat_actor": "DDoS-Gang-47",
        "target": "IRCTC + OCC Web Interfaces",
        "mitigations": ["Enable DDoS protection on web endpoints", "Rate limiting", "CDN failover"],
    },
    {
        "id": "DW004",
        "title": "Rail Network Topology Maps Sold on Telegram",
        "source": "Telegram Channel (Rail-Leaks)",
        "severity": "high",
        "summary": "Detailed network topology maps of South Central Railway's OT network are being sold on Telegram. Data appears to be from an insider threat or contractor leak.",
        "tags": ["Insider Threat", "Network Map", "SCR", "Telegram"],
        "detected_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "credibility": 0.79,
        "threat_actor": "Insider / Contractor",
        "target": "South Central Railway (SCR)",
        "mitigations": ["Audit contractor access", "Classify network diagrams", "Monitor insider activity"],
    },
]

@router.get("/")
def get_dark_web_intel():
    return DARK_WEB_FEEDS

@router.get("/summary")
def dark_web_summary():
    return {
        "total_feeds": len(DARK_WEB_FEEDS),
        "critical": sum(1 for f in DARK_WEB_FEEDS if f["severity"] == "critical"),
        "high": sum(1 for f in DARK_WEB_FEEDS if f["severity"] == "high"),
        "last_updated": datetime.utcnow().isoformat(),
        "active_threat_actors": list({f["threat_actor"] for f in DARK_WEB_FEEDS if f["threat_actor"] != "Unknown"}),
    }
