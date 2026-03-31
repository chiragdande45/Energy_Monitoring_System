@echo off
echo Starting IoT Energy Monitoring Platform...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting ESP32 Data Simulator...
start "ESP32 Simulator" cmd /k "node test-esp32-data.js"

echo.
echo ✅ All services started!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:5000
echo 📡 ESP32 Simulator: Running
echo.
echo Press any key to exit...
pause > nul