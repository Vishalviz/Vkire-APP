# GCP Deployment Script for VK App
# This script deploys your VK App to Google Cloud Platform using free tier

Write-Host "🚀 GCP Deployment Script for VK App" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if gcloud CLI is installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $gcloudVersion = gcloud --version
    Write-Host "✅ Google Cloud CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Cloud CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    exit 1
}

# Check if kubectl is installed
try {
    $kubectlVersion = kubectl version --client
    Write-Host "✅ kubectl found" -ForegroundColor Green
} catch {
    Write-Host "❌ kubectl not found. Please install it first:" -ForegroundColor Red
    Write-Host "   https://kubernetes.io/docs/tasks/tools/" -ForegroundColor Cyan
    exit 1
}

# Check if Docker is running
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found or not running" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔐 Setting up GCP authentication..." -ForegroundColor Yellow
Write-Host "Please follow these steps:" -ForegroundColor Cyan
Write-Host "1. Run: gcloud auth login" -ForegroundColor White
Write-Host "2. Run: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor White
Write-Host "3. Run: gcloud auth application-default login" -ForegroundColor White

$continue = Read-Host "`nHave you completed the authentication steps? (y/n)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "Please complete authentication first, then run this script again." -ForegroundColor Yellow
    exit 1
}

# Get project ID
$projectId = Read-Host "Enter your GCP Project ID"
if ([string]::IsNullOrEmpty($projectId)) {
    Write-Host "Project ID is required!" -ForegroundColor Red
    exit 1
}

# Create terraform.tfvars
$tfvarsContent = @"
project_id = "$projectId"
region     = "us-central1"
zone       = "us-central1-a"
"@

$tfvarsContent | Out-File -FilePath "terraform.tfvars" -Encoding UTF8
Write-Host "✅ Created terraform.tfvars" -ForegroundColor Green

Write-Host "`n🏗️ Initializing Terraform..." -ForegroundColor Yellow
terraform init

Write-Host "`n📋 Planning infrastructure..." -ForegroundColor Yellow
terraform plan

$apply = Read-Host "`nDo you want to apply the infrastructure? (y/n)"
if ($apply -eq "y" -or $apply -eq "Y") {
    Write-Host "🚀 Creating GCP infrastructure..." -ForegroundColor Yellow
    terraform apply -auto-approve
    
    Write-Host "`n🔧 Getting GKE credentials..." -ForegroundColor Yellow
    gcloud container clusters get-credentials vkapp-cluster --zone us-central1-a
    
    Write-Host "`n📦 Building and pushing Docker image..." -ForegroundColor Yellow
    $imageName = "gcr.io/$projectId/vkapp:latest"
    
    # Build and tag image
    docker build -t $imageName ../../VKApp
    
    # Push to GCR
    docker push $imageName
    
    Write-Host "`n🚀 Deploying to GKE..." -ForegroundColor Yellow
    
    # Create namespace
    kubectl create namespace vkapp --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy application
    kubectl apply -f ../../k8s-vkapp-deployment.yaml -n vkapp
    
    # Update deployment to use GCR image
    kubectl set image deployment/vkapp vkapp=$imageName -n vkapp
    
    Write-Host "`n🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "Your VK App is now running on Google Cloud Platform!" -ForegroundColor Green
    
    Write-Host "`n📊 Checking deployment status..." -ForegroundColor Yellow
    kubectl get pods -n vkapp
    kubectl get services -n vkapp
    
    Write-Host "`n🌐 To access your app:" -ForegroundColor Cyan
    Write-Host "1. Port forward: kubectl port-forward service/vkapp-service 8080:80 -n vkapp" -ForegroundColor White
    Write-Host "2. Open: http://localhost:8080" -ForegroundColor White
    
} else {
    Write-Host "Infrastructure creation cancelled." -ForegroundColor Yellow
}

Write-Host "`n💰 Cost Information:" -ForegroundColor Cyan
Write-Host "- GKE cluster: FREE (1 node, e2-micro)" -ForegroundColor Green
Write-Host "- Container Registry: FREE (up to 500MB)" -ForegroundColor Green
Write-Host "- Network: FREE (basic usage)" -ForegroundColor Green
Write-Host "- Total estimated cost: $0/month" -ForegroundColor Green
