# DevOps Learning - CI/CD Pipeline Monitor
Write-Host "DevOps Learning - CI/CD Pipeline Monitor" -ForegroundColor Blue
Write-Host "=======================================" -ForegroundColor Blue

# Function to show GitHub Actions URL
function Show-ActionsURL {
    $repoUrl = git remote get-url origin
    $repoName = $repoUrl -replace '.*github\.com[:/]([^/]+/[^/]+)\.git.*', '$1'
    $actionsUrl = "https://github.com/$repoName/actions"
    
    Write-Host "GitHub Actions URL: $actionsUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Click the link above to see your CI/CD pipeline in action!" -ForegroundColor Yellow
}

# Function to explain what's happening
function Show-PipelineExplanation {
    Write-Host "What's happening in your CI/CD pipeline:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Code Quality Check" -ForegroundColor Yellow
    Write-Host "   - Running ESLint to check code style" -ForegroundColor White
    Write-Host "   - Running TypeScript compiler to check types" -ForegroundColor White
    Write-Host "   - This job will FAIL if there are linting errors" -ForegroundColor Red
    Write-Host ""
    
    Write-Host "2. Run Tests" -ForegroundColor Yellow
    Write-Host "   - Running Jest tests" -ForegroundColor White
    Write-Host "   - Checking test coverage" -ForegroundColor White
    Write-Host "   - This job will FAIL if tests fail" -ForegroundColor Red
    Write-Host ""
    
    Write-Host "3. Build Application" -ForegroundColor Yellow
    Write-Host "   - Only runs if previous jobs succeed" -ForegroundColor White
    Write-Host "   - Building web version of the app" -ForegroundColor White
    Write-Host "   - Creating build artifacts" -ForegroundColor White
    Write-Host ""
    
    Write-Host "4. Deploy to Production" -ForegroundColor Yellow
    Write-Host "   - Only runs on main/master branch" -ForegroundColor White
    Write-Host "   - Only runs if build succeeds" -ForegroundColor White
    Write-Host "   - Simulates production deployment" -ForegroundColor White
    Write-Host ""
}

# Function to show common issues and solutions
function Show-Troubleshooting {
    Write-Host "Common CI/CD Issues and Solutions:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Issue: Pipeline fails on ESLint" -ForegroundColor Red
    Write-Host "Solution: Fix linting errors locally first" -ForegroundColor Green
    Write-Host "  Run: npm run lint" -ForegroundColor White
    Write-Host "  Fix: npm run lint:fix" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Issue: Pipeline fails on tests" -ForegroundColor Red
    Write-Host "Solution: Run tests locally first" -ForegroundColor Green
    Write-Host "  Run: npm test" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Issue: Pipeline is slow" -ForegroundColor Red
    Write-Host "Solution: Use caching and parallel jobs" -ForegroundColor Green
    Write-Host "  - Cache node_modules" -ForegroundColor White
    Write-Host "  - Run independent jobs in parallel" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Issue: Deployment fails" -ForegroundColor Red
    Write-Host "Solution: Check environment variables and secrets" -ForegroundColor Green
    Write-Host "  - Verify GitHub Secrets are set" -ForegroundColor White
    Write-Host "  - Check deployment permissions" -ForegroundColor White
    Write-Host ""
}

# Function to show learning exercises
function Show-LearningExercises {
    Write-Host "CI/CD Learning Exercises:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Exercise 1: Break the Pipeline" -ForegroundColor Yellow
    Write-Host "1. Add a syntax error to a TypeScript file" -ForegroundColor White
    Write-Host "2. Commit and push" -ForegroundColor White
    Write-Host "3. Watch the pipeline fail on TypeScript check" -ForegroundColor White
    Write-Host "4. Fix the error and push again" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 2: Add a New Job" -ForegroundColor Yellow
    Write-Host "1. Edit .github/workflows/ci-simple.yml" -ForegroundColor White
    Write-Host "2. Add a new job that runs 'npm run format:check'" -ForegroundColor White
    Write-Host "3. Commit and push" -ForegroundColor White
    Write-Host "4. Watch the new job run" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 3: Environment-Specific Deployments" -ForegroundColor Yellow
    Write-Host "1. Create a develop branch: git checkout -b develop" -ForegroundColor White
    Write-Host "2. Make a change and push to develop" -ForegroundColor White
    Write-Host "3. Watch staging deployment trigger" -ForegroundColor White
    Write-Host "4. Merge develop to main" -ForegroundColor White
    Write-Host "5. Watch production deployment trigger" -ForegroundColor White
    Write-Host ""
}

# Main execution
function Start-CICDMonitor {
    Show-ActionsURL
    Show-PipelineExplanation
    Show-Troubleshooting
    Show-LearningExercises
    
    Write-Host "Happy Learning! 🚀" -ForegroundColor Green
}

# Run the main function
Start-CICDMonitor
