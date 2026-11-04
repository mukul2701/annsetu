@echo off
title AnnSetu - Agricultural MERN Stack Platform
echo ========================================================
echo Starting AnnSetu Fullstack Server on Port 5000...
echo ========================================================
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is missing from PATH.
  pause
  exit /b 1
)
node server/index.js
pause
