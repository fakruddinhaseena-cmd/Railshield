@echo off
echo 🛡️  Starting RailShield...

:: Backend
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt -q
start "RailShield Backend" cmd /k "call venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

:: Frontend
cd ..\frontend
call npm install -q
start "RailShield Frontend" cmd /k "npm run dev"

echo.
echo 🚀 RailShield is starting!
echo    Dashboard : http://localhost:3000
echo    API Docs  : http://localhost:8000/docs
echo.
pause
