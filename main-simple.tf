# Super Simple S3-only deployment for VK App
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}

# Data sources
data "aws_caller_identity" "current" {}

# Random string for bucket suffix
resource "random_string" "bucket_suffix" {
  length  = 12
  lower   = true
  numeric = true
  special = false
  upper   = false
}

# S3 Bucket for static files
resource "aws_s3_bucket" "vkapp_static" {
  bucket = "vkapp-${data.aws_caller_identity.current.account_id}-${random_string.bucket_suffix.result}"
  
  tags = {
    Name        = "vkapp-static"
    Environment = "staging"
    Project     = "VK App"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "vkapp_static" {
  bucket = aws_s3_bucket.vkapp_static.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Server Side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "vkapp_static" {
  bucket = aws_s3_bucket.vkapp_static.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "vkapp_static" {
  bucket = aws_s3_bucket.vkapp_static.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Bucket Policy for public read
resource "aws_s3_bucket_policy" "vkapp_static" {
  bucket = aws_s3_bucket.vkapp_static.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.vkapp_static.arn}/*"
      }
    ]
  })
}

# S3 Bucket Website Configuration
resource "aws_s3_bucket_website_configuration" "vkapp_static" {
  bucket = aws_s3_bucket.vkapp_static.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# Outputs
output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.vkapp_static.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.vkapp_static.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.vkapp_static.bucket_domain_name
}

output "website_url" {
  description = "URL to access your VK App"
  value       = "http://${aws_s3_bucket.vkapp_static.website_endpoint}"
}