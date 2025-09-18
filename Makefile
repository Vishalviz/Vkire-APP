# VK App Makefile for DevOps Tasks

.PHONY: help install test lint build deploy clean docker-build docker-up docker-down migrate

# Default target
help: ## Show this help message
	@echo "VK App DevOps Commands"
	@echo "====================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
install: ## Install dependencies
	cd VKApp && npm install

test: ## Run tests
	cd VKApp && npm test

test:watch: ## Run tests in watch mode
	cd VKApp && npm run test:watch

test:coverage: ## Run tests with coverage
	cd VKApp && npm run test:coverage

lint: ## Run linter
	cd VKApp && npm run lint

lint:fix: ## Fix linting issues
	cd VKApp && npm run lint:fix

format: ## Format code
	cd VKApp && npm run format

type-check: ## Run TypeScript type check
	cd VKApp && npm run type-check

# Building
build: ## Build the application
	cd VKApp && npm run build:web

build:android: ## Build Android APK
	cd VKApp && npm run build:android

build:ios: ## Build iOS app
	cd VKApp && npm run build:ios

# Docker
docker-build: ## Build Docker image
	docker build -t vkapp ./VKApp

docker-build:dev: ## Build development Docker image
	docker build --target dev -t vkapp:dev ./VKApp

docker-build:prod: ## Build production Docker image
	docker build --target production -t vkapp:prod ./VKApp

docker-up: ## Start Docker containers
	docker-compose up -d

docker-up:dev: ## Start development containers
	docker-compose up -d vkapp-dev

docker-up:prod: ## Start production containers
	docker-compose --profile production up -d

docker-up:monitoring: ## Start monitoring stack
	docker-compose --profile monitoring up -d

docker-up:logging: ## Start logging stack
	docker-compose --profile logging up -d

docker-down: ## Stop all containers
	docker-compose down

docker-logs: ## View application logs
	docker-compose logs -f vkapp-dev

docker-shell: ## Open shell in development container
	docker-compose exec vkapp-dev sh

# Database
migrate: ## Run database migrations
	./scripts/migrate.sh

migrate:create: ## Create new migration file
	@read -p "Enter migration name: " name; \
	touch database/migrations/$$(date +%Y%m%d_%H%M%S)_$$name.sql

# Deployment
deploy: ## Deploy to staging
	./scripts/deploy.sh latest staging

deploy:prod: ## Deploy to production
	./scripts/deploy.sh latest production

deploy:version: ## Deploy specific version (usage: make deploy:version VERSION=1.0.0)
	./scripts/deploy.sh $(VERSION) production

# Monitoring
monitor: ## Start monitoring stack
	docker-compose --profile monitoring up -d
	@echo "Grafana: http://localhost:3000 (admin/admin)"
	@echo "Prometheus: http://localhost:9090"

logs: ## Start logging stack
	docker-compose --profile logging up -d
	@echo "Kibana: http://localhost:5601"

# Cleanup
clean: ## Clean up Docker resources
	docker system prune -f
	docker volume prune -f

clean:all: ## Clean up all Docker resources (including images)
	docker system prune -a -f
	docker volume prune -f

# Development workflow
dev: ## Start development environment
	docker-compose up -d vkapp-dev redis
	@echo "Development environment started"
	@echo "App: http://localhost:8081"

dev:full: ## Start full development environment with monitoring
	docker-compose --profile monitoring up -d
	@echo "Full development environment started"
	@echo "App: http://localhost:8081"
	@echo "Grafana: http://localhost:3000"
	@echo "Prometheus: http://localhost:9090"

# Quality checks
quality: ## Run all quality checks
	cd VKApp && npm run lint && npm run type-check && npm test

precommit: ## Run pre-commit checks
	cd VKApp && npm run precommit

# Health checks
health: ## Check application health
	curl -f http://localhost:8081/health || echo "Health check failed"

# Environment setup
setup: ## Initial project setup
	cp env.example .env
	@echo "Please edit .env file with your configuration"
	cd VKApp && npm install
	docker-compose up -d postgres
	./scripts/migrate.sh
	@echo "Setup complete! Run 'make dev' to start development"

# Backup
backup: ## Backup database
	@echo "Creating database backup..."
	docker-compose exec postgres pg_dump -U vkapp_user vkapp_dev > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup created"

# Restore
restore: ## Restore database from backup (usage: make restore BACKUP=backup_file.sql)
	@echo "Restoring database from $(BACKUP)..."
	docker-compose exec -T postgres psql -U vkapp_user vkapp_dev < $(BACKUP)
	@echo "Database restored"
