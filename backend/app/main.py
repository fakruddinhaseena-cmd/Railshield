from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import assets, threats, alerts, compliance, dashboard, ml, auth, websocket, darkweb

app = FastAPI(
    title="RailShield API",
    description="India's First Predictive Railway Cybersecurity Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(websocket.router, prefix="", tags=["WebSocket"])
app.include_router(auth.router,      prefix="/api/v1/auth",      tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(assets.router,    prefix="/api/v1/assets",    tags=["Assets"])
app.include_router(threats.router,   prefix="/api/v1/threats",   tags=["Threats"])
app.include_router(alerts.router,    prefix="/api/v1/alerts",    tags=["Alerts"])
app.include_router(compliance.router,prefix="/api/v1/compliance",tags=["Compliance"])
app.include_router(darkweb.router,   prefix="/api/v1/darkweb",   tags=["Dark Web Intel"])
app.include_router(ml.router,        prefix="/api/v1/ml",        tags=["ML Engine"])

@app.get("/", tags=["Health"])
def root():
    return {"status": "online", "product": "RailShield", "version": "1.0.0"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
