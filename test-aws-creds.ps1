# Test AWS Credentials
Write-Host "Testing AWS Credentials..." -ForegroundColor Yellow

# Test 1: Check if AWS CLI is working
Write-Host "`n1. Testing AWS CLI version..." -ForegroundColor Cyan
aws --version

# Test 2: Check configuration
Write-Host "`n2. Checking AWS configuration..." -ForegroundColor Cyan
aws configure list

# Test 3: Test STS (Security Token Service)
Write-Host "`n3. Testing AWS STS..." -ForegroundColor Cyan
try {
    $result = aws sts get-caller-identity --output json
    Write-Host "✅ AWS Credentials are working!" -ForegroundColor Green
    Write-Host $result
} catch {
    Write-Host "❌ AWS Credentials failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test S3 access
Write-Host "`n4. Testing S3 access..." -ForegroundColor Cyan
try {
    $buckets = aws s3 ls --output json
    Write-Host "✅ S3 access is working!" -ForegroundColor Green
    Write-Host "Buckets: $buckets"
} catch {
    Write-Host "❌ S3 access failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Yellow
