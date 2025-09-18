# DevOps Learning - Terraform Infrastructure as Code Practice
Write-Host "DevOps Learning - Terraform Infrastructure as Code Practice" -ForegroundColor Blue
Write-Host "=======================================================" -ForegroundColor Blue

# Function to check if Terraform is installed
function Test-Terraform {
    if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
        Write-Host "Terraform is not installed" -ForegroundColor Red
        Write-Host "Please install Terraform first:" -ForegroundColor Yellow
        Write-Host "1. Download from: https://www.terraform.io/downloads" -ForegroundColor White
        Write-Host "2. Or use: winget install HashiCorp.Terraform" -ForegroundColor White
        return $false
    }
    
    $version = terraform version
    Write-Host "Terraform is installed:" -ForegroundColor Green
    Write-Host $version
    return $true
}

# Function to show Terraform concepts
function Show-TerraformConcepts {
    Write-Host "Terraform Concepts:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Infrastructure as Code (IaC)" -ForegroundColor Yellow
    Write-Host "   - Manage infrastructure through code" -ForegroundColor White
    Write-Host "   - Version control for infrastructure" -ForegroundColor White
    Write-Host "   - Reproducible deployments" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. Providers" -ForegroundColor Yellow
    Write-Host "   - Connect to cloud platforms (AWS, Azure, GCP)" -ForegroundColor White
    Write-Host "   - Manage different resource types" -ForegroundColor White
    Write-Host "   - Plugin-based architecture" -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Resources" -ForegroundColor Yellow
    Write-Host "   - Infrastructure components (VPC, EC2, RDS)" -ForegroundColor White
    Write-Host "   - Declarative configuration" -ForegroundColor White
    Write-Host "   - State management" -ForegroundColor White
    Write-Host ""
    
    Write-Host "4. State" -ForegroundColor Yellow
    Write-Host "   - Tracks current infrastructure state" -ForegroundColor White
    Write-Host "   - Enables updates and deletions" -ForegroundColor White
    Write-Host "   - Should be stored remotely" -ForegroundColor White
    Write-Host ""
}

# Function to show our infrastructure
function Show-OurInfrastructure {
    Write-Host "Our VK App Infrastructure:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Networking:" -ForegroundColor Cyan
    Write-Host "  - VPC (Virtual Private Cloud)" -ForegroundColor White
    Write-Host "  - Public and Private Subnets" -ForegroundColor White
    Write-Host "  - Internet Gateway" -ForegroundColor White
    Write-Host "  - NAT Gateway" -ForegroundColor White
    Write-Host "  - Security Groups" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Compute:" -ForegroundColor Cyan
    Write-Host "  - ECS Cluster (Container orchestration)" -ForegroundColor White
    Write-Host "  - Application Load Balancer" -ForegroundColor White
    Write-Host "  - Auto Scaling Groups" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Storage:" -ForegroundColor Cyan
    Write-Host "  - RDS PostgreSQL Database" -ForegroundColor White
    Write-Host "  - S3 Bucket (Static assets)" -ForegroundColor White
    Write-Host "  - EFS (Shared file system)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Monitoring:" -ForegroundColor Cyan
    Write-Host "  - CloudWatch Logs" -ForegroundColor White
    Write-Host "  - CloudWatch Metrics" -ForegroundColor White
    Write-Host "  - CloudWatch Alarms" -ForegroundColor White
    Write-Host ""
}

# Function to show Terraform workflow
function Show-TerraformWorkflow {
    Write-Host "Terraform Workflow:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Initialize (terraform init)" -ForegroundColor Yellow
    Write-Host "   - Download providers and modules" -ForegroundColor White
    Write-Host "   - Set up backend for state storage" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. Plan (terraform plan)" -ForegroundColor Yellow
    Write-Host "   - Show what changes will be made" -ForegroundColor White
    Write-Host "   - No changes are applied yet" -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Apply (terraform apply)" -ForegroundColor Yellow
    Write-Host "   - Create, update, or destroy resources" -ForegroundColor White
    Write-Host "   - Requires confirmation" -ForegroundColor White
    Write-Host ""
    
    Write-Host "4. Destroy (terraform destroy)" -ForegroundColor Yellow
    Write-Host "   - Remove all managed resources" -ForegroundColor White
    Write-Host "   - Use with caution!" -ForegroundColor White
    Write-Host ""
}

