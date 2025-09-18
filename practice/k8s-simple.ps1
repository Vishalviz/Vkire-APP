# DevOps Learning - Kubernetes Practice Script for Windows
Write-Host "DevOps Learning - Kubernetes Practice" -ForegroundColor Blue
Write-Host "=====================================" -ForegroundColor Blue

# Check if kubectl is available
if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    Write-Host "kubectl is not installed" -ForegroundColor Red
    exit 1
}
Write-Host "kubectl is available" -ForegroundColor Green

# Check cluster connection
Write-Host "Checking Kubernetes cluster connection..." -ForegroundColor Yellow
try {
    kubectl cluster-info | Out-Null
    Write-Host "Connected to Kubernetes cluster" -ForegroundColor Green
    $hasCluster = $true
}
catch {
    Write-Host "No Kubernetes cluster available" -ForegroundColor Red
    Write-Host "To start a local cluster:" -ForegroundColor Yellow
    Write-Host "1. Start Docker Desktop" -ForegroundColor Yellow
    Write-Host "2. Enable Kubernetes in Docker Desktop settings" -ForegroundColor Yellow
    $hasCluster = $false
}

Write-Host ""
Write-Host "Basic kubectl Commands:" -ForegroundColor Blue
Write-Host "1. kubectl cluster-info" -ForegroundColor Yellow
Write-Host "2. kubectl get nodes" -ForegroundColor Yellow
Write-Host "3. kubectl get all" -ForegroundColor Yellow
Write-Host "4. kubectl get namespaces" -ForegroundColor Yellow

if ($hasCluster) {
    Write-Host ""
    Write-Host "Deployment Commands:" -ForegroundColor Blue
    Write-Host "1. kubectl apply -f practice/nginx-practice.yaml" -ForegroundColor Yellow
    Write-Host "2. kubectl get deployments -n devops-practice" -ForegroundColor Yellow
    Write-Host "3. kubectl get pods -n devops-practice" -ForegroundColor Yellow
    Write-Host "4. kubectl get services -n devops-practice" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Kubernetes practice commands ready!" -ForegroundColor Green
