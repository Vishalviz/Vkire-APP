# AWS Security Best Practices for VK App
# This implements comprehensive security measures for the S3 deployment

# KMS Key for S3 bucket encryption
resource "aws_kms_key" "vkapp_s3_key" {
  description             = "KMS key for VK App S3 bucket encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "vkapp-s3-kms-key"
    Environment = "staging"
    Project     = "VK App"
  }
}

resource "aws_kms_alias" "vkapp_s3_key_alias" {
  name          = "alias/vkapp-s3-key"
  target_key_id = aws_kms_key.vkapp_s3_key.key_id
}

# Enhanced S3 bucket encryption with KMS
resource "aws_s3_bucket_server_side_encryption_configuration" "vkapp_static_kms" {
  bucket = aws_s3_bucket.vkapp_static.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.vkapp_s3_key.arn
      sse_algorithm     = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

# S3 Bucket Lifecycle Configuration
resource "aws_s3_bucket_lifecycle_configuration" "vkapp_static" {
  bucket = aws_s3_bucket.vkapp_static.id

  rule {
    id     = "delete_old_versions"
    status = "Enabled"

    filter {
      prefix = ""
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# S3 Bucket Notification Configuration for security monitoring
# Note: S3 notifications require additional SNS topic setup
# This is commented out to avoid configuration errors

# CloudTrail for API auditing
resource "aws_cloudtrail" "vkapp_trail" {
  name                          = "vkapp-security-trail"
  s3_bucket_name                = aws_s3_bucket.vkapp_static.bucket
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_logging                = true

  event_selector {
    read_write_type                 = "All"
    include_management_events       = true
    data_resource {
      type   = "AWS::S3::Object"
      values = ["${aws_s3_bucket.vkapp_static.arn}/*"]
    }
  }

  tags = {
    Name        = "vkapp-security-trail"
    Environment = "staging"
    Project     = "VK App"
  }
}

# AWS Config for compliance monitoring
resource "aws_config_configuration_recorder" "vkapp_config" {
  name     = "vkapp-config-recorder"
  role_arn = aws_iam_role.config_role.arn

  recording_group {
    all_supported                 = true
    include_global_resource_types = true
  }
}

resource "aws_config_delivery_channel" "vkapp_config" {
  name           = "vkapp-config-delivery"
  s3_bucket_name = aws_s3_bucket.vkapp_static.bucket
}

# IAM Role for AWS Config
resource "aws_iam_role" "config_role" {
  name = "vkapp-config-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "config_role_policy" {
  role       = aws_iam_role.config_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/ConfigRole"
}

# Security Groups (for future use with EC2/ECS)
resource "aws_security_group" "vkapp_web" {
  name_prefix = "vkapp-web-"
  description = "Security group for VK App web tier"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "vkapp-web-sg"
    Environment = "staging"
    Project     = "VK App"
  }
}

# AWS WAF Web ACL for S3 protection
resource "aws_wafv2_web_acl" "vkapp_waf" {
  name  = "vkapp-waf"
  scope = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "KnownBadInputsMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "vkappWafMetric"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "vkapp-waf"
    Environment = "staging"
    Project     = "VK App"
  }
}

# GuardDuty for threat detection
resource "aws_guardduty_detector" "vkapp_guardduty" {
  enable = true

  datasources {
    s3_logs {
      enable = true
    }
    kubernetes {
      audit_logs {
        enable = true
      }
    }
  }

  tags = {
    Name        = "vkapp-guardduty"
    Environment = "staging"
    Project     = "VK App"
  }
}

# Security Hub for centralized security findings
resource "aws_securityhub_account" "vkapp_securityhub" {
  enable_default_standards = true
}

# IAM Access Analyzer
resource "aws_accessanalyzer_analyzer" "vkapp_analyzer" {
  analyzer_name = "vkapp-access-analyzer"
  type          = "ACCOUNT"

  tags = {
    Name        = "vkapp-access-analyzer"
    Environment = "staging"
    Project     = "VK App"
  }
}

# Outputs for security resources
output "kms_key_id" {
  description = "ID of the KMS key for S3 encryption"
  value       = aws_kms_key.vkapp_s3_key.key_id
}

output "kms_key_arn" {
  description = "ARN of the KMS key for S3 encryption"
  value       = aws_kms_key.vkapp_s3_key.arn
}

output "cloudtrail_name" {
  description = "Name of the CloudTrail for API auditing"
  value       = aws_cloudtrail.vkapp_trail.name
}

output "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = aws_wafv2_web_acl.vkapp_waf.arn
}

output "guardduty_detector_id" {
  description = "ID of the GuardDuty detector"
  value       = aws_guardduty_detector.vkapp_guardduty.id
}