# Function to show hands-on exercises
function Show-HandsOnExercises {
    Write-Host "Hands-on Learning Exercises:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "Exercise 1: Explore Configuration" -ForegroundColor Yellow
    Write-Host "1. Navigate to: infrastructure/terraform/" -ForegroundColor White
    Write-Host "2. Read main.tf to understand resources" -ForegroundColor White
    Write-Host "3. Check variables.tf for customization options" -ForegroundColor White
    Write-Host "4. Review outputs.tf for important values" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 2: Validate Configuration" -ForegroundColor Yellow
    Write-Host "1. Run: terraform validate" -ForegroundColor White
    Write-Host "2. Run: terraform fmt" -ForegroundColor White
    Write-Host "3. Run: terraform plan" -ForegroundColor White
    Write-Host "4. Review the planned changes" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 3: Customize Variables" -ForegroundColor Yellow
    Write-Host "1. Copy terraform.tfvars.example to terraform.tfvars" -ForegroundColor White
    Write-Host "2. Edit terraform.tfvars with your values" -ForegroundColor White
    Write-Host "3. Run terraform plan to see changes" -ForegroundColor White
    Write-Host "4. Compare with default values" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Exercise 4: Add New Resources" -ForegroundColor Yellow
    Write-Host "1. Add an S3 bucket for application logs" -ForegroundColor White
    Write-Host "2. Add CloudWatch alarms for monitoring" -ForegroundColor White
    Write-Host "3. Add Route 53 DNS records" -ForegroundColor White
    Write-Host "4. Test with terraform plan" -ForegroundColor White
    Write-Host ""
}

# Function to show best practices
function Show-BestPractices {
    Write-Host "Terraform Best Practices:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. File Organization:" -ForegroundColor Yellow
    Write-Host "   - main.tf: Main configuration" -ForegroundColor White
    Write-Host "   - variables.tf: Input variables" -ForegroundColor White
    Write-Host "   - outputs.tf: Output values" -ForegroundColor White
    Write-Host "   - terraform.tfvars: Variable values" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. State Management:" -ForegroundColor Yellow
    Write-Host "   - Use remote state (S3, Azure Storage)" -ForegroundColor White
    Write-Host "   - Enable state locking" -ForegroundColor White
    Write-Host "   - Regular state backups" -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Security:" -ForegroundColor Yellow
    Write-Host "   - Never commit secrets to code" -ForegroundColor White
    Write-Host "   - Use AWS Secrets Manager" -ForegroundColor White
    Write-Host "   - Implement least privilege access" -ForegroundColor White
    Write-Host ""
    
    Write-Host "4. Naming Conventions:" -ForegroundColor Yellow
    Write-Host "   - Use consistent naming patterns" -ForegroundColor White
    Write-Host "   - Include environment and project names" -ForegroundColor White
    Write-Host "   - Use descriptive resource names" -ForegroundColor White
    Write-Host ""
}

# Function to show cost optimization
function Show-CostOptimization {
    Write-Host "Cost Optimization Tips:" -ForegroundColor Blue
    Write-Host ""
    
    Write-Host "1. Right-Sizing:" -ForegroundColor Yellow
    Write-Host "   - Choose appropriate instance types" -ForegroundColor White
    Write-Host "   - Use spot instances for non-critical workloads" -ForegroundColor White
    Write-Host "   - Implement auto-scaling" -ForegroundColor White
    Write-Host ""
    
    Write-Host "2. Resource Lifecycle:" -ForegroundColor Yellow
    Write-Host "   - Use lifecycle rules for updates" -ForegroundColor White
    Write-Host "   - Implement proper backup strategies" -ForegroundColor White
    Write-Host "   - Clean up unused resources" -ForegroundColor White
    Write-Host ""
    
    Write-Host "3. Monitoring:" -ForegroundColor Yellow
    Write-Host "   - Set up billing alerts" -ForegroundColor White
    Write-Host "   - Monitor resource utilization" -ForegroundColor White
    Write-Host "   - Use AWS Cost Explorer" -ForegroundColor White
    Write-Host ""
}

# Main execution
function Start-TerraformPractice {
    if (-not (Test-Terraform)) {
        return
    }
    
    Show-TerraformConcepts
    Show-OurInfrastructure
    Show-TerraformWorkflow
    Show-HandsOnExercises
    Show-BestPractices
    Show-CostOptimization
    
    Write-Host "Ready to practice Infrastructure as Code! 🚀" -ForegroundColor Green
}

# Run the main function
Start-TerraformPractice
