# Core AWS Monitoring for VK App
# Simplified monitoring setup that works with existing S3 deployment

# CloudWatch Log Group for application logs
resource "aws_cloudwatch_log_group" "vkapp_logs" {
  name              = "/aws/vkapp/application"
  retention_in_days = 30

  tags = {
    Name        = "vkapp-logs"
    Environment = "staging"
    Project     = "VK App"
  }
}

# CloudWatch Dashboard for VK App
resource "aws_cloudwatch_dashboard" "vkapp_dashboard" {
  dashboard_name = "VK-App-Dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/S3", "NumberOfObjects", "BucketName", aws_s3_bucket.vkapp_static.bucket],
            [".", "BucketSizeBytes", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "us-east-1"
          title   = "S3 Bucket Metrics"
          period  = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/S3", "4xxErrors", "BucketName", aws_s3_bucket.vkapp_static.bucket],
            [".", "5xxErrors", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = "us-east-1"
          title   = "S3 Error Rates"
          period  = 300
        }
      },
      {
        type   = "log"
        x      = 0
        y      = 6
        width  = 24
        height = 6

        properties = {
          query   = "SOURCE '/aws/vkapp/application' | fields @timestamp, @message | sort @timestamp desc | limit 100"
          region  = "us-east-1"
          title   = "Application Logs"
          view    = "table"
        }
      }
    ]
  })
}

# CloudWatch Alarms for S3 bucket
resource "aws_cloudwatch_metric_alarm" "s3_high_error_rate" {
  alarm_name          = "vkapp-s3-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4xxErrors"
  namespace           = "AWS/S3"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors S3 4xx errors"
  alarm_actions       = [aws_sns_topic.vkapp_alerts.arn]

  dimensions = {
    BucketName = aws_s3_bucket.vkapp_static.bucket
  }

  tags = {
    Name        = "vkapp-s3-error-alarm"
    Environment = "staging"
  }
}

resource "aws_cloudwatch_metric_alarm" "s3_server_errors" {
  alarm_name          = "vkapp-s3-server-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "5xxErrors"
  namespace           = "AWS/S3"
  period              = "300"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "This metric monitors S3 5xx server errors"
  alarm_actions       = [aws_sns_topic.vkapp_alerts.arn]

  dimensions = {
    BucketName = aws_s3_bucket.vkapp_static.bucket
  }

  tags = {
    Name        = "vkapp-s3-server-error-alarm"
    Environment = "staging"
  }
}

# SNS Topic for alerts
resource "aws_sns_topic" "vkapp_alerts" {
  name = "vkapp-alerts"

  tags = {
    Name        = "vkapp-alerts"
    Environment = "staging"
    Project     = "VK App"
  }
}

# SNS Topic Subscription (Email - you'll need to confirm this)
resource "aws_sns_topic_subscription" "vkapp_alerts_email" {
  topic_arn = aws_sns_topic.vkapp_alerts.arn
  protocol  = "email"
  endpoint  = "your-email@example.com"  # Replace with your email
}

# Outputs for monitoring resources
output "cloudwatch_dashboard_url" {
  description = "URL to the CloudWatch Dashboard"
  value       = "https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=${aws_cloudwatch_dashboard.vkapp_dashboard.dashboard_name}"
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for alerts"
  value       = aws_sns_topic.vkapp_alerts.arn
}

output "log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.vkapp_logs.name
}
