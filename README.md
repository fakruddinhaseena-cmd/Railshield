# 🛡️ RailShield
### India's First Predictive Railway Cybersecurity Platform

> Built for Indian Railways — Kavach-aware, CERT-In compliant, edge-native, quantum-ready.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (optional but recommended)

---

## 🖥️ Frontend (Next.js 14)

```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:3000

---

## ⚙️ Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Docs: http://localhost:8000/docs

---

## 🐳 Docker (Full Stack)

```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend:  http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🗂️ Project Structure

```
railshield/
├── frontend/               # Next.js 14 + TypeScript + Tailwind
│   └── src/
│       ├── components/     # Dashboard, Alerts, Assets, Threats, Compliance
│       ├── pages/          # App routes
│       └── styles/         # Global styles
├── backend/                # Python FastAPI
│   └── app/
│       ├── api/routes/     # REST endpoints
│       ├── models/         # Pydantic models
│       ├── services/       # Business logic
│       └── ml/             # AI/ML anomaly detection engine
├── docs/                   # Architecture & API docs
└── docker-compose.yml
```

---

## 🧠 Key Features vs Cylus

| Feature | Cylus | RailShield |
|---|---|---|
| Threat detection | Reactive | **Predictive AI** |
| India protocols | ❌ | **✅ Kavach + RailTel + IR SCADA** |
| Mobile app | ❌ | **✅ iOS + Android ready** |
| Edge compute | ❌ | **✅ Station/depot ML inference** |
| Auto response | ❌ | **✅ Automated playbooks** |
| Quantum-ready | ❌ | **✅ PQC architecture** |
| Language | English only | **✅ English + Hindi** |
| Dark web intel | ❌ | **✅ Rail threat feeds** |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/assets` | All rail assets inventory |
| GET | `/api/v1/threats` | Active threat feed |
| POST | `/api/v1/threats/analyze` | AI threat analysis |
| GET | `/api/v1/alerts` | Security alerts |
| GET | `/api/v1/compliance` | Compliance status |
| GET | `/api/v1/dashboard/stats` | Dashboard KPIs |
| POST | `/api/v1/ml/predict` | Predictive threat engine |

---

## 🏗️ Architecture

```
Field Layer     →  Kavach ATP, RailTel, Trackside, Rolling Stock, Station, OCC
Data/Edge Layer →  DPI + TAP + Edge Compute (local ML at depot)
Backend         →  FastAPI microservices + AI Predict + Auto Response
Data Stores     →  TimescaleDB + PostgreSQL + Kafka + Object Store
Frontend        →  Next.js Dashboard + Mobile (iOS/Android)
```

---

## 🔐 Security Standards
- IEC 62443-3-2
- NIST 800-82
- EN TS 50701
- CERT-In Guidelines
- TSA Security Directives

---

Built with ❤️ for Indian Railways
