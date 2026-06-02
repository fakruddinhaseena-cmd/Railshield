from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import asyncio, json, random
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, data: dict):
        dead = []
        for ws in self.active:
            try:
                await ws.send_text(json.dumps(data))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)

manager = ConnectionManager()

THREAT_POOL = [
    ("DNP3 Replay Attack Detected",       "Trackside RTU — Howrah",        "critical"),
    ("Unauthorized SCADA Access",          "OCC Server — Mumbai",           "high"),
    ("Kavach Protocol Anomaly",            "Kavach ATP — Lucknow",          "medium"),
    ("Firmware Integrity Check Failed",    "Rolling Stock ECU — Rajdhani",  "high"),
    ("Port Scan on Rail Network",          "RailTel Gateway — Chennai",     "medium"),
    ("IEC-104 Command Flood",              "OCC Server — Secunderabad",     "high"),
    ("Abnormal Train Control Command",     "Kavach ATP — New Delhi",        "critical"),
    ("BACnet Device Discovery Attempt",    "Station BMS — Bengaluru",       "low"),
]

async def threat_simulator():
    """Background task: broadcasts a simulated threat every 8-15 seconds"""
    while True:
        await asyncio.sleep(random.randint(8, 15))
        if manager.active:
            title, asset, severity = random.choice(THREAT_POOL)
            await manager.broadcast({
                "type": "threat",
                "id": f"T{random.randint(1000,9999)}",
                "title": title,
                "asset": asset,
                "severity": severity,
                "time": datetime.utcnow().isoformat(),
                "auto_response": severity == "critical",
            })

@router.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await manager.connect(websocket)
    # Send welcome + start simulator if first connection
    await websocket.send_text(json.dumps({"type": "connected", "message": "RailShield live feed active"}))
    try:
        while True:
            await websocket.receive_text()   # keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.on_event("startup")
async def startup():
    asyncio.create_task(threat_simulator())
