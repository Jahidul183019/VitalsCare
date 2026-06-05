@echo off
echo 🚀 Starting Community Health Risk Radar (Windows)...

:: Start Backend
echo.
echo [1/2] Setting up Python Backend...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing dependencies...
pip install -r requirements.txt
echo Starting Backend in a new window...
start "VitalsCare Backend" cmd /k "python app.py"
cd ..

:: Start Frontend
echo.
echo [2/2] Setting up React Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install
)
echo Starting Frontend in a new window...
start "VitalsCare Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ✅ Both servers are launching in separate windows!
echo 👉 Frontend is available at: http://localhost:5173
echo 👉 Backend is running on: http://127.0.0.1:8000