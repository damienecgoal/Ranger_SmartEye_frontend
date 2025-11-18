@echo off
if "%1"=="h" goto :main

:: Hide the window immediately and restart hidden
powershell -WindowStyle Hidden -Command "Start-Process '%~f0' -ArgumentList 'h' -WindowStyle Hidden"
exit /b

:main

:: Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    echo This may take a few minutes...
    echo Installation started at: %date% %time%
    
    :: Run npm install and check if it succeeded
    npm install
    if errorlevel 1 (
        echo ❌ ERROR: npm install failed!
        echo Please check your internet connection and package.json file
        echo npm install failed at: %date% %time%
        pause
        exit /b 1
    ) else (
        echo ✅ Dependencies installed successfully!
        echo Installation completed at: %date% %time%
    )
    :: Start the service
    echo Starting npm run start...
    npm run start
    pause
)

:: Start the service
echo Starting npm run start...
npm run start
pause
