# DevOps Learning - Deployment Strategies & Rollbacks

## 🎯 What are Deployment Strategies?

**Deployment strategies** are methods for releasing new versions of applications with minimal downtime and risk.

### Goals of Deployment Strategies:
- **Zero Downtime**: Keep application available during deployment
- **Risk Mitigation**: Reduce impact of failed deployments
- **Quick Rollback**: Ability to revert to previous version
- **Gradual Rollout**: Test new version with subset of users

## 🚀 Common Deployment Strategies

### 1. Rolling Deployment
**How it works**: Replace instances one by one
- **Pros**: Zero downtime, simple to implement
- **Cons**: Temporary inconsistency, longer deployment time
- **Use case**: Stateless applications, microservices

### 2. Blue-Green Deployment
**How it works**: Maintain two identical environments
- **Blue**: Current production environment
- **Green**: New version environment
- **Switch**: Traffic routing changes instantly
- **Pros**: Instant rollback, zero downtime
- **Cons**: Requires double infrastructure, complex setup

### 3. Canary Deployment
**How it works**: Gradual rollout to subset of users
- **Phase 1**: Deploy to 5% of users
- **Phase 2**: Monitor metrics and feedback
- **Phase 3**: Gradually increase to 100%
- **Pros**: Risk mitigation, real user testing
- **Cons**: Complex traffic routing, longer rollout

### 4. A/B Testing Deployment
**How it works**: Run multiple versions simultaneously
- **Version A**: Current version (control)
- **Version B**: New version (test)
- **Traffic Split**: Based on user segments
- **Pros**: Data-driven decisions, feature validation
- **Cons**: Complex analysis, longer testing period

### 5. Shadow Deployment
**How it works**: Run new version alongside current
- **Production**: Current version handles all traffic
- **Shadow**: New version processes same requests
- **Comparison**: Compare outputs and performance
- **Pros**: Safe testing, performance validation
- **Cons**: Resource intensive, complex setup

## 🔄 Rollback Strategies

### 1. Immediate Rollback
- **Trigger**: Critical errors, performance degradation
- **Method**: Instant traffic switch
- **Time**: Seconds to minutes
- **Use case**: Blue-green deployments

### 2. Gradual Rollback
- **Trigger**: Minor issues, user complaints
- **Method**: Reduce traffic to new version
- **Time**: Minutes to hours
- **Use case**: Canary deployments

### 3. Database Rollback
- **Trigger**: Data corruption, schema issues
- **Method**: Restore from backup
- **Time**: Minutes to hours
- **Use case**: Database migrations

### 4. Feature Flag Rollback
- **Trigger**: Feature-specific issues
- **Method**: Disable feature flags
- **Time**: Seconds
- **Use case**: Feature toggles

## 🛠️ Implementation Examples

### Kubernetes Rolling Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vkapp-deployment
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
```

### Docker Compose Blue-Green
```yaml
version: '3.8'
services:
  app-blue:
    image: vkapp:blue
    ports:
      - "8080:8080"
  
  app-green:
    image: vkapp:green
    ports:
      - "8081:8080"
  
  nginx:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### Feature Flags Example
```javascript
// Feature flag configuration
const features = {
  newPaymentFlow: process.env.FEATURE_NEW_PAYMENT === 'true',
  darkMode: process.env.FEATURE_DARK_MODE === 'true'
};

// Usage in application
if (features.newPaymentFlow) {
  // New payment implementation
} else {
  // Legacy payment implementation
}
```

## 📊 Monitoring & Metrics

### Key Metrics to Monitor:
1. **Error Rate**: Percentage of failed requests
2. **Response Time**: Average and P95 latency
3. **Throughput**: Requests per second
4. **Availability**: Uptime percentage
5. **User Experience**: Page load times, conversion rates

### Alerting Thresholds:
- **Critical**: Error rate > 5%, Response time > 2s
- **Warning**: Error rate > 1%, Response time > 1s
- **Info**: Deployment started, completed

## 🎯 Best Practices

### 1. Pre-Deployment Checklist
- [ ] Code review completed
- [ ] Tests passing (unit, integration, e2e)
- [ ] Security scan passed
- [ ] Performance testing completed
- [ ] Database migrations tested
- [ ] Rollback plan prepared

### 2. Deployment Process
1. **Backup**: Create backups of critical data
2. **Health Checks**: Verify application health
3. **Monitoring**: Set up real-time monitoring
4. **Gradual Rollout**: Start with small percentage
5. **Validation**: Monitor key metrics
6. **Completion**: Full rollout or rollback

### 3. Post-Deployment
- **Monitoring**: Watch metrics for 30+ minutes
- **Validation**: Test critical user journeys
- **Documentation**: Update deployment logs
- **Cleanup**: Remove old versions and resources

## 🚨 Common Deployment Issues

### 1. Database Migration Failures
- **Problem**: Schema changes break application
- **Solution**: Backward-compatible migrations, rollback scripts

### 2. Configuration Mismatches
- **Problem**: Environment-specific config issues
- **Solution**: Configuration management, validation

### 3. Resource Constraints
- **Problem**: Insufficient resources for new version
- **Solution**: Capacity planning, auto-scaling

### 4. Dependency Failures
- **Problem**: External service dependencies fail
- **Solution**: Circuit breakers, fallback mechanisms

## 🎯 Hands-on Exercises

### Exercise 1: Rolling Deployment
1. Create a simple web application
2. Deploy using rolling update strategy
3. Monitor the deployment process
4. Practice rollback procedures

### Exercise 2: Blue-Green Setup
1. Set up two identical environments
2. Configure load balancer for traffic switching
3. Practice instant rollback
4. Test zero-downtime deployment

### Exercise 3: Canary Deployment
1. Implement traffic splitting
2. Deploy to 10% of users
3. Monitor metrics and feedback
4. Gradually increase rollout

### Exercise 4: Feature Flags
1. Implement feature flag system
2. Deploy new feature behind flag
3. Test with subset of users
4. Practice instant feature rollback

## 📚 Tools and Technologies

### Deployment Tools:
- **Kubernetes**: Container orchestration
- **Docker**: Containerization
- **Jenkins**: CI/CD automation
- **GitHub Actions**: CI/CD pipelines
- **ArgoCD**: GitOps deployment

### Monitoring Tools:
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **ELK Stack**: Log analysis
- **Jaeger**: Distributed tracing

### Feature Flag Tools:
- **LaunchDarkly**: Feature management
- **Split.io**: Feature experimentation
- **Unleash**: Open-source feature flags

## 🎯 Next Steps

1. **Start Simple**: Begin with rolling deployments
2. **Add Monitoring**: Implement comprehensive monitoring
3. **Practice Rollbacks**: Regular rollback drills
4. **Implement Feature Flags**: Gradual feature rollouts
5. **Advanced Strategies**: Blue-green, canary deployments

## 📚 Additional Resources

- [Kubernetes Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Blue-Green Deployment Guide](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Canary Deployment Best Practices](https://cloud.google.com/architecture/application-deployment-and-testing-strategies)
- [Feature Flag Patterns](https://martinfowler.com/articles/feature-toggles.html)
