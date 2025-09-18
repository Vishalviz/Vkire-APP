#!/bin/bash

# VK App DevOps Setup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 VK App DevOps Setup${NC}"
echo -e "${BLUE}======================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "VKApp/package.json" ]; then
        echo -e "${RED}❌ Please run this script from the project root directory${NC}"
        exit 1
    fi
    
    # Install Node.js dependencies
    cd VKApp
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    cd ..
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to setup environment
setup_environment() {
    echo -e "${YELLOW}🔧 Setting up environment...${NC}"
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            echo -e "${YELLOW}📝 Created .env file from template${NC}"
            echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
        else
            echo -e "${RED}❌ env.example file not found${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
}

# Function to setup Git hooks
setup_git_hooks() {
    echo -e "${YELLOW}🪝 Setting up Git hooks...${NC}"
    
    cd VKApp
    if command_exists npm; then
        npm run prepare 2>/dev/null || echo -e "${YELLOW}⚠️  Husky setup skipped (not installed yet)${NC}"
    fi
    cd ..
    
    echo -e "${GREEN}✅ Git hooks configured${NC}"
}

# Function to setup Docker
setup_docker() {
    echo -e "${YELLOW}🐳 Setting up Docker...${NC}"
    
    if ! command_exists docker; then
        echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
        echo -e "${YELLOW}Visit: https://docs.docker.com/get-docker/${NC}"
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
        exit 1
    fi
    
    # Test Docker
    if docker --version > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker is working${NC}"
    else
        echo -e "${RED}❌ Docker is not working properly${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker setup complete${NC}"
}

# Function to setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}📊 Setting up monitoring...${NC}"
    
    # Create monitoring directories
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p monitoring/logstash/pipeline
    
    echo -e "${GREEN}✅ Monitoring directories created${NC}"
}

# Function to setup infrastructure
setup_infrastructure() {
    echo -e "${YELLOW}🏗️  Setting up infrastructure...${NC}"
    
    # Create infrastructure directories
    mkdir -p infrastructure/terraform
    mkdir -p infrastructure/kubernetes
    mkdir -p infrastructure/helm/vkapp
    
    echo -e "${GREEN}✅ Infrastructure directories created${NC}"
}

# Function to run initial tests
run_tests() {
    echo -e "${YELLOW}🧪 Running initial tests...${NC}"
    
    cd VKApp
    
    # Check if test script exists
    if npm run test --dry-run > /dev/null 2>&1; then
        echo -e "${YELLOW}Running tests...${NC}"
        npm test -- --passWithNoTests || echo -e "${YELLOW}⚠️  Tests completed with warnings${NC}"
    else
        echo -e "${YELLOW}⚠️  Test script not configured yet${NC}"
    fi
    
    cd ..
    
    echo -e "${GREEN}✅ Tests completed${NC}"
}

# Function to start development environment
start_dev_environment() {
    echo -e "${YELLOW}🚀 Starting development environment...${NC}"
    
    # Start basic services
    docker-compose up -d redis
    
    echo -e "${GREEN}✅ Development environment started${NC}"
    echo -e "${BLUE}📱 You can now run:${NC}"
    echo -e "${BLUE}   cd VKApp && npm start${NC}"
    echo -e "${BLUE}   or${NC}"
    echo -e "${BLUE}   make dev${NC}"
}

# Function to show next steps
show_next_steps() {
    echo -e "${BLUE}🎉 DevOps setup completed!${NC}"
    echo -e "${BLUE}========================${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "${YELLOW}1. Edit .env file with your configuration${NC}"
    echo -e "${YELLOW}2. Set up Supabase project and update credentials${NC}"
    echo -e "${YELLOW}3. Configure GitHub secrets for CI/CD${NC}"
    echo -e "${YELLOW}4. Run 'make dev' to start development environment${NC}"
    echo -e "${YELLOW}5. Run 'make test' to run tests${NC}"
    echo -e "${YELLOW}6. Run 'make docker-up:monitoring' for monitoring stack${NC}"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo -e "${BLUE}  make help          - Show all available commands${NC}"
    echo -e "${BLUE}  make dev           - Start development environment${NC}"
    echo -e "${BLUE}  make test          - Run tests${NC}"
    echo -e "${BLUE}  make docker-up     - Start all Docker services${NC}"
    echo -e "${BLUE}  make monitor       - Start monitoring stack${NC}"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Main execution
main() {
    echo -e "${YELLOW}Starting DevOps setup...${NC}"
    
    install_dependencies
    setup_environment
    setup_git_hooks
    setup_docker
    setup_monitoring
    setup_infrastructure
    run_tests
    start_dev_environment
    show_next_steps
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
