#!/bin/bash

# Blue-Green Deployment Script for VK App
set -e

# Configuration
CLUSTER_NAME="vkapp-production"
SERVICE_NAME="vkapp-service"
NEW_TASK_DEFINITION="vkapp-task-definition"
BLUE_SERVICE="vkapp-blue-service"
GREEN_SERVICE="vkapp-green-service"
TARGET_GROUP_BLUE="vkapp-blue-tg"
TARGET_GROUP_GREEN="vkapp-green-tg"
LOAD_BALANCER_ARN="vkapp-alb"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Blue-Green Deployment${NC}"

# Function to check service health
check_service_health() {
    local service_name=$1
    local target_group=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}🔍 Checking health of $service_name...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        # Check if all targets are healthy
        healthy_count=$(aws elbv2 describe-target-health \
            --target-group-arn $target_group \
            --query 'TargetHealthDescriptions[?TargetHealth.State==`healthy`].length' \
            --output text)
        
        total_count=$(aws elbv2 describe-target-health \
            --target-group-arn $target_group \
            --query 'TargetHealthDescriptions.length' \
            --output text)
        
        if [ "$healthy_count" = "$total_count" ] && [ "$total_count" -gt 0 ]; then
            echo -e "${GREEN}✅ $service_name is healthy ($healthy_count/$total_count)${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Waiting for $service_name... ($healthy_count/$total_count healthy)${NC}"
        sleep 10
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service_name health check failed${NC}"
    return 1
}

# Function to switch traffic
switch_traffic() {
    local primary_tg=$1
    local secondary_tg=$2
    
    echo -e "${BLUE}🔄 Switching traffic to green environment...${NC}"
    
    # Update listener rules to route traffic to green
    aws elbv2 modify-rule \
        --rule-arn $(aws elbv2 describe-rules \
            --listener-arn $(aws elbv2 describe-listeners \
                --load-balancer-arn $LOAD_BALANCER_ARN \
                --query 'Listeners[0].ListenerArn' \
                --output text) \
            --query 'Rules[?Priority==`100`].RuleArn' \
            --output text) \
        --actions Type=forward,TargetGroupArn=$primary_tg
    
    echo -e "${GREEN}✅ Traffic switched to green environment${NC}"
}

# Function to rollback
rollback_traffic() {
    local primary_tg=$1
    local secondary_tg=$2
    
    echo -e "${RED}🔄 Rolling back to blue environment...${NC}"
    
    # Switch back to blue
    aws elbv2 modify-rule \
        --rule-arn $(aws elbv2 describe-rules \
            --listener-arn $(aws elbv2 describe-listeners \
                --load-balancer-arn $LOAD_BALANCER_ARN \
                --query 'Listeners[0].ListenerArn' \
                --output text) \
            --query 'Rules[?Priority==`100`].RuleArn' \
            --output text) \
        --actions Type=forward,TargetGroupArn=$secondary_tg
    
    echo -e "${GREEN}✅ Rollback completed${NC}"
}

# Main deployment logic
main() {
    # Get current active service
    CURRENT_SERVICE=$(aws ecs describe-services \
        --cluster $CLUSTER_NAME \
        --services $BLUE_SERVICE $GREEN_SERVICE \
        --query 'services[?status==`ACTIVE`].serviceName' \
        --output text)
    
    if [ "$CURRENT_SERVICE" = "$BLUE_SERVICE" ]; then
        PRIMARY_SERVICE=$GREEN_SERVICE
        SECONDARY_SERVICE=$BLUE_SERVICE
        PRIMARY_TG=$TARGET_GROUP_GREEN
        SECONDARY_TG=$TARGET_GROUP_BLUE
        echo -e "${BLUE}📘 Currently on BLUE, deploying to GREEN${NC}"
    else
        PRIMARY_SERVICE=$BLUE_SERVICE
        SECONDARY_SERVICE=$GREEN_SERVICE
        PRIMARY_TG=$TARGET_GROUP_BLUE
        SECONDARY_TG=$TARGET_GROUP_GREEN
        echo -e "${GREEN}📗 Currently on GREEN, deploying to BLUE${NC}"
    fi
    
    # Deploy to inactive service
    echo -e "${BLUE}🚀 Deploying to $PRIMARY_SERVICE...${NC}"
    
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service $PRIMARY_SERVICE \
        --task-definition $NEW_TASK_DEFINITION \
        --force-new-deployment
    
    # Wait for deployment to complete
    echo -e "${YELLOW}⏳ Waiting for deployment to complete...${NC}"
    aws ecs wait services-stable \
        --cluster $CLUSTER_NAME \
        --services $PRIMARY_SERVICE
    
    # Health check
    if check_service_health $PRIMARY_SERVICE $PRIMARY_TG; then
        # Switch traffic
        switch_traffic $PRIMARY_TG $SECONDARY_TG
        
        # Final health check after traffic switch
        sleep 30
        if check_service_health $PRIMARY_SERVICE $PRIMARY_TG; then
            echo -e "${GREEN}🎉 Blue-Green deployment successful!${NC}"
            
            # Scale down old service to save costs
            echo -e "${YELLOW}💰 Scaling down old service...${NC}"
            aws ecs update-service \
                --cluster $CLUSTER_NAME \
                --service $SECONDARY_SERVICE \
                --desired-count 0
            
            exit 0
        else
            echo -e "${RED}❌ Health check failed after traffic switch${NC}"
            rollback_traffic $SECONDARY_TG $PRIMARY_TG
            exit 1
        fi
    else
        echo -e "${RED}❌ Health check failed, rolling back...${NC}"
        rollback_traffic $SECONDARY_TG $PRIMARY_TG
        exit 1
    fi
}

# Run main function
main "$@"
