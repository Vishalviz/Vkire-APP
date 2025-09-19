# 🔧 GitHub Actions Setup Guide

## **🚀 Required GitHub Secrets**

To use the advanced CI/CD pipeline, you need to set up these secrets in your GitHub repository:

### **Step 1: Go to GitHub Repository Settings**
1. Navigate to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### **Step 2: Add Required Secrets**

#### **🔑 AWS Credentials**
```
Name: AWS_ACCESS_KEY_ID
Value: [Your AWS Access Key ID]

Name: AWS_SECRET_ACCESS_KEY  
Value: [Your AWS Secret Access Key]
```

#### **🪣 S3 Bucket Name**
```
Name: S3_BUCKET_NAME
Value: vkapp-098999664464-b7bk7fiaq8y1
```

#### **🔒 Optional Secrets (for advanced features)**
```
Name: SNYK_TOKEN
Value: [Your Snyk API token for security scanning]

Name: SLACK_WEBHOOK
Value: [Your Slack webhook URL for notifications]
```

### **Step 3: Verify Secrets**
Your secrets should look like this:
- ✅ `AWS_ACCESS_KEY_ID`
- ✅ `AWS_SECRET_ACCESS_KEY`
- ✅ `S3_BUCKET_NAME`
- ⚠️ `SNYK_TOKEN` (optional)
- ⚠️ `SLACK_WEBHOOK` (optional)

## **🎯 How the Pipeline Works**

### **Quality Gate**
- ✅ Runs tests, linting, type checking
- ✅ Security scanning (if SNYK_TOKEN provided)
- ✅ Quality checks with 70% minimum coverage

### **Build & Push**
- ✅ Builds Docker image
- ✅ Pushes to Amazon ECR
- ✅ Tags with commit SHA and latest

### **Deploy to Staging**
- ✅ Triggers on `develop` branch
- ✅ Deploys to S3 staging bucket
- ✅ Runs smoke tests

### **Deploy to Production**
- ✅ Triggers on `main` branch
- ✅ Deploys to production S3 bucket
- ✅ Runs health checks

### **Performance Testing**
- ✅ Runs k6 load tests (if available)
- ✅ Tests response times and error rates

### **Notifications**
- ✅ Sends Slack notifications (if configured)
- ✅ Creates deployment summary

## **🚀 Testing the Pipeline**

### **Test Staging Deployment**
```bash
# Create and push to develop branch
git checkout -b develop
git add .
git commit -m "Test staging deployment"
git push origin develop
```

### **Test Production Deployment**
```bash
# Create and push to main branch
git checkout main
git merge develop
git push origin main
```

## **📊 Monitoring Deployments**

1. **GitHub Actions Tab**: View pipeline progress
2. **AWS Console**: Check S3 bucket deployments
3. **CloudWatch Dashboard**: Monitor application metrics
4. **Slack Channel**: Get deployment notifications

## **🔧 Troubleshooting**

### **Common Issues**

#### **AWS Credentials Error**
```
Error: The security token included in the request is invalid
```
**Solution**: Check your AWS credentials in GitHub secrets

#### **S3 Bucket Not Found**
```
Error: NoSuchBucket
```
**Solution**: Verify S3_BUCKET_NAME secret matches your bucket

#### **Permission Denied**
```
Error: Access Denied
```
**Solution**: Ensure your AWS user has S3 and ECR permissions

### **Debug Steps**
1. Check GitHub Actions logs
2. Verify AWS credentials: `aws sts get-caller-identity`
3. Check S3 bucket exists: `aws s3 ls s3://your-bucket-name`
4. Verify ECR repository exists

## **🎉 Success Indicators**

You'll know the pipeline is working when you see:
- ✅ Green checkmarks in GitHub Actions
- ✅ Files deployed to S3 bucket
- ✅ CloudWatch metrics updating
- ✅ Slack notifications (if configured)

**Your advanced CI/CD pipeline is now ready! 🚀**
