# DevOps Learning - Monitoring & Observability Practice
Write-Host "DevOps Learning - Monitoring & Observability Practice" -ForegroundColor Blue
Write-Host "===================================================" -ForegroundColor Blue

# Function to show monitoring concepts
function Show-MonitoringConcepts {
    Write-Host "Monitoring & Observability Concepts:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Metrics (Prometheus)" -ForegroundColor Yellow
    Write-Host "   - Numerical data over time" -ForegroundColor White
    Write-Host "   - CPU usage, memory, response times" -ForegroundColor White
    Write-Host "   - Stored as time-series data" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. Logs (ELK Stack)" -ForegroundColor Yellow
    Write-Host "   - Text records of events" -ForegroundColor White
    Write-Host "   - Application logs, system logs" -ForegroundColor White
    Write-Host "   - Searchable and analyzable" -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Traces (Distributed Tracing)" -ForegroundColor Yellow
    Write-Host "   - Following requests through systems" -ForegroundColor White
    Write-Host "   - Performance bottleneck identification" -ForegroundColor White
    Write-Host "   - Microservices debugging" -ForegroundColor White
    Write-Host ""
}

# Function to show our monitoring stack
function Show-MonitoringStack {
    Write-Host "Our Monitoring Stack:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Prometheus (Metrics Collection)" -ForegroundColor Cyan
    Write-Host "  - Collects metrics from applications" -ForegroundColor White
    Write-Host "  - Stores time-series data" -ForegroundColor White
    Write-Host "  - Provides query language (PromQL)" -ForegroundColor White
    Write-Host "  - URL: http://localhost:9090" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Grafana (Visualization)" -ForegroundColor Cyan
    Write-Host "  - Creates beautiful dashboards" -ForegroundColor White
    Write-Host "  - Multiple data source support" -ForegroundColor White
    Write-Host "  - Alerting and notifications" -ForegroundColor White
    Write-Host "  - URL: http://localhost:3000 (admin/admin)" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Redis (Caching & Sessions)" -ForegroundColor Cyan
    Write-Host "  - In-memory data store" -ForegroundColor White
    Write-Host "  - Session management" -ForegroundColor White
    Write-Host "  - Performance monitoring" -ForegroundColor White
    Write-Host "  - Port: 6379" -ForegroundColor Green
    Write-Host ""
}

# Function to show key metrics
function Show-KeyMetrics {
    Write-Host "Key Metrics to Monitor:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Application Metrics:" -ForegroundColor Yellow
    Write-Host "  - Response Time: How fast your app responds" -ForegroundColor White
    Write-Host "  - Throughput: Requests per second" -ForegroundColor White
    Write-Host "  - Error Rate: Percentage of failed requests" -ForegroundColor White
    Write-Host "  - Availability: Uptime percentage" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Infrastructure Metrics:" -ForegroundColor Yellow
    Write-Host "  - CPU Usage: Processor utilization" -ForegroundColor White
    Write-Host "  - Memory Usage: RAM consumption" -ForegroundColor White
    Write-Host "  - Disk Usage: Storage space" -ForegroundColor White
    Write-Host "  - Network I/O: Data transfer rates" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Business Metrics:" -ForegroundColor Yellow
    Write-Host "  - User Registrations: New signups" -ForegroundColor White
    Write-Host "  - Active Users: Currently active" -ForegroundColor White
    Write-Host "  - Revenue: Financial metrics" -ForegroundColor White
    Write-Host "  - Feature Usage: Most used features" -ForegroundColor White
    Write-Host ""
}

# Function to show monitoring best practices
function Show-BestPractices {
    Write-Host "Monitoring Best Practices:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. The Four Golden Signals:" -ForegroundColor Yellow
    Write-Host "   - Latency: Time to serve requests" -ForegroundColor White
    Write-Host "   - Traffic: Demand on your system" -ForegroundColor White
    Write-Host "   - Errors: Rate of failed requests" -ForegroundColor White
    Write-Host "   - Saturation: How 'full' your service is" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. SLI, SLO, and SLA:" -ForegroundColor Yellow
    Write-Host "   - SLI: What you measure (99.9% uptime)" -ForegroundColor White
    Write-Host "   - SLO: Your target (99.95% uptime)" -ForegroundColor White
    Write-Host "   - SLA: What you promise customers" -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Alerting Strategy:" -ForegroundColor Yellow
    Write-Host "   - Alert on symptoms, not causes" -ForegroundColor White
    Write-Host "   - Use multiple severity levels" -ForegroundColor White
    Write-Host "   - Avoid alert fatigue" -ForegroundColor White
    Write-Host "   - Test alerts regularly" -ForegroundColor White
    Write-Host ""
}

# Function to show hands-on exercises
function Show-HandsOnExercises {
    Write-Host "Hands-on Learning Exercises:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Exercise 1: Start Monitoring Stack" -ForegroundColor Yellow
    Write-Host "1. Start Docker Desktop" -ForegroundColor White
    Write-Host "2. Run: docker-compose --profile monitoring up -d" -ForegroundColor White
    Write-Host "3. Access Prometheus: http://localhost:9090" -ForegroundColor White
    Write-Host "4. Access Grafana: http://localhost:3000 (admin/admin)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 2: Create a Dashboard" -ForegroundColor Yellow
    Write-Host "1. Login to Grafana" -ForegroundColor White
    Write-Host "2. Create new dashboard" -ForegroundColor White
    Write-Host "3. Add panels for CPU, memory, disk usage" -ForegroundColor White
    Write-Host "4. Save and share dashboard" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 3: Set Up Alerts" -ForegroundColor Yellow
    Write-Host "1. Configure alert rules in Prometheus" -ForegroundColor White
    Write-Host "2. Set up notification channels in Grafana" -ForegroundColor White
    Write-Host "3. Test alert conditions" -ForegroundColor White
    Write-Host "4. Verify alert delivery" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 4: Monitor Your App" -ForegroundColor Yellow
    Write-Host "1. Add metrics to your VK App" -ForegroundColor White
    Write-Host "2. Expose /metrics endpoint" -ForegroundColor White
    Write-Host "3. Configure Prometheus to scrape your app" -ForegroundColor White
    Write-Host "4. Create custom dashboards" -ForegroundColor White
    Write-Host ""
}

# Function to show troubleshooting
function Show-Troubleshooting {
    Write-Host "Common Monitoring Issues:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Issue: Too Many Metrics" -ForegroundColor Red
    Write-Host "Solution: Focus on key metrics, use sampling" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Issue: Alert Fatigue" -ForegroundColor Red
    Write-Host "Solution: Prioritize alerts, use severity levels" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Issue: False Positives" -ForegroundColor Red
    Write-Host "Solution: Tune thresholds, use multiple conditions" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Issue: Missing Context" -ForegroundColor Red
    Write-Host "Solution: Include relevant context, use runbooks" -ForegroundColor Green
    Write-Host ""
}

# Main execution
function Start-MonitoringPractice {
    Show-MonitoringConcepts
    Show-MonitoringStack
    Show-KeyMetrics
    Show-BestPractices
    Show-HandsOnExercises
    Show-Troubleshooting
    
    Write-Host "Ready to start monitoring! 🚀" -ForegroundColor Green
}

# Run the main function
Start-MonitoringPractice
