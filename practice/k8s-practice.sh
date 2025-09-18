#!/bin/bash

# DevOps Learning - Kubernetes Practice Script
# This script teaches you Kubernetes fundamentals through hands-on practice

echo "🚀 DevOps Learning - Kubernetes Practice"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl is not installed${NC}"
        echo -e "${YELLOW}Please install kubectl first${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ kubectl is available${NC}"
}

# Function to check cluster connection
check_cluster() {
    echo -e "${YELLOW}🔍 Checking Kubernetes cluster connection...${NC}"
    if kubectl cluster-info &> /dev/null; then
        echo -e "${GREEN}✅ Connected to Kubernetes cluster${NC}"
        kubectl cluster-info
        return 0
    else
        echo -e "${RED}❌ No Kubernetes cluster available${NC}"
        echo -e "${YELLOW}💡 To start a local cluster:${NC}"
        echo -e "${YELLOW}   1. Start Docker Desktop${NC}"
        echo -e "${YELLOW}   2. Enable Kubernetes in Docker Desktop settings${NC}"
        echo -e "${YELLOW}   3. Or use: minikube start${NC}"
        return 1
    fi
}

# Function to practice basic kubectl commands
practice_basics() {
    echo -e "${BLUE}📚 Learning Basic kubectl Commands${NC}"
    echo ""
    
    echo -e "${YELLOW}1. Get cluster information:${NC}"
    echo "kubectl cluster-info"
    echo ""
    
    echo -e "${YELLOW}2. Get nodes (servers in the cluster):${NC}"
    echo "kubectl get nodes"
    echo ""
    
    echo -e "${YELLOW}3. Get all resources in default namespace:${NC}"
    echo "kubectl get all"
    echo ""
    
    echo -e "${YELLOW}4. Get namespaces:${NC}"
    echo "kubectl get namespaces"
    echo ""
}

# Function to practice deployment
practice_deployment() {
    echo -e "${BLUE}🚀 Learning Deployment Management${NC}"
    echo ""
    
    echo -e "${YELLOW}1. Apply our practice deployment:${NC}"
    echo "kubectl apply -f practice/nginx-practice.yaml"
    echo ""
    
    echo -e "${YELLOW}2. Check deployment status:${NC}"
    echo "kubectl get deployments -n devops-practice"
    echo ""
    
    echo -e "${YELLOW}3. Check pods (running containers):${NC}"
    echo "kubectl get pods -n devops-practice"
    echo ""
    
    echo -e "${YELLOW}4. Check services:${NC}"
    echo "kubectl get services -n devops-practice"
    echo ""
    
    echo -e "${YELLOW}5. Get detailed information:${NC}"
    echo "kubectl describe deployment nginx-practice -n devops-practice"
    echo ""
}

# Function to practice scaling
practice_scaling() {
    echo -e "${BLUE}📈 Learning Scaling${NC}"
    echo ""
    
    echo -e "${YELLOW}1. Scale up to 5 replicas:${NC}"
    echo "kubectl scale deployment nginx-practice --replicas=5 -n devops-practice"
    echo ""
    
    echo -e "${YELLOW}2. Check scaling progress:${NC}"
    echo "kubectl get pods -n devops-practice -w"
    echo ""
    
    echo -e "${YELLOW}3. Scale back down:${NC}"
    echo "kubectl scale deployment nginx-practice --replicas=2 -n devops-practice"
    echo ""
}

# Function to practice debugging
practice_debugging() {
    echo -e "${BLUE}🐛 Learning Debugging${NC}"
    echo ""
    
    echo -e "${YELLOW}1. Check pod logs:${NC}"
    echo "kubectl logs -l app=nginx-practice -n devops-practice"
    echo ""
    
    echo -e "${YELLOW}2. Execute commands in pod:${NC}"
    echo "kubectl exec -it <pod-name> -n devops-practice -- /bin/sh"
    echo ""
    
    echo -e "${YELLOW}3. Port forward for testing:${NC}"
    echo "kubectl port-forward service/nginx-practice-service 8080:80 -n devops-practice"
    echo "Then visit: http://localhost:8080"
    echo ""
}

# Function to practice cleanup
practice_cleanup() {
    echo -e "${BLUE}🧹 Learning Cleanup${NC}"
    echo ""
    
    echo -e "${YELLOW}1. Delete deployment:${NC}"
    echo "kubectl delete deployment nginx-practice -n devops-practice"
    echo ""
    
    echo -e "${YELLOW}2. Delete service:${NC}"
    echo "kubectl delete service nginx-practice-service -n devops-practice"
    echo ""
    
    echo -e "${YELLOW}3. Delete namespace (deletes everything):${NC}"
    echo "kubectl delete namespace devops-practice"
    echo ""
}

# Main execution
main() {
    check_kubectl
    
    if check_cluster; then
        echo ""
        practice_basics
        echo ""
        practice_deployment
        echo ""
        practice_scaling
        echo ""
        practice_debugging
        echo ""
        practice_cleanup
        echo ""
        echo -e "${GREEN}🎉 Kubernetes practice complete!${NC}"
        echo -e "${YELLOW}💡 Try running these commands one by one to learn!${NC}"
    else
        echo ""
        practice_basics
        echo ""
        echo -e "${YELLOW}💡 Once you have a cluster running, come back and practice!${NC}"
    fi
}

# Run the main function
main
