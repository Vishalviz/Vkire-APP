# DevOps Learning - CI/CD Pipeline Practice Script
Write-Host "DevOps Learning - CI/CD Pipeline Practice" -ForegroundColor Blue
Write-Host "=========================================" -ForegroundColor Blue

# Function to check Git status
function Test-GitStatus {
    Write-Host "Checking Git status..." -ForegroundColor Yellow
    $status = git status --porcelain
    if ($status) {
        Write-Host "You have uncommitted changes:" -ForegroundColor Yellow
        Write-Host $status
        return $false
    }
    Write-Host "Working directory is clean" -ForegroundColor Green
    return $true
}

# Function to show current branch
function Show-CurrentBranch {
    $branch = git branch --show-current
    Write-Host "Current branch: $branch" -ForegroundColor Cyan
    return $branch
}

# Function to create a test change
function New-TestChange {
    Write-Host "Creating a test change..." -ForegroundColor Yellow
    
    # Create a simple test file
    $testContent = @"
# Test Change for CI/CD Learning
# Created at: $(Get-Date)
# This file is used to test our CI/CD pipeline

console.log('Hello from CI/CD learning!');
"@
    
    $testContent | Out-File -FilePath "VKApp/test-ci-cd.js" -Encoding UTF8
    Write-Host "Created test file: VKApp/test-ci-cd.js" -ForegroundColor Green
}

# Function to commit and push changes
function Invoke-CommitAndPush {
    param([string]$Branch)
    
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "Test CI/CD pipeline - DevOps learning session"
    
    Write-Host "Pushing to $Branch branch..." -ForegroundColor Yellow
    git push origin $Branch
    
    Write-Host "Changes pushed successfully!" -ForegroundColor Green
}

# Function to show CI/CD concepts
function Show-CIConcepts {
    Write-Host ""
    Write-Host "CI/CD Concepts:" -ForegroundColor Blue
    Write-Host "1. Continuous Integration (CI)" -ForegroundColor Yellow
    Write-Host "   - Automatically test code changes" -ForegroundColor White
    Write-Host "   - Validate code quality" -ForegroundColor White
    Write-Host "   - Build applications" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Continuous Deployment (CD)" -ForegroundColor Yellow
    Write-Host "   - Automatically deploy to staging/production" -ForegroundColor White
    Write-Host "   - Environment-specific deployments" -ForegroundColor White
    Write-Host "   - Rollback capabilities" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Pipeline Triggers" -ForegroundColor Yellow
    Write-Host "   - Push to main/develop branches" -ForegroundColor White
    Write-Host "   - Pull requests" -ForegroundColor White
    Write-Host "   - Manual triggers" -ForegroundColor White
}

# Function to show next steps
function Show-NextSteps {
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Blue
    Write-Host "1. Go to your GitHub repository" -ForegroundColor Yellow
    Write-Host "2. Click on 'Actions' tab" -ForegroundColor Yellow
    Write-Host "3. Watch your CI/CD pipeline run" -ForegroundColor Yellow
    Write-Host "4. Check the logs for each job" -ForegroundColor Yellow
    Write-Host "5. See how jobs depend on each other" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pipeline Jobs:" -ForegroundColor Cyan
    Write-Host "- Code Quality Check (ESLint, TypeScript)" -ForegroundColor White
    Write-Host "- Run Tests" -ForegroundColor White
    Write-Host "- Build Application" -ForegroundColor White
    Write-Host "- Deploy to Staging (develop branch only)" -ForegroundColor White
    Write-Host "- Deploy to Production (main branch only)" -ForegroundColor White
}

# Main execution
function Start-CICDPractice {
    Write-Host "Starting CI/CD practice session..." -ForegroundColor Green
    
    # Check Git status
    if (-not (Test-GitStatus)) {
        Write-Host "Please commit or stash your changes first" -ForegroundColor Red
        return
    }
    
    # Show current branch
    $currentBranch = Show-CurrentBranch
    
    # Show CI/CD concepts
    Show-CIConcepts
    
    # Ask user what they want to do
    Write-Host ""
    Write-Host "What would you like to do?" -ForegroundColor Yellow
    Write-Host "1. Create a test change and trigger CI/CD pipeline" -ForegroundColor White
    Write-Host "2. Just show me the concepts and next steps" -ForegroundColor White
    Write-Host "3. Switch to develop branch for staging deployment" -ForegroundColor White
    
    $choice = Read-Host "Enter your choice (1-3)"
    
    switch ($choice) {
        "1" {
            New-TestChange
            Invoke-CommitAndPush -Branch $currentBranch
            Show-NextSteps
        }
        "2" {
            Show-NextSteps
        }
        "3" {
            Write-Host "Switching to develop branch..." -ForegroundColor Yellow
            git checkout develop
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Now on develop branch - staging deployments will trigger" -ForegroundColor Green
                Show-NextSteps
            } else {
                Write-Host "Failed to switch to develop branch" -ForegroundColor Red
            }
        }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
        }
    }
}

# Run the main function
Start-CICDPractice
