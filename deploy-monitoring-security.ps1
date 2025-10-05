# Deploy AWS Monitoring and Security for VK App
# This script extends the existing S3 deployment with comprehensive monitoring and security

Write-Host "🚀 Deploying AWS Monitoring and Security for VK App..." -ForegroundColor Green

# Check if AWS CLI is configured
Write-Host "`n📋 Checking AWS CLI configuration..." -ForegroundColor Yellow
$awsIdentity = aws sts get-caller-identity 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS CLI not configured. Please run setup-aws.ps1 first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ AWS CLI configured successfully" -ForegroundColor Green

# Check if Terraform is installed
Write-Host "`n📋 Checking Terraform installation..." -ForegroundColor Yellow
$terraformVersion = terraform version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform not installed. Please install Terraform first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Terraform is installed" -ForegroundColor Green

# Initialize Terraform
Write-Host "`n🔧 Initializing Terraform..." -ForegroundColor Yellow
terraform init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform initialization failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Terraform initialized successfully" -ForegroundColor Green

# Plan the deployment
Write-Host "`n📋 Planning Terraform deployment..." -ForegroundColor Yellow
terraform plan -out=tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform plan failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Terraform plan created successfully" -ForegroundColor Green

# Apply the deployment
Write-Host "`n🚀 Applying Terraform deployment..." -ForegroundColor Yellow
terraform apply tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Terraform apply failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Terraform deployment completed successfully" -ForegroundColor Green

# Get outputs
Write-Host "`n📊 Getting deployment outputs..." -ForegroundColor Yellow
terraform output

# Display monitoring URLs
Write-Host "`n🎯 Monitoring and Security Setup Complete!" -ForegroundColor Green
Write-Host "`n📊 Monitoring Resources:" -ForegroundColor Cyan
Write-Host "• CloudWatch Dashboard: Check the output above for the URL" -ForegroundColor White
Write-Host "• CloudWatch Logs: /aws/vkapp/application" -ForegroundColor White
Write-Host "• SNS Alerts: Configured for error notifications" -ForegroundColor White

Write-Host "`n🔒 Security Resources:" -ForegroundColor Cyan
Write-Host "• KMS Encryption: Enabled for S3 bucket" -ForegroundColor White
Write-Host "• CloudTrail: API auditing enabled" -ForegroundColor White
Write-Host "• GuardDuty: Threat detection enabled" -ForegroundColor White
Write-Host "• WAF: Web application firewall configured" -ForegroundColor White
Write-Host "• Security Hub: Centralized security findings" -ForegroundColor White

Write-Host "`n📧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Check your email to confirm SNS subscription" -ForegroundColor White
Write-Host "2. Visit the CloudWatch Dashboard URL" -ForegroundColor White
Write-Host "3. Review security findings in Security Hub" -ForegroundColor White
Write-Host "4. Configure additional monitoring as needed" -ForegroundColor White

Write-Host "`n🎉 AWS Monitoring and Security deployment completed!" -ForegroundColor Green
