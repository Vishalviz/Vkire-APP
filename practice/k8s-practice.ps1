# DevOps Learning - Kubernetes Practice Script for Windows
# This script teaches you Kubernetes fundamentals through hands-on practice

Write-Host "🚀 DevOps Learning - Kubernetes Practice" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

# Function to check if kubectl is available
function Test-Kubectl {
    if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
        Write-Host "❌ kubectl is not installed" -ForegroundColor Red
        Write-Host "Please install kubectl first" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ kubectl is available" -ForegroundColor Green
}

# Function to check cluster connection
function Test-Cluster {
    Write-Host "🔍 Checking Kubernetes cluster connection..." -ForegroundColor Yellow
    try {
        kubectl cluster-info | Out-Null
        Write-Host "✅ Connected to Kubernetes cluster" -ForegroundColor Green
        kubectl cluster-info
        return $true
    }
    catch {
        Write-Host "❌ No Kubernetes cluster available" -ForegroundColor Red
        Write-Host "💡 To start a local cluster:" -ForegroundColor Yellow
        Write-Host "   1. Start Docker Desktop" -ForegroundColor Yellow
        Write-Host "   2. Enable Kubernetes in Docker Desktop settings" -ForegroundColor Yellow
        Write-Host "   3. Or use: minikube start" -ForegroundColor Yellow
        return $false
    }
}

# Function to practice basic kubectl commands
function Show-BasicCommands {
    Write-Host "📚 Learning Basic kubectl Commands" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Get cluster information:" -ForegroundColor Yellow
    Write-Host "kubectl cluster-info"
    Write-Host ""
    
    Write-Host "2. Get nodes (servers in the cluster):" -ForegroundColor Yellow
    Write-Host "kubectl get nodes"
    Write-Host ""
    
    Write-Host "3. Get all resources in default namespace:" -ForegroundColor Yellow
    Write-Host "kubectl get all"
    Write-Host ""
    
    Write-Host "4. Get namespaces:" -ForegroundColor Yellow
    Write-Host "kubectl get namespaces"
    Write-Host ""
}

# Function to practice deployment
function Show-DeploymentCommands {
    Write-Host "🚀 Learning Deployment Management" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Apply our practice deployment:" -ForegroundColor Yellow
    Write-Host "kubectl apply -f practice/nginx-practice.yaml"
    Write-Host ""
    
    Write-Host "2. Check deployment status:" -ForegroundColor Yellow
    Write-Host "kubectl get deployments -n devops-practice"
    Write-Host ""
    
    Write-Host "3. Check pods (running containers):" -ForegroundColor Yellow
    Write-Host "kubectl get pods -n devops-practice"
    Write-Host ""
    
    Write-Host "4. Check services:" -ForegroundColor Yellow
    Write-Host "kubectl get services -n devops-practice"
    Write-Host ""
    
    Write-Host "5. Get detailed information:" -ForegroundColor Yellow
    Write-Host "kubectl describe deployment nginx-practice -n devops-practice"
    Write-Host ""
}

# Function to practice scaling
function Show-ScalingCommands {
    Write-Host "📈 Learning Scaling" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Scale up to 5 replicas:" -ForegroundColor Yellow
    Write-Host "kubectl scale deployment nginx-practice --replicas=5 -n devops-practice"
    Write-Host ""
    
    Write-Host "2. Check scaling progress:" -ForegroundColor Yellow
    Write-Host "kubectl get pods -n devops-practice -w"
    Write-Host ""
    
    Write-Host "3. Scale back down:" -ForegroundColor Yellow
    Write-Host "kubectl scale deployment nginx-practice --replicas=2 -n devops-practice"
    Write-Host ""
}

# Function to practice debugging
function Show-DebuggingCommands {
    Write-Host "🐛 Learning Debugging" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Check pod logs:" -ForegroundColor Yellow
    Write-Host "kubectl logs -l app=nginx-practice -n devops-practice"
    Write-Host ""
    
    Write-Host "2. Execute commands in pod:" -ForegroundColor Yellow
    Write-Host "kubectl exec -it <pod-name> -n devops-practice -- /bin/sh"
    Write-Host ""
    
    Write-Host "3. Port forward for testing:" -ForegroundColor Yellow
    Write-Host "kubectl port-forward service/nginx-practice-service 8080:80 -n devops-practice"
    Write-Host "Then visit: http://localhost:8080"
    Write-Host ""
}

# Function to practice cleanup
function Show-CleanupCommands {
    Write-Host "🧹 Learning Cleanup" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Delete deployment:" -ForegroundColor Yellow
    Write-Host "kubectl delete deployment nginx-practice -n devops-practice"
    Write-Host ""
    
    Write-Host "2. Delete service:" -ForegroundColor Yellow
    Write-Host "kubectl delete service nginx-practice-service -n devops-practice"
    Write-Host ""
    
    Write-Host "3. Delete namespace (deletes everything):" -ForegroundColor Yellow
    Write-Host "kubectl delete namespace devops-practice"
    Write-Host ""
}

# Main execution
function Start-KubernetesPractice {
    Test-Kubectl
    
    if (Test-Cluster) {
        Write-Host ""
        Show-BasicCommands
        Write-Host ""
        Show-DeploymentCommands
        Write-Host ""
        Show-ScalingCommands
        Write-Host ""
        Show-DebuggingCommands
        Write-Host ""
        Show-CleanupCommands
        Write-Host ""
        Write-Host "🎉 Kubernetes practice complete!" -ForegroundColor Green
        Write-Host "💡 Try running these commands one by one to learn!" -ForegroundColor Yellow
    }
    else {
        Write-Host ""
        Show-BasicCommands
        Write-Host ""
        Write-Host "Once you have a cluster running, come back and practice!" -ForegroundColor Yellow
    }
}

# Run the main function
Start-KubernetesPractice
