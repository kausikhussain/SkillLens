Write-Host "Starting Next.js Development Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

Write-Host "Starting FastAPI AI Engine..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-engine; .\venv\Scripts\activate; uvicorn main:app --reload --port 8000"

Write-Host "Both servers have been launched in separate windows." -ForegroundColor Cyan
