$ErrorActionPreference = "Stop"
$projectDir = $PSScriptRoot
Set-Location $projectDir

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js is required. Install Node.js 18 or newer and reopen this terminal."
}

if (-not (Test-Path (Join-Path $projectDir ".env"))) {
    Copy-Item (Join-Path $projectDir ".env.example") (Join-Path $projectDir ".env")
    Write-Host "Created .env from .env.example. Set a private JWT_SECRET before using real accounts."
}

npm start
