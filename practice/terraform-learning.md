# DevOps Learning - Infrastructure as Code with Terraform

## 🎯 What is Infrastructure as Code (IaC)?

**Infrastructure as Code** is the practice of managing and provisioning infrastructure through code rather than manual processes.

### Benefits of IaC:
- **Version Control**: Track changes to infrastructure
- **Reproducibility**: Deploy identical environments
- **Automation**: Reduce manual errors
- **Documentation**: Code serves as documentation
- **Collaboration**: Team can review and contribute

## 🚀 What is Terraform?

**Terraform** is an open-source Infrastructure as Code tool that allows you to define and provision infrastructure using a declarative configuration language.

### Key Features:
- **Multi-Cloud**: Works with AWS, Azure, GCP, and more
- **Declarative**: Describe what you want, not how to get it
- **State Management**: Tracks current state of infrastructure
- **Plan and Apply**: Preview changes before applying
- **Modules**: Reusable infrastructure components

## 🏗️ Our Terraform Infrastructure

### What We're Building:
1. **VPC (Virtual Private Cloud)** - Isolated network environment
2. **Subnets** - Public and private network segments
3. **Internet Gateway** - Internet access for public subnets
4. **NAT Gateway** - Internet access for private subnets
5. **Security Groups** - Firewall rules
6. **RDS Database** - Managed PostgreSQL database
7. **ECS Cluster** - Container orchestration
8. **Application Load Balancer** - Traffic distribution
9. **S3 Bucket** - Object storage for static assets

### Architecture Overview:
```
Internet → ALB → ECS Service → RDS Database
                ↓
            S3 Bucket (Static Assets)
```

## 📋 Terraform Concepts

### 1. Providers
```hcl
provider "aws" {
  region = var.aws_region
}
```
- **What it does**: Connects Terraform to cloud providers
- **Examples**: AWS, Azure, Google Cloud, Docker

### 2. Resources
```hcl
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}
```
- **What it does**: Defines infrastructure components
- **Examples**: VPC, EC2 instances, databases

### 3. Variables
```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}
```
- **What it does**: Makes configurations reusable
- **Examples**: Region, instance size, environment

### 4. Outputs
```hcl
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}
```
- **What it does**: Exposes important values
- **Examples**: URLs, IDs, connection strings

### 5. Data Sources
```hcl
data "aws_availability_zones" "available" {
  state = "available"
}
```
- **What it does**: Fetches information from existing resources
- **Examples**: Available zones, AMI IDs, existing resources

## 🛠️ Terraform Workflow

### 1. Initialize
```bash
terraform init
```
- Downloads providers and modules
- Sets up backend for state storage

### 2. Plan
```bash
terraform plan
```
- Shows what changes will be made
- No changes are applied yet

### 3. Apply
```bash
terraform apply
```
- Creates, updates, or destroys resources
- Requires confirmation

### 4. Destroy
```bash
terraform destroy
```
- Removes all managed resources
- Use with caution!

## 🎯 Hands-on Learning Exercises

### Exercise 1: Understanding the Configuration
1. Read through `infrastructure/terraform/main.tf`
2. Identify different resource types
3. Understand the relationships between resources

### Exercise 2: Customizing Variables
1. Edit `infrastructure/terraform/variables.tf`
2. Change default values
3. Add new variables for customization

### Exercise 3: Adding New Resources
1. Add an S3 bucket for logs
2. Add CloudWatch alarms
3. Add Route 53 DNS records

### Exercise 4: Using Modules
1. Create a module for the VPC
2. Create a module for the database
3. Use modules in main configuration

## 🔧 Terraform Best Practices

### 1. File Organization
```
terraform/
├── main.tf          # Main configuration
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── terraform.tfvars # Variable values
└── modules/         # Reusable modules
```

### 2. State Management
- **Remote State**: Store state in S3 or similar
- **State Locking**: Prevent concurrent modifications
- **State Backups**: Regular backups of state files

### 3. Security
- **Secrets Management**: Use AWS Secrets Manager
- **Least Privilege**: Minimal required permissions
- **Encryption**: Encrypt sensitive data

### 4. Naming Conventions
```hcl
resource "aws_vpc" "main" {
  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```

## 🚨 Common Terraform Issues

### 1. State Drift
- **Problem**: Infrastructure changed outside Terraform
- **Solution**: Import existing resources or refresh state

### 2. Resource Dependencies
- **Problem**: Resources created in wrong order
- **Solution**: Use `depends_on` or implicit dependencies

### 3. Variable Validation
- **Problem**: Invalid variable values
- **Solution**: Add validation rules to variables

### 4. Provider Version Conflicts
- **Problem**: Multiple provider versions
- **Solution**: Pin provider versions in configuration

## 📊 Cost Optimization

### 1. Right-Sizing
- Choose appropriate instance types
- Use spot instances for non-critical workloads
- Implement auto-scaling

### 2. Resource Lifecycle
- Use `lifecycle` rules for updates
- Implement proper backup strategies
- Clean up unused resources

### 3. Monitoring
- Set up billing alerts
- Monitor resource utilization
- Use AWS Cost Explorer

## 🎯 Next Steps

1. **Start Small**: Begin with simple resources
2. **Use Modules**: Create reusable components
3. **Implement CI/CD**: Automate Terraform deployments
4. **Add Monitoring**: Track infrastructure health
5. **Security Review**: Regular security assessments

## 📚 Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs/)
- [AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/)
- [Infrastructure as Code Patterns](https://docs.microsoft.com/en-us/azure/devops/learn/what-is-infrastructure-as-code)
