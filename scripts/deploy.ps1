# VK App Deployment Script for Windows
param(
    [string]$Version = "latest",
    [string]$Environment = "staging"
)

# Configuration
$APP_NAME = "vkapp"
$DOCKER_REGISTRY = "your-registry.com"

Write-Host "🚀 Starting deployment of VK App" -ForegroundColor Green
Write-Host "Version: $Version" -ForegroundColor Yellow
Write-Host "Environment: $Environment" -ForegroundColor Yellow

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not installed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Build Docker image
Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
Set-Location VKApp

if ($Environment -eq "production") {
    docker build --target production -t "${DOCKER_REGISTRY}/${APP_NAME}:${Version}" .
    docker build --target production -t "${DOCKER_REGISTRY}/${APP_NAME}:latest" .
} else {
    docker build --target dev -t "${DOCKER_REGISTRY}/${APP_NAME}:${Version}" .
    docker build --target dev -t "${DOCKER_REGISTRY}/${APP_NAME}:latest" .
}

Write-Host "✅ Docker image built successfully" -ForegroundColor Green

# Push to registry
Write-Host "📤 Pushing image to registry..." -ForegroundColor Yellow
docker push "${DOCKER_REGISTRY}/${APP_NAME}:${Version}"
docker push "${DOCKER_REGISTRY}/${APP_NAME}:latest"

Write-Host "✅ Image pushed to registry" -ForegroundColor Green

# Deploy using docker-compose
Write-Host "🚀 Deploying application..." -ForegroundColor Yellow
Set-Location ..

if ($Environment -eq "production") {
    docker-compose --profile production up -d
} else {
    docker-compose up -d vkapp-dev
}

Write-Host "✅ Application deployed successfully" -ForegroundColor Green

# Health check
Write-Host "🏥 Performing health check..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/health" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passed" -ForegroundColor Green
    } else {
        Write-Host "❌ Health check failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Cleanup old images
Write-Host "🧹 Cleaning up old images..." -ForegroundColor Yellow
docker image prune -f

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "Application is available at: http://localhost:8081" -ForegroundColor Yellow
