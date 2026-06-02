#!/bin/bash
echo "🛡️  Starting RailShield..."

# Start backend
cd "$(dirname "$0")/../backend"
python -m venv venv 2>/dev/null || true
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
pip install -r requirements.txt -q
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo "✅ Backend → http://localhost:8000"
echo "📖 API Docs → http://localhost:8000/docs"

# Start frontend
cd "../frontend"
npm install --legacy-peer-deps -q
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend → http://localhost:3000"

echo ""
echo "🚀 RailShield is running!"
echo "   Login with: admin@railshield.in / railshield123"
echo ""
echo "Press Ctrl+C to stop"
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
