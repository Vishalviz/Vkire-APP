#!/bin/bash

# Production Health Check Script
set -e

# Configuration
PRODUCTION_URL="https://production.vkapp.com"
STAGING_URL="https://staging.vkapp.com"
MAX_RESPONSE_TIME=2000  # 2 seconds
MIN_SUCCESS_RATE=95     # 95%

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 Starting Production Health Checks${NC}"

# Function to check endpoint
check_endpoint() {
    local url=$1
    local endpoint=$2
    local expected_status=$3
    
    local full_url="${url}${endpoint}"
    local response=$(curl -s -w "%{http_code}|%{time_total}" -o /dev/null "$full_url")
    local status_code=$(echo "$response" | cut -d'|' -f1)
    local response_time=$(echo "$response" | cut -d'|' -f2)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ $endpoint: $status_code (${response_time}s)${NC}"
        return 0
    else
        echo -e "${RED}❌ $endpoint: $status_code (${response_time}s) - Expected: $expected_status${NC}"
        return 1
    fi
}

# Function to check response time
check_response_time() {
    local url=$1
    local endpoint=$2
    local max_time=$3
    
    local full_url="${url}${endpoint}"
    local response_time=$(curl -s -w "%{time_total}" -o /dev/null "$full_url")
    local time_ms=$(echo "$response_time * 1000" | bc)
    
    if (( $(echo "$time_ms < $max_time" | bc -l) )); then
        echo -e "${GREEN}✅ $endpoint response time: ${time_ms}ms${NC}"
        return 0
    else
        echo -e "${RED}❌ $endpoint response time: ${time_ms}ms (max: ${max_time}ms)${NC}"
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    echo -e "${BLUE}🔍 Checking database connectivity...${NC}"
    
    # Check if database endpoint is accessible
    local db_response=$(curl -s -w "%{http_code}" -o /dev/null "${PRODUCTION_URL}/api/health/db")
    
    if [ "$db_response" = "200" ]; then
        echo -e "${GREEN}✅ Database connectivity: OK${NC}"
        return 0
    else
        echo -e "${RED}❌ Database connectivity: FAILED${NC}"
        return 1
    fi
}

# Function to check external dependencies
check_dependencies() {
    echo -e "${BLUE}🔍 Checking external dependencies...${NC}"
    
    local dependencies=(
        "https://api.stripe.com/v1/health"
        "https://api.sendgrid.com/v3/user/profile"
        "https://api.twilio.com/2010-04-01/Accounts.json"
    )
    
    local failed=0
    
    for dep in "${dependencies[@]}"; do
        local response=$(curl -s -w "%{http_code}" -o /dev/null "$dep")
        if [ "$response" = "200" ]; then
            echo -e "${GREEN}✅ External dependency: OK${NC}"
        else
            echo -e "${RED}❌ External dependency: FAILED${NC}"
            ((failed++))
        fi
    done
    
    return $failed
}

# Function to run load test
run_load_test() {
    echo -e "${BLUE}🚀 Running quick load test...${NC}"
    
    # Simple load test with curl
    local success_count=0
    local total_requests=10
    
    for i in $(seq 1 $total_requests); do
        local response=$(curl -s -w "%{http_code}" -o /dev/null "$PRODUCTION_URL/")
        if [ "$response" = "200" ]; then
            ((success_count++))
        fi
        sleep 0.1
    done
    
    local success_rate=$((success_count * 100 / total_requests))
    
    if [ $success_rate -ge $MIN_SUCCESS_RATE ]; then
        echo -e "${GREEN}✅ Load test: $success_rate% success rate${NC}"
        return 0
    else
        echo -e "${RED}❌ Load test: $success_rate% success rate (min: ${MIN_SUCCESS_RATE}%)${NC}"
        return 1
    fi
}

# Function to check SSL certificate
check_ssl() {
    echo -e "${BLUE}🔒 Checking SSL certificate...${NC}"
    
    local ssl_info=$(echo | openssl s_client -servername production.vkapp.com -connect production.vkapp.com:443 2>/dev/null | openssl x509 -noout -dates)
    local expiry_date=$(echo "$ssl_info" | grep "notAfter" | cut -d= -f2)
    local expiry_timestamp=$(date -d "$expiry_date" +%s)
    local current_timestamp=$(date +%s)
    local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
    
    if [ $days_until_expiry -gt 30 ]; then
        echo -e "${GREEN}✅ SSL certificate: Valid for $days_until_expiry days${NC}"
        return 0
    else
        echo -e "${RED}❌ SSL certificate: Expires in $days_until_expiry days${NC}"
        return 1
    fi
}

# Function to check monitoring systems
check_monitoring() {
    echo -e "${BLUE}📊 Checking monitoring systems...${NC}"
    
    # Check CloudWatch alarms
    local alarm_count=$(aws cloudwatch describe-alarms \
        --alarm-names "vkapp-production-*" \
        --state-value ALARM \
        --query 'MetricAlarms.length' \
        --output text)
    
    if [ "$alarm_count" = "0" ]; then
        echo -e "${GREEN}✅ CloudWatch alarms: No active alarms${NC}"
        return 0
    else
        echo -e "${RED}❌ CloudWatch alarms: $alarm_count active alarms${NC}"
        return 1
    fi
}

# Main health check function
main() {
    local overall_status=0
    
    echo -e "${BLUE}🔍 Running comprehensive health checks...${NC}"
    
    # Basic endpoint checks
    echo -e "\n${YELLOW}📋 Basic Endpoint Checks${NC}"
    check_endpoint "$PRODUCTION_URL" "/" "200" || ((overall_status++))
    check_endpoint "$PRODUCTION_URL" "/api/health" "200" || ((overall_status++))
    check_endpoint "$PRODUCTION_URL" "/api/version" "200" || ((overall_status++))
    
    # Response time checks
    echo -e "\n${YELLOW}⏱️ Response Time Checks${NC}"
    check_response_time "$PRODUCTION_URL" "/" "1000" || ((overall_status++))
    check_response_time "$PRODUCTION_URL" "/api/health" "500" || ((overall_status++))
    
    # Database check
    echo -e "\n${YELLOW}🗄️ Database Checks${NC}"
    check_database || ((overall_status++))
    
    # External dependencies
    echo -e "\n${YELLOW}🔗 External Dependencies${NC}"
    check_dependencies || ((overall_status++))
    
    # Load test
    echo -e "\n${YELLOW}🚀 Load Testing${NC}"
    run_load_test || ((overall_status++))
    
    # SSL check
    echo -e "\n${YELLOW}🔒 Security Checks${NC}"
    check_ssl || ((overall_status++))
    
    # Monitoring check
    echo -e "\n${YELLOW}📊 Monitoring Checks${NC}"
    check_monitoring || ((overall_status++))
    
    # Summary
    echo -e "\n${BLUE}📋 Health Check Summary${NC}"
    if [ $overall_status -eq 0 ]; then
        echo -e "${GREEN}🎉 All health checks passed! Production is healthy.${NC}"
        exit 0
    else
        echo -e "${RED}❌ $overall_status health check(s) failed. Production may have issues.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"
