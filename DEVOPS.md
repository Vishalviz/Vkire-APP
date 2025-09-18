# VK App DevOps Guide

This document outlines the DevOps practices and infrastructure setup for the VK App project.

## 🏗️ Infrastructure Overview

### Technology Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Reverse Proxy**: Nginx
- **Cache**: Redis

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Git
- Expo CLI

### Local Development Setup

1. **Clone and setup environment**
   ```bash
   git clone <repository-url>
   cd VKApp
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Start development environment**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Or start only the app
   docker-compose up vkapp-dev
   ```

3. **Access services**
   - App: http://localhost:8081
   - Grafana: http://localhost:3000 (admin/admin)
   - Prometheus: http://localhost:9090
   - Kibana: http://localhost:5601

## 🔧 Development Workflow

### Code Quality Tools

#### ESLint Configuration
- TypeScript support
- React Native specific rules
- Custom rules for code quality

#### Prettier Configuration
- Consistent code formatting
- Integration with ESLint

#### Testing
- Jest for unit testing
- React Native Testing Library
- Coverage reporting

### Git Hooks (Husky)
```bash
# Install husky
npm run prepare

# Pre-commit hooks run:
# - ESLint
# - TypeScript check
# - Tests
# - Prettier formatting
```

## 🐳 Docker Configuration

### Multi-stage Dockerfile
- **Base**: Common dependencies
- **Dev**: Development environment with hot reload
- **Builder**: Production build
- **Production**: Optimized production image with Nginx

### Docker Compose Profiles
- `default`: Development services
- `production`: Production services
- `monitoring`: Prometheus, Grafana
- `logging`: ELK Stack
- `local-db`: Local PostgreSQL

### Usage Examples
```bash
# Development
docker-compose up vkapp-dev

# Production
docker-compose --profile production up

# With monitoring
docker-compose --profile monitoring up

# All services
docker-compose --profile production --profile monitoring --profile logging up
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

#### Jobs
1. **Lint & Type Check**
   - ESLint validation
   - TypeScript compilation check

2. **Unit Tests**
   - Jest test execution
   - Coverage reporting
   - Codecov integration

3. **Build Expo App**
   - Android APK build
   - iOS simulator build
   - Web export

4. **Security Scan**
   - npm audit
   - Snyk security scan

5. **Deploy to Staging** (develop branch)
   - Expo publish
   - Slack notifications

6. **Deploy to Production** (main branch)
   - App store builds
   - Store uploads
   - Slack notifications

### Required Secrets
```bash
# GitHub Repository Secrets
EXPO_TOKEN=your_expo_token
SNYK_TOKEN=your_snyk_token
SLACK_WEBHOOK=your_slack_webhook
APPLE_API_KEY_ID=your_apple_api_key
APPLE_ISSUER_ID=your_apple_issuer_id
GOOGLE_PLAY_SERVICE_ACCOUNT=your_google_play_service_account
```

## 📊 Monitoring & Observability

### Prometheus Metrics
- Application performance metrics
- System resource usage
- Custom business metrics

### Grafana Dashboards
- Application overview
- System performance
- Error rates and response times
- User engagement metrics

### Logging with ELK Stack
- Centralized log collection
- Log parsing and indexing
- Search and visualization
- Alerting on errors

### Health Checks
- Application health endpoint
- Database connectivity
- External service status

## 🗄️ Database Management

### Migration Strategy
- Version-controlled schema changes
- Automated migration execution
- Rollback capabilities

### Backup Strategy
- Automated daily backups
- Point-in-time recovery
- Cross-region replication

### Usage
```bash
# Run migrations
./scripts/migrate.sh

# Create new migration
touch database/migrations/$(date +%Y%m%d_%H%M%S)_migration_name.sql
```

## 🚀 Deployment

### Environments
- **Development**: Local Docker setup
- **Staging**: Automated deployment from develop branch
- **Production**: Automated deployment from main branch

### Deployment Scripts
```bash
# Linux/Mac
./scripts/deploy.sh [version] [environment]

# Windows
.\scripts\deploy.ps1 -Version [version] -Environment [environment]
```

### Rollback Strategy
- Blue-green deployments
- Database migration rollbacks
- Container image rollbacks

## 🔒 Security

### Container Security
- Multi-stage builds to minimize attack surface
- Non-root user execution
- Regular base image updates

### Application Security
- Environment variable management
- Secrets management
- HTTPS enforcement
- Rate limiting

### Infrastructure Security
- Network segmentation
- Firewall rules
- SSL/TLS certificates
- Security headers

## 📈 Performance Optimization

### Frontend Optimization
- Code splitting
- Image optimization
- Bundle size monitoring
- Performance budgets

### Backend Optimization
- Database query optimization
- Caching strategies
- CDN integration
- Load balancing

### Infrastructure Optimization
- Resource monitoring
- Auto-scaling
- Cost optimization
- Performance testing

## 🛠️ Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Clean up Docker
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose up --build
```

#### Database Issues
```bash
# Check database connection
./scripts/migrate.sh

# Reset database
docker-compose down
docker volume rm appli_postgres_data
docker-compose up -d postgres
```

#### Build Issues
```bash
# Clear npm cache
npm cache clean --force

# Clear Expo cache
npx expo r -c
```

### Logs and Debugging
```bash
# View application logs
docker-compose logs vkapp-dev

# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f vkapp-dev
```

## 📚 Additional Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### Tools
- [Prometheus](https://prometheus.io/)
- [Grafana](https://grafana.com/)
- [ELK Stack](https://www.elastic.co/elastic-stack/)

### Best Practices
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [CI/CD Best Practices](https://docs.github.com/en/actions/learn-github-actions)

## 🤝 Contributing

1. Follow the established coding standards
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages
5. Ensure all CI checks pass

## 📞 Support

For DevOps-related issues:
- Check the troubleshooting section
- Review logs and monitoring dashboards
- Create an issue in the repository
- Contact the DevOps team
