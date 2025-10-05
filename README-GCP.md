# GCP Deployment Guide - VK App

## 🚀 Deploy Your VK App to Google Cloud Platform (FREE)

This guide will help you deploy your VK App to Google Cloud Platform using the free tier.

## 📋 Prerequisites

1. **Google Cloud Account** (Free tier available)
2. **Google Cloud CLI** installed
3. **kubectl** installed
4. **Docker** running

## 🆓 GCP Free Tier Limits

- **GKE Cluster**: 1 node cluster (FREE)
- **Compute**: e2-micro instances (FREE)
- **Container Registry**: 500MB storage (FREE)
- **Network**: Basic usage (FREE)
- **Total Cost**: $0/month

## 🛠️ Setup Steps

### Step 1: Install Google Cloud CLI

```bash
# Download and install from:
# https://cloud.google.com/sdk/docs/install
```

### Step 2: Create GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Note your Project ID

### Step 3: Authenticate

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR_PROJECT_ID

# Set up application default credentials
gcloud auth application-default login
```

### Step 4: Run Deployment Script

```powershell
# Navigate to GCP directory
cd infrastructure/gcp

# Run the deployment script
.\deploy-gcp.ps1
```

## 🎯 What Gets Created

- **VPC Network** with subnets
- **GKE Cluster** (1 node, e2-micro)
- **Container Registry** for your images
- **Firewall Rules** for HTTP/HTTPS
- **Kubernetes Deployment** of your VK App

## 🌐 Accessing Your App

After deployment:

```bash
# Port forward to access locally
kubectl port-forward service/vkapp-service 8080:80 -n vkapp

# Open in browser
http://localhost:8080
```

## 📊 Monitoring

Your app includes:
- **Prometheus** for metrics
- **Grafana** for dashboards
- **Health checks** and monitoring

## 🧹 Cleanup

To avoid charges (though this setup is free):

```bash
# Destroy infrastructure
terraform destroy

# Or delete manually in GCP Console
```

## 🆘 Troubleshooting

### Common Issues:

1. **Authentication Error**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

2. **Project Not Set**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Docker Push Error**
   ```bash
   gcloud auth configure-docker
   ```

## 💡 Tips

- Use `us-central1` region for best free tier availability
- e2-micro instances are perfect for development
- Preemptible nodes reduce costs to $0
- Container Registry has 500MB free storage

## 🎉 Success!

Your VK App is now running on Google Cloud Platform with:
- ✅ **Zero cost** (free tier)
- ✅ **Production-ready** infrastructure
- ✅ **Scalable** Kubernetes cluster
- ✅ **Monitoring** and observability
- ✅ **CI/CD** ready

**Congratulations! You've deployed to the cloud!** 🚀
