# Deploy to Raspberry Pi Script
param(
    [string]$RemoteUser = "bast",
    [string]$RemoteHost = "192.168.1.141",
    [string]$RemoteDir = "~/reporting-app"
)

$Target = "$RemoteUser@$RemoteHost"

Write-Host "Starting deployment to $Target..." -ForegroundColor Cyan

# 1. Create remote directory
Write-Host "Creating remote directory..."
ssh $Target "mkdir -p $RemoteDir/backend $RemoteDir/frontend $RemoteDir/data $RemoteDir/uploads"

# 2. Copy Backend Files
Write-Host "Copying Backend files..."
scp -r backend/app backend/requirements.txt backend/Dockerfile $Target`:$RemoteDir/backend/

# 3. Copy Frontend Files
Write-Host "Copying Frontend files..."
scp -r frontend/src frontend/public frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html frontend/Dockerfile frontend/nginx.conf $Target`:$RemoteDir/frontend/

# 4. Copy Docker Compose
Write-Host "Copying docker-compose.yml..."
scp docker-compose.yml $Target`:$RemoteDir/

# 5. Copy Certificates
Write-Host "Copying Certificates..."
ssh $Target "mkdir -p $RemoteDir/certs"
scp -r certs/* $Target`:$RemoteDir/certs/

# 6. Build and Deploy
Write-Host "Building and Deploying on Pi (This may take a while)..."
ssh $Target "cd $RemoteDir && docker compose down && docker compose up -d --build"

Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "Frontend: http://$RemoteHost:8081"
Write-Host "Backend:  http://$RemoteHost:8001"
