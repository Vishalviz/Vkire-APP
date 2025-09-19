# AWS Setup Script for Terraform
Write-Host "🔐 AWS Credentials Setup for Terraform" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n📋 To get your AWS credentials:" -ForegroundColor Yellow
Write-Host "1. Go to AWS Console: https://console.aws.amazon.com" -ForegroundColor Cyan
Write-Host "2. IAM → Users → Your User → Security Credentials" -ForegroundColor Cyan
Write-Host "3. Create Access Key → Command Line Interface (CLI)" -ForegroundColor Cyan
Write-Host "4. Copy Access Key ID and Secret Access Key" -ForegroundColor Cyan

Write-Host "`n🔑 Enter your AWS credentials:" -ForegroundColor Yellow
$accessKey = Read-Host "AKIARODGW75INXHHMFNK"
$secretKey = Read-Host "j2ALyh9xY//Bh2dywRq+eDU+LPJwaQxxNuAX8PLV"
$region = Read-Host "AWS Region (default: us-east-1)"

if ([string]::IsNullOrEmpty($region)) {
    $region = "us-east-1"
}

# Set environment variables for Terraform
$env:AWS_ACCESS_KEY_ID = $accessKey
$env:AWS_SECRET_ACCESS_KEY = $secretKey
$env:AWS_DEFAULT_REGION = $region

Write-Host "`n✅ AWS credentials set as environment variables" -ForegroundColor Green
Write-Host "Access Key: $($accessKey.Substring(0,8))..." -ForegroundColor Green
Write-Host "Region: $region" -ForegroundColor Green

Write-Host "`n🧪 Testing AWS connection..." -ForegroundColor Yellow
try {
    $result = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AWS connection successful!" -ForegroundColor Green
        Write-Host $result -ForegroundColor Green
    } else {
        Write-Host "❌ AWS connection failed. Please check your credentials." -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} catch {
    Write-Host "❌ AWS CLI not working. Let's use Terraform directly." -ForegroundColor Yellow
}

Write-Host "`n🚀 Ready to deploy with Terraform!" -ForegroundColor Green
Write-Host "Run: terraform init" -ForegroundColor Cyan
Write-Host "Run: terraform plan" -ForegroundColor Cyan
Write-Host "Run: terraform apply" -ForegroundColor Cyan
