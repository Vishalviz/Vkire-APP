#!/bin/bash

# VK App Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="vkapp"
DOCKER_REGISTRY="your-registry.com"
VERSION=${1:-latest}
ENVIRONMENT=${2:-staging}

echo -e "${GREEN}🚀 Starting deployment of VK App${NC}"
echo -e "${YELLOW}Version: ${VERSION}${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Build Docker image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
cd VKApp

if [ "$ENVIRONMENT" = "production" ]; then
    docker build --target production -t ${DOCKER_REGISTRY}/${APP_NAME}:${VERSION} .
    docker build --target production -t ${DOCKER_REGISTRY}/${APP_NAME}:latest .
else
    docker build --target dev -t ${DOCKER_REGISTRY}/${APP_NAME}:${VERSION} .
    docker build --target dev -t ${DOCKER_REGISTRY}/${APP_NAME}:latest .
fi

echo -e "${GREEN}✅ Docker image built successfully${NC}"

# Push to registry
echo -e "${YELLOW}📤 Pushing image to registry...${NC}"
docker push ${DOCKER_REGISTRY}/${APP_NAME}:${VERSION}
docker push ${DOCKER_REGISTRY}/${APP_NAME}:latest

echo -e "${GREEN}✅ Image pushed to registry${NC}"

# Deploy using docker-compose
echo -e "${YELLOW}🚀 Deploying application...${NC}"
cd ..

if [ "$ENVIRONMENT" = "production" ]; then
    docker-compose --profile production up -d
else
    docker-compose up -d vkapp-dev
fi

echo -e "${GREEN}✅ Application deployed successfully${NC}"

# Health check
echo -e "${YELLOW}🏥 Performing health check...${NC}"
sleep 10

if curl -f http://localhost:8081/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

# Cleanup old images
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}Application is available at: http://localhost:8081${NC}"
